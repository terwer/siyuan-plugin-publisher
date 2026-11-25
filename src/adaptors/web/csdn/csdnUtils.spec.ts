/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"

describe("test csdnUtils", () => {
  it("test generateXCaNonce", () => {
    const result = CsdnUtils.generateXCaNonce()
    console.log(result)
  })

  it("test generateXCaSignature", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all"
    const method = "GET"
    const accept = "*/*"
    const contentType = "application/json"

    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"
    const xCaSignature = await CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    console.log("x-ca-nonce:", xCaNonce)
    console.log("x-ca-signature:", xCaSignature)
    expect(xCaSignature).toBe("ifhNtUDVjPe8Qx5iOgFP7r6sGh9ttEO3zYn9H3mZQSM=")
  })

  it("test generateXCaSignature2", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/upgrade-column-pay"
    const method = "POST"
    const accept = "*/*"
    const contentType = "application/json"

    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"
    const xCaSignature = await CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    console.log("x-ca-nonce:", xCaNonce)
    console.log("x-ca-signature:", xCaSignature)
    expect(xCaSignature).toBe("5Wxc4xYUcKvw9tXliIyHb7yQggMZ60KMSp3cxtE4pJ0=")
  })

  it("test generateXCaSignatureForMedia", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all"
    const method = "GET"
    const accept = "*/*"
    const contentType = "application/json"
    const timestamp = "1700000000000"
    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"

    const xCaSignature = await CsdnUtils.generateXCaSignatureForMedia(
      url,
      method,
      accept,
      xCaNonce,
      contentType,
      timestamp
    )

    console.log("x-ca-signature-media:", xCaSignature)
    expect(xCaSignature).toBe("+VtSxo99+lzLiMPIEu0gjwEfDYiVOCgaZ5BLfzXDuRM=")
  })

  it("test generateXCaSignatureForMedia2", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/upgrade-column-pay"
    const method = "POST"
    const accept = "*/*"
    const contentType = "application/json"
    const timestamp = "1700000000000"
    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"

    const xCaSignature = await CsdnUtils.generateXCaSignatureForMedia(
      url,
      method,
      accept,
      xCaNonce,
      contentType,
      timestamp
    )

    console.log("x-ca-signature-media:", xCaSignature)
    expect(xCaSignature).toBe("T7YNBeiPNexLYMRKY/xDw/dI4dHURBS8FVPWafFV3y0=")
  })
})

const codeBlock = (language: string, code: string) =>
  `<div class="code-block"><div class="protyle-action"><span class="protyle-action__language">${language}</span></div>` +
  `<pre class="protyle-code"><code class="hljs language-${language}">${code}</code></pre></div>`

describe("CsdnUtils.processCsdnMath", () => {
  it("keeps $ inside code blocks as literal text (#1724)", () => {
    const html =
      `<div data-node-id="20250425114405-abcdefg">` +
      codeBlock("shell", "New-Item -Path $env:APPDATA\\uv\\uv.toml -ItemType File -Force") +
      `<p>类似地，还有：</p>` +
      codeBlock("toml", 'username = "${ENV_USERNAME}"') +
      `</div>`

    const result = CsdnUtils.processCsdnMath(html)

    expect(result).toContain("$env:APPDATA\\uv\\uv.toml")
    expect(result).toContain("${ENV_USERNAME}")
    expect(result).not.toContain("katex")
  })

  it("keeps $ inside inline code as literal text", () => {
    const html = `<p>执行 <code>$HOME</code> 后再执行 <code>${"${ENV_USERNAME}"}</code></p>`

    const result = CsdnUtils.processCsdnMath(html)

    expect(result).toContain("<code>$HOME</code>")
    expect(result).toContain("<code>${ENV_USERNAME}</code>")
    expect(result).not.toContain("katex")
  })

  it("renders inline and display formulas outside code blocks", () => {
    const html = `<p>行内公式 $a=b+c$ 与块级公式</p><div>$$x=\\frac{1}{2}$$</div>`

    const result = CsdnUtils.processCsdnMath(html)

    expect(result).toContain('class="katex--inline"')
    expect(result).toContain('class="katex--display"')
  })

  it("keeps multiple $ inside one code block as literal text", () => {
    const html = `<pre><code class="language-shell">awk '{ print $1, $2 }' file</code></pre>`

    const result = CsdnUtils.processCsdnMath(html)

    expect(result).toContain("awk '{ print $1, $2 }' file")
    expect(result).not.toContain("katex")
  })

  it("does not pair $ signs that live in different elements", () => {
    const html = `<p>售价 $5</p><p>运费 $10</p>`

    const result = CsdnUtils.processCsdnMath(html)

    expect(result).toContain("$5")
    expect(result).toContain("$10")
    expect(result).not.toContain("katex")
  })

  it("does not abort publishing when a $...$ pair is not valid LaTeX", () => {
    const html = `<p>写法 $a\\qqq b$ 无法解析</p>`

    const result = CsdnUtils.processCsdnMath(html)

    expect(result).toContain("$a\\qqq b$")
    expect(result).not.toContain("katex")
  })
})
