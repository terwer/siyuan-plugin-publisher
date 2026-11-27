/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SiyuanDevice } from "zhi-device"
import type { SiyuanKernelApi } from "zhi-siyuan-api"
import type { DiagramAssetWriter } from "~/src/utils/diagram/diagramTypes.ts"

const ASSET_NAME_RE = /^[A-Za-z0-9._-]+$/

/**
 * 把渲染出的 PNG 写成思源临时资产。
 *
 * 桌面端优先直接写入 `data/assets`，避免额外的 multipart 往返；浏览器宿主回退到
 * 内核 `/api/file/putFile`。文件会在发布图片阶段结束后由 `cleanup` 删除。
 */
export class SiyuanDiagramAssetWriter implements DiagramAssetWriter {
  private readonly kernelApi: SiyuanKernelApi
  private readonly hostWindow?: any

  constructor(kernelApi: SiyuanKernelApi, hostWindow?: any) {
    this.kernelApi = kernelApi
    this.hostWindow = hostWindow
  }

  async write(name: string, bytes: Uint8Array): Promise<void> {
    this.assertName(name)
    const fs = this.resolveNodeFs()
    const dataDir = this.resolveDataDir()
    if (fs && dataDir) {
      const assetsDir = `${dataDir}/assets`
      fs.mkdirSync(assetsDir, { recursive: true })
      fs.writeFileSync(`${assetsDir}/${name}`, bytes)
      return
    }
    const payload = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
    const file = new File([payload], name, { type: "image/png" })
    await this.kernelApi.putFile(`assets/${name}`, file)
  }

  async remove(name: string): Promise<void> {
    this.assertName(name)
    const fs = this.resolveNodeFs()
    const dataDir = this.resolveDataDir()
    if (fs && dataDir) {
      fs.rmSync(`${dataDir}/assets/${name}`, { force: true })
      return
    }
    await this.kernelApi.removeFile(`assets/${name}`)
  }

  private assertName(name: string): void {
    if (!ASSET_NAME_RE.test(name)) {
      throw new Error(`非法的文本图资产名: ${name}`)
    }
  }

  private resolveNodeFs(): any {
    const win = this.hostWindow ?? SiyuanDevice.siyuanWindow()
    try {
      return win?.require?.("fs")
    } catch {
      return undefined
    }
  }

  private resolveDataDir(): string {
    const win = this.hostWindow ?? SiyuanDevice.siyuanWindow()
    return String(win?.siyuan?.config?.system?.dataDir ?? "")
  }
}
