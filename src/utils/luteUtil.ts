/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */
import { PublisherLuteInstance } from "~/src/publisherLuteInstance.ts"

/**
 * Lute 渲染选项
 */
interface LuteMdToHtmlOptions {
  /**
   * 是否把公式输出为结构化标记，供发布层按平台能力统一渲染。
   *
   * 默认 false，保持历史行为（输出 `$...$` / `$$...$$` 原文），
   * 供文章管理等只做展示、不参与平台发布的场景使用。
   */
  mathMarkers?: boolean
}

/**
 * 把公式内容转义成 HTML 属性值
 */
const escapeHtmlAttribute = (value: string): string => {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Lute 工具类
 */
class LuteUtil {
  /**
   * 使用 Lute 渲染 HTML
   *
   * @param md Markdown 内容
   * @param options 渲染选项
   */
  public static mdToHtml(md: string, options: LuteMdToHtmlOptions = {}) {
    const { lute, Lute } = PublisherLuteInstance.getInstance()

    const renderers = options.mathMarkers
      ? LuteUtil.buildMathMarkerRenderers(Lute)
      : LuteUtil.buildNativeMathRenderers(Lute)

    lute.SetJSRenderers({
      renderers: {
        Md2HTML: renderers,
      },
    })
    // 开始渲染
    const html = lute.MarkdownStr("", md)
    return html
  }

  /**
   * 历史行为：把公式还原成 `$...$` / `$$...$$` 原文。
   *
   * 用于文章管理等只做展示的场景，保持既有输出不变。
   */
  private static buildNativeMathRenderers(Lute: any) {
    return {
      // 行内公式块
      renderInlineMathCloseMarker: (node: any, entering: any) => {
        if (entering) {
          return ["$", Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderInlineMathContent: (node: any, entering: any) => {
        if (entering) {
          return [node.TokensStr(), Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderInlineMathOpenMarker: (node: any, entering: any) => {
        if (entering) {
          return ["$", Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderInlineMath: (node: any, entering: any) => {
        return ["", Lute.WalkContinue]
      },
      // 公式块
      renderMathBlockCloseMarker: (node: any, entering: any) => {
        if (entering) {
          return ["$$", Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderMathBlockContent: (node: any, entering: any) => {
        if (entering) {
          return [node.TokensStr(), Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderMathBlockOpenMarker: (node: any, entering: any) => {
        if (entering) {
          return ["$$", Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderMathBlock: (node: any, entering: any) => {
        return ["", Lute.WalkContinue]
      },
    }
  }

  /**
   * 发布链路：把公式输出为结构化标记。
   *
   * 标记只携带公式原文和行内/块级类型，具体渲染由 FormulaRenderService
   * 按平台配置决定，避免用正则扫描 HTML 造成代码块/价格符号误判。
   */
  private static buildMathMarkerRenderers(Lute: any) {
    const inlineMarker = (node: any) =>
      `<span data-syp-math="inline" data-tex="${escapeHtmlAttribute(node.TokensStr())}"></span>`
    const blockMarker = (node: any) =>
      `<div data-syp-math="block" data-tex="${escapeHtmlAttribute(node.TokensStr())}"></div>`

    return {
      // 行内公式块
      renderInlineMathCloseMarker: () => ["", Lute.WalkContinue],
      renderInlineMathContent: (node: any, entering: any) => {
        if (entering) {
          return [inlineMarker(node), Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderInlineMathOpenMarker: () => ["", Lute.WalkContinue],
      renderInlineMath: () => ["", Lute.WalkContinue],
      // 公式块
      renderMathBlockCloseMarker: () => ["", Lute.WalkContinue],
      renderMathBlockContent: (node: any, entering: any) => {
        if (entering) {
          return [blockMarker(node), Lute.WalkContinue]
        }
        return ["", Lute.WalkContinue]
      },
      renderMathBlockOpenMarker: () => ["", Lute.WalkContinue],
      renderMathBlock: () => ["", Lute.WalkContinue],
    }
  }
}

export { LuteUtil }
