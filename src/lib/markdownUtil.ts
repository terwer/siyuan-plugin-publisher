require("./lute/javascript/lute.min")

/**
 * 渲染Markdown
 * @param md
 */
export function render(md: string) {
    // @ts-ignore
    const lute = Lute.New()

    const renderers = {
        // renderText: (node: any, entering: any) => {
        //     if (entering) {
        //         console.log("    render text")
        //         // @ts-ignore
        //         return [node.Text() + " via Lute", Lute.WalkContinue]
        //     }
        //     // @ts-ignore
        //     return ["", Lute.WalkContinue]
        // },
        // renderStrong: (node: any, entering: any) => {
        //     entering ? console.log("    start render strong") : console.log("    end render strong")
        //     // @ts-ignore
        //     return ["", Lute.WalkContinue]
        // },
        // renderParagraph: (node: any, entering: any) => {
        //     entering ? console.log("    start render paragraph") : console.log("    end render paragraph")
        //     // @ts-ignore
        //     return ["", Lute.WalkContinue]
        // }
    }

    lute.SetJSRenderers({
        renderers: {
            Md2HTML: renderers
        },
    })

    return lute.MarkdownStr("", md)
}