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
