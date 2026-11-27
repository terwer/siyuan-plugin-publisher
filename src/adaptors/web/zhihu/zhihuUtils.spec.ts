/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import ZhihuUtils from "~/src/adaptors/web/zhihu/zhihuUtils.ts"

const codeBlock = (language: string, code: string) =>
  `<div class="code-block"><div class="protyle-action"><span class="protyle-action__language">${language}</span></div>` +
  `<pre class="protyle-code"><code class="hljs language-${language}">${code}</code></pre></div>`

describe("ZhihuUtils.processZHMath", () => {
  it("keeps $ inside code blocks as literal text (#1724)", () => {
    const html =
      `<div data-node-id="20250425114405-abcdefg">` +
      codeBlock("shell", "New-Item -Path $env:APPDATA\\uv\\uv.toml -ItemType File -Force") +
      `<p>类似地，还有：</p>` +
      codeBlock("toml", 'username = "${ENV_USERNAME}"') +
      `</div>`

    const result = ZhihuUtils.processZHMath(html)

    expect(result).toContain("$env:APPDATA\\uv\\uv.toml")
    expect(result).toContain("${ENV_USERNAME}")
    expect(result).not.toContain("equation?tex=")
  })

  it("keeps $ inside inline code as literal text", () => {
    const html = `<p>执行 <code>$HOME</code> 后再执行 <code>${"${ENV_USERNAME}"}</code></p>`

    const result = ZhihuUtils.processZHMath(html)

    expect(result).toContain("<code>$HOME</code>")
    expect(result).toContain("<code>${ENV_USERNAME}</code>")
    expect(result).not.toContain("equation?tex=")
  })

  it("turns inline and display formulas outside code blocks into equation images", () => {
    const html = `<p>行内公式 $a=b+c$ 与块级公式</p><div>$$x=\\frac{1}{2}$$</div>`

    const result = ZhihuUtils.processZHMath(html)

    expect(result).toContain("www.zhihu.com/equation?tex=a%3Db%2Bc")
    expect(result).toContain("www.zhihu.com/equation?tex=x%3D%5Cfrac%7B1%7D%7B2%7D")
  })
})

describe("ZhihuUtils.processZHCodeBlock", () => {
  it("turns a Lute code block into Zhihu's <pre lang> form so the language survives (#1713)", () => {
    const html = codeBlock("go", "package main\n\nfunc main() {}")

    const result = ZhihuUtils.processZHCodeBlock(html)

    expect(result).toContain('<pre lang="go">')
    expect(result).not.toContain("code-block")
    expect(result).not.toContain("protyle-action__language")
    expect(result).toContain("package main")
  })

  it("keeps code text entities and special characters intact", () => {
    const html = codeBlock("go", "if a &lt; b &amp;&amp; c &gt; d { fmt.Println(&quot;hi&quot;) }")

    const result = ZhihuUtils.processZHCodeBlock(html)

    expect(result).toContain("if a &lt; b &amp;&amp; c &gt; d")
    expect(result).toContain('fmt.Println("hi")')
  })

  it("normalizes language aliases to values Zhihu keeps", () => {
    expect(ZhihuUtils.processZHCodeBlock(codeBlock("golang", "x"))).toContain('<pre lang="go">')
    expect(ZhihuUtils.processZHCodeBlock(codeBlock("cs", "x"))).toContain('<pre lang="csharp">')
    expect(ZhihuUtils.processZHCodeBlock(codeBlock("yml", "x"))).toContain('<pre lang="yaml">')
    expect(ZhihuUtils.processZHCodeBlock(codeBlock("markdown", "x"))).toContain('<pre lang="md">')
    expect(ZhihuUtils.processZHCodeBlock(codeBlock("plaintext", "x"))).toContain('<pre lang="text">')
  })

  it("reads the language from the protyle action row when the code element has no language class", () => {
    const html = `<div class="code-block"><div class="protyle-action"><span class="protyle-action__language">Python</span></div><pre><code class="hljs">print(1)</code></pre></div>`

    const result = ZhihuUtils.processZHCodeBlock(html)

    expect(result).toContain('<pre lang="python">print(1)')
  })

  it("keeps inline code untouched", () => {
    const html = `<p>执行 <code>npm install</code></p>`

    const result = ZhihuUtils.processZHCodeBlock(html)

    expect(result).toBe(html)
  })

  it("keeps multiple code blocks with their own languages", () => {
    const html = `<p>a</p>${codeBlock("go", "package main")}<p>b</p>${codeBlock("python", "print(1)")}`

    const result = ZhihuUtils.processZHCodeBlock(html)

    expect(result).toContain('<pre lang="go">package main</pre>')
    expect(result).toContain('<pre lang="python">print(1)</pre>')
  })

  it("is idempotent for already normalized blocks", () => {
    const once = ZhihuUtils.processZHCodeBlock(codeBlock("go", "package main"))
    const twice = ZhihuUtils.processZHCodeBlock(once)

    expect(twice).toBe(once)
  })
})
