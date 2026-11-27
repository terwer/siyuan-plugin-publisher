/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { md5Hex } from "~/src/utils/cryptoUtils.ts"
import { applyDiagramReplacements, findDiagramFences, type DiagramFence } from "~/src/utils/diagram/diagramFenceParser.ts"
import {
  type DiagramAssetWriter,
  type DiagramFinalizeResult,
  type DiagramPrepareOptions,
  type DiagramPrepareResult,
  type DiagramPreparedAsset,
  type DiagramRenderer,
} from "~/src/utils/diagram/diagramTypes.ts"

const DIAGRAM_ALT = (language: string) => `${language} diagram`

const imageMarkdown = (language: string, assetPath: string): string => {
  return `![${DIAGRAM_ALT(language)}](${assetPath})`
}

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error ?? "unknown error")
}

/**
 * 文本图渲染与临时资产桥。
 *
 * 渲染结果不直接上传图床，而是先写成思源临时资产并替换为本地图片标记；
 * 这样 PicGo / 平台图床 / 本地目录等所有现有图片链路都能统一处理，
 * 不需要为图表复制一套上传逻辑。上传失败时 `finalize` 把本地标记还原为代码块。
 */
export class DiagramRenderService {
  private readonly renderer: DiagramRenderer
  private readonly writer: DiagramAssetWriter

  constructor(renderer: DiagramRenderer, writer: DiagramAssetWriter) {
    this.renderer = renderer
    this.writer = writer
  }

  async prepare(markdown: string, options: DiagramPrepareOptions): Promise<DiagramPrepareResult> {
    const fences = findDiagramFences(markdown)
    if (!options.enabled || options.skip || fences.length === 0) {
      return {
        markdown,
        assets: [],
        errors: [],
        converted: 0,
        skipped: fences.length,
      }
    }

    const assets: DiagramPreparedAsset[] = []
    const errors: string[] = []
    const replacements: { start: number; end: number; text: string }[] = []
    const rendered = new Map<string, Uint8Array>()
    let converted = 0
    let skipped = 0

    for (const fence of fences) {
      try {
        const name = this.assetName(fence)
        let png = rendered.get(name)
        if (!png) {
          png = await this.renderer.render({
            language: fence.language,
            code: fence.code,
            theme: options.theme,
            scale: options.scale,
            plantUmlServePath: options.plantUmlServePath,
          })
          if (!png || png.byteLength === 0) {
            throw new Error("渲染器返回了空图片")
          }
          await this.writer.write(name, png)
          rendered.set(name, png)
        }
        const token = `${fence.indent}${imageMarkdown(fence.language, `assets/${name}`)}`
        assets.push({
          name,
          token,
          fenceText: fence.fenceText,
          language: fence.language,
        })
        replacements.push({ start: fence.start, end: fence.end, text: token })
        converted += 1
      } catch (error) {
        skipped += 1
        errors.push(`${fence.language} 文本图渲染失败：${toErrorMessage(error)}；已保留代码块`)
      }
    }

    return {
      markdown: applyDiagramReplacements(markdown, replacements),
      assets,
      errors,
      converted,
      skipped,
    }
  }

  /**
   * 图片上传阶段结束后调用。
   *
   * 如果本地图片标记仍在正文里，说明图床/平台没有完成上传替换，此时还原为代码块，
   * 避免发布出指向思源临时资产的坏链接。
   */
  async finalize(markdown: string, assets: DiagramPreparedAsset[]): Promise<DiagramFinalizeResult> {
    let result = markdown
    const errors: string[] = []
    let reverted = 0
    for (const asset of assets) {
      if (!result.includes(asset.token)) {
        continue
      }
      result = result.split(asset.token).join(asset.fenceText)
      reverted += 1
      errors.push(`${asset.language} 文本图上传失败：图片未进入图床或平台；已保留代码块`)
    }
    return {
      markdown: result,
      errors,
      converted: assets.length - reverted,
      reverted,
    }
  }

  async cleanup(assets: DiagramPreparedAsset[]): Promise<void> {
    const names = [...new Set(assets.map((asset) => asset.name))]
    await Promise.all(
      names.map(async (name) => {
        try {
          await this.writer.remove(name)
        } catch {
          // 清理失败不阻断发布；下一次发布会重新生成同名临时资产
        }
      })
    )
  }

  dispose(): void {
    this.renderer.dispose()
  }

  private assetName(fence: DiagramFence): string {
    const hash = md5Hex(`${fence.language}\n${fence.code}`)
    return `syp-diagram-${hash}.png`
  }
}
