/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { decodeProxyResponseBody } from "~/src/utils/proxyResponseBody.ts"

const authFailedText = JSON.stringify({ code: -1, msg: "Auth failed [session]" })
const authFailedBase64 = Buffer.from(authFailedText, "utf8").toString("base64")

describe("decodeProxyResponseBody", () => {
  it("decodes a base64 error body back to text", () => {
    expect(decodeProxyResponseBody(authFailedBase64, "base64")).toBe(authFailedText)
    expect(decodeProxyResponseBody(authFailedBase64, "base64-std")).toBe(authFailedText)
  })

  it("decodes url-safe base64 and hex bodies", () => {
    const base64Url = Buffer.from(authFailedText).toString("base64").replace(/\+/g, "-").replace(/\//g, "_")
    expect(decodeProxyResponseBody(base64Url, "base64-url")).toBe(authFailedText)
    expect(decodeProxyResponseBody(Buffer.from(authFailedText).toString("hex"), "hex")).toBe(authFailedText)
  })

  it("passes plain text through", () => {
    expect(decodeProxyResponseBody(authFailedText, "text")).toBe(authFailedText)
    expect(decodeProxyResponseBody(authFailedText)).toBe(authFailedText)
  })

  it("returns an empty string for an empty or non-string body", () => {
    expect(decodeProxyResponseBody(undefined, "base64")).toBe("")
    expect(decodeProxyResponseBody("", "base64")).toBe("")
    expect(decodeProxyResponseBody({ code: -1 }, "base64")).toBe("")
  })
})
