/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherLuteInstance } from "~/src/publisherLuteInstance.ts"

/**
 * Lute 工具类
 */
class LuteUtil {
  private static logger = createAppLogger("lute-util")

  /**
   * 使用 Lute 渲染 HTML
   *
   * @param md
   */
  public static mdToHtml(md: string) {
    const { lute, Lute } = PublisherLuteInstance.getInstance()

    // 自定义渲染器
    const renderers = {
      // renderInlineMath: (node: any, entering: any) => {
      //   if (entering) {
      //     return [`$${node.Text()}$`, Lute.WalkContinue]
      //   }
      //   return ["", Lute.WalkContinue]
      // },
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
    lute.SetJSRenderers({
      renderers: {
        Md2HTML: renderers,
      },
    })
    // 开始渲染
    const html = lute.MarkdownStr("", md)
    this.logger.debug("md to html =>", { html })
    return html
  }
}

export { LuteUtil }
