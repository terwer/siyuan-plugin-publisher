/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import * as cheerio from "cheerio"
import { MathRenderModeEnum } from "zhi-blog-api"
import { mathjax } from "mathjax-full/js/mathjax.js"
import { TeX } from "mathjax-full/js/input/tex.js"
import { SVG } from "mathjax-full/js/output/svg.js"
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js"
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js"
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js"
import KatexUtils from "~/src/utils/katexUtils.ts"
import { HtmlMathUtils } from "~/src/utils/htmlMathUtils.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 公式渲染选项
 */
interface FormulaRenderOptions {
  /**
   * 平台公式渲染模式
   */
  mode?: MathRenderModeEnum
  /**
   * RemoteImage 模式的图片地址模板，使用 {tex} 占位符
   */
  imageUrlTemplate?: string
}

type FormulaRenderer = (expression: string, display: boolean) => string | null

const logger = createAppLogger("formula-render")

const escapeHtml = (value: string): string => {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const escapeHtmlAttribute = (value: string): string => {
  return escapeHtml(value).replace(/"/g, "&quot;")
}

/**
 * 发布层公式渲染服务
 *
 * 发布链路的 Markdown 经 Lute 转成 HTML 时会产出
 * `<span data-syp-math="inline" data-tex="...">` / `<div data-syp-math="block" data-tex="...">`
 * 结构化标记。本服务按平台配置统一渲染这些标记，并兼容手工 HTML 里残留的 `$...$`。
 *
 * 这样公式识别不再依赖扫描 HTML 文本节点，代码块、行内代码、价格符号都不会被误判；
 * 公式渲染方式也不再写死在单个平台适配器里。
 *
 * @author terwer
 * @since 2.5.0
 */
class FormulaRenderService {
  private static mathjaxDocument: any = null
  private static mathjaxAdaptor: any = null

  /**
   * 把结构化公式标记还原成 `$...$` / `$$...$$` 原文。
   *
   * Native 模式使用；同时作为个别平台渲染失败时的兜底。
   */
  public static restoreNative(html: string): string {
    if (!html || !html.includes("data-syp-math")) {
      return html
    }

    const $ = cheerio.load(html, {
      xml: {
        xmlMode: true,
        decodeEntities: false,
      },
    })

    const nodes = $("[data-syp-math]").toArray()
    for (const node of nodes) {
      const type = ($(node).attr("data-syp-math") ?? "").toLowerCase()
      const expression = $(node).attr("data-tex") ?? ""
      const text = type === "block" ? `$$${expression}$$` : `$${expression}$`
      $(node).replaceWith(escapeHtml(text))
    }

    return $.html()
  }

  /**
   * 按平台配置处理 HTML 里的公式。
   *
   * 不抛异常：无法解析或平台不支持时保留原文，避免一条坏公式中断整篇发布。
   *
   * @param html 发布 HTML
   * @param options 渲染选项
   */
  public static async process(html: string, options: FormulaRenderOptions = {}): Promise<string> {
    if (!html) {
      return html
    }

    const mode = options.mode ?? MathRenderModeEnum.Native
    if (mode === MathRenderModeEnum.Native) {
      return this.restoreNative(html)
    }

    if (mode === MathRenderModeEnum.Image) {
      // 位图模式需要平台图片上传链路，当前没有平台使用；先按原文兜底，避免标记泄漏。
      logger.warn("MathRenderMode.Image 暂未实现，保留公式原文")
      return this.restoreNative(html)
    }

    const renderer = this.createRenderer(mode, options.imageUrlTemplate)
    let result = this.replaceMarkers(html, renderer)
    // 兼容非 Lute 生成的 HTML 里残留的 $...$ / $$...$$
    result = HtmlMathUtils.replaceMath(result, renderer)
    return result
  }

  /**
   * 替换 Lute 生成的结构化公式标记
   */
  private static replaceMarkers(html: string, renderer: FormulaRenderer): string {
    if (!html.includes("data-syp-math")) {
      return html
    }

    const $ = cheerio.load(html, {
      xml: {
        xmlMode: true,
        decodeEntities: false,
      },
    })

    const nodes = $("[data-syp-math]").toArray()
    for (const node of nodes) {
      const type = ($(node).attr("data-syp-math") ?? "").toLowerCase()
      const expression = ($(node).attr("data-tex") ?? "").trim()
      if (!expression) {
        $(node).replaceWith("")
        continue
      }

      const display = type === "block"
      const rendered = renderer(expression, display)
      if (rendered) {
        $(node).replaceWith(rendered)
      } else {
        const text = display ? `$$${expression}$$` : `$${expression}$`
        $(node).replaceWith(escapeHtml(text))
      }
    }

    return $.html()
  }

  /**
   * 根据模式创建公式渲染器
   */
  private static createRenderer(mode: MathRenderModeEnum, imageUrlTemplate?: string): FormulaRenderer {
    switch (mode) {
      case MathRenderModeEnum.KaTeX:
        return (expression, display) => {
          try {
            const mathHtml = KatexUtils.renderToString(expression)
            return display
              ? `<span class="katex--display">${mathHtml}</span>`
              : `<span class="katex--inline">${mathHtml}</span>`
          } catch (e: any) {
            logger.debug(`KaTeX 渲染失败，保留原文: ${e?.message ?? e}`)
            return null
          }
        }
      case MathRenderModeEnum.Svg:
        return (expression, display) => this.renderSvg(expression, display)
      case MathRenderModeEnum.RemoteImage:
        return (expression, display) => {
          const template = imageUrlTemplate ?? ""
          if (!template.includes("{tex}")) {
            return null
          }
          const src = template.replace(/\{tex\}/g, encodeURIComponent(expression))
          return `<img eeimg="1" src="${escapeHtmlAttribute(src)}" alt="${escapeHtmlAttribute(expression)}" />`
        }
      default:
        return () => null
    }
  }

  /**
   * 用 MathJax 渲染内联 SVG。
   *
   * fontCache: none 是微信公众号场景的关键：不生成 <defs>/<use>/id，
   * 公众号保存正文时不会因过滤这些节点导致公式失效。
   */
  private static renderSvg(expression: string, display: boolean): string | null {
    try {
      const { doc, adaptor } = this.getMathJaxDocument()
      const node = doc.convert(expression, {
        display,
        em: 16,
        ex: 8,
        containerWidth: 10000,
      })
      const html = adaptor.outerHTML(node) as string
      const match = html.match(/<svg[\s\S]*?<\/svg>/)
      if (!match) {
        return null
      }
      if (/data-mjx-error|mjx-error|<merror/i.test(html)) {
        logger.debug("MathJax 渲染失败，保留原文")
        return null
      }

      // 保留 MathJax 的垂直对齐样式，同时限制超宽公式
      const svg = match[0].replace(/style="/, 'style="max-width:100%;height:auto;')
      return display
        ? `<div class="syp-math-block" style="text-align:center;margin:15px 0;overflow-x:auto;">${svg}</div>`
        : `<span class="syp-math-inline" style="display:inline-block;">${svg}</span>`
    } catch (e: any) {
      logger.debug(`MathJax 渲染失败，保留原文: ${e?.message ?? e}`)
      return null
    }
  }

  /**
   * 懒初始化 MathJax。liteAdaptor 不依赖浏览器 DOM，插件/扩展/网页三种宿主都能用。
   */
  private static getMathJaxDocument(): { doc: any; adaptor: any } {
    if (!this.mathjaxDocument) {
      const adaptor = liteAdaptor()
      RegisterHTMLHandler(adaptor)
      const tex = new TeX({ packages: AllPackages })
      const svg = new SVG({ fontCache: "none" })
      this.mathjaxAdaptor = adaptor
      this.mathjaxDocument = mathjax.document("", {
        InputJax: tex,
        OutputJax: svg,
      })
    }
    return {
      doc: this.mathjaxDocument,
      adaptor: this.mathjaxAdaptor,
    }
  }
}

export { FormulaRenderService }
export type { FormulaRenderOptions }
