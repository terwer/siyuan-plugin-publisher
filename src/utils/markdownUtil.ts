// 引用 lute 库的方法
// dev/prod 环境
// 在 src/pages//indx.html 直接引用 <script src="/lute.min.js"></script>
// test 环境
// 在 setup.ts 引用 require("../public/lute.min.js")

/**
 * 渲染Markdown
 * @param md
 */
export function renderHTML(md: string): string {
  // @ts-expect-error
  if (typeof Lute === "undefined") {
    return md
  }

  // @ts-expect-error
  const lute = Lute.New()

  const renderers = {
    // renderText: (node: any, entering: any) => {
    //     if (entering) {
    //         logUtil.logInfo("    render text")
    //         // @ts-ignore
    //         return [node.Text() + " via Lute", Lute.WalkContinue]
    //     }
    //     // @ts-ignore
    //     return ["", Lute.WalkContinue]
    // },
    // renderStrong: (node: any, entering: any) => {
    //     entering ? logUtil.logInfo("    start render strong") : logUtil.logInfo("    end render strong")
    //     // @ts-ignore
    //     return ["", Lute.WalkContinue]
    // },
    // renderParagraph: (node: any, entering: any) => {
    //     entering ? logUtil.logInfo("    start render paragraph") : logUtil.logInfo("    end render paragraph")
    //     // @ts-ignore
    //     return ["", Lute.WalkContinue]
    // }
  }

  lute.SetJSRenderers({
    renderers: {
      Md2HTML: renderers,
    },
  })

  return lute.MarkdownStr("", md)
}
