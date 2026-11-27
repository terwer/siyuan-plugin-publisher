/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { MathRenderModeEnum } from "zhi-blog-api"
import { FormulaRenderService } from "~/src/utils/formulaRenderService.ts"

const inlineMarker = (tex: string) => `<span data-syp-math="inline" data-tex="${tex}"></span>`
const blockMarker = (tex: string) => `<div data-syp-math="block" data-tex="${tex}"></div>`

const codeBlock = (language: string, code: string) =>
  `<div class="code-block"><div class="protyle-action"><span class="protyle-action__language">${language}</span></div>` +
  `<pre class="protyle-code"><code class="hljs language-${language}">${code}</code></pre></div>`

describe("FormulaRenderService", () => {
  it("restores structured markers to $ / $$ source text in native mode", () => {
    const html = `<p>行内 ${inlineMarker("a=b+c")} 与块级</p>${blockMarker("x=\\frac{1}{2}")}`

    const result = FormulaRenderService.restoreNative(html)

    expect(result).toContain("$a=b+c$")
    expect(result).toContain("$$x=\\frac{1}{2}$$")
    expect(result).not.toContain("data-syp-math")
  })

  it("restores escaped TeX without breaking the HTML", () => {
    const html = `<p>${inlineMarker("a&lt;b")}</p>`

    const result = FormulaRenderService.restoreNative(html)

    expect(result).toContain("$a")
    expect(result).toContain("b$")
    expect(result).not.toContain("data-syp-math")
  })

  it("renders inline and display markers with KaTeX", async () => {
    const html = `<p>行内 ${inlineMarker("a=b+c")} 与块级</p>${blockMarker("x=\\frac{1}{2}")}`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.KaTeX })

    expect(result).toContain('class="katex--inline"')
    expect(result).toContain('class="katex--display"')
  })

  it("renders raw $...$ outside code blocks with KaTeX", async () => {
    const html = `<p>行内公式 $a=b+c$ 与块级公式</p><div>$$x=\\frac{1}{2}$$</div>`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.KaTeX })

    expect(result).toContain('class="katex--inline"')
    expect(result).toContain('class="katex--display"')
  })

  it("keeps $ inside code blocks as literal text", async () => {
    const html =
      `<div data-node-id="20250425114405-abcdefg">` +
      codeBlock("shell", "New-Item -Path $env:APPDATA\\uv\\uv.toml -ItemType File -Force") +
      `<p>类似地，还有：</p>` +
      codeBlock("toml", 'username = "${ENV_USERNAME}"') +
      `<p>行内代码 <code>$HOME</code></p>` +
      `</div>`

    for (const mode of [MathRenderModeEnum.KaTeX, MathRenderModeEnum.Svg, MathRenderModeEnum.RemoteImage]) {
      const result = await FormulaRenderService.process(html, {
        mode,
        imageUrlTemplate: "https://example.com/equation?tex={tex}",
      })

      expect(result).toContain("$env:APPDATA\\uv\\uv.toml")
      expect(result).toContain("${ENV_USERNAME}")
      expect(result).toContain("<code>$HOME</code>")
      expect(result).not.toContain("katex")
      expect(result).not.toContain("<svg")
      expect(result).not.toContain("equation?tex=")
    }
  })

  it("does not pair $ signs that live in different elements", async () => {
    const html = `<p>售价 $5</p><p>运费 $10</p>`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.KaTeX })

    expect(result).toContain("$5")
    expect(result).toContain("$10")
    expect(result).not.toContain("katex")
  })

  it("keeps the original text when KaTeX cannot parse a formula", async () => {
    const html = `<p>写法 $a\\qqq b$ 无法解析</p>`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.KaTeX })

    expect(result).toContain("$a\\qqq b$")
    expect(result).not.toContain("katex")
  })

  it("renders inline and display markers as self-contained MathJax SVG", async () => {
    const html = `<p>行内 ${inlineMarker("a=b+c")} 与块级</p>${blockMarker("x=\\frac{1}{2}")}`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.Svg })

    expect(result).toContain("<svg")
    expect(result).toContain("<path")
    expect(result).toContain('class="syp-math-inline"')
    expect(result).toContain('class="syp-math-block"')
    // 公众号会过滤 id / <defs> / <use> / <style>，输出必须自包含
    expect(result).not.toMatch(/\bid="/)
    expect(result).not.toContain("<defs")
    expect(result).not.toContain("<use")
    expect(result).not.toContain("<style")
  })

  it("keeps the original text when MathJax cannot parse a formula", async () => {
    const html = `<p>写法 ${inlineMarker("\\notacommand{")}</p>`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.Svg })

    expect(result).toContain("$\\notacommand{$")
  })

  it("renders platform formula images with an encoded {tex} template", async () => {
    const html = `<p>${inlineMarker("a=b+c")}</p>`

    const result = await FormulaRenderService.process(html, {
      mode: MathRenderModeEnum.RemoteImage,
      imageUrlTemplate: "//www.zhihu.com/equation?tex={tex}",
    })

    expect(result).toContain("www.zhihu.com/equation?tex=a%3Db%2Bc")
    expect(result).toContain('eeimg="1"')
    expect(result).toContain("alt=")
  })

  it("keeps the original text when the image template is missing", async () => {
    const html = `<p>${inlineMarker("a=b+c")}</p>`

    const result = await FormulaRenderService.process(html, {
      mode: MathRenderModeEnum.RemoteImage,
    })

    expect(result).toContain("$a=b+c$")
  })

  it("falls back to the source text for the reserved image mode", async () => {
    const html = `<p>${inlineMarker("a=b+c")}</p>`

    const result = await FormulaRenderService.process(html, { mode: MathRenderModeEnum.Image })

    expect(result).toContain("$a=b+c$")
    expect(result).not.toContain("data-syp-math")
  })
})
