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
