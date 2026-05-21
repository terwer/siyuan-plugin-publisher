/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { XmlrpcUtil } from "simple-xmlrpc"
import { normalizeXmlrpcResponseText } from "~/src/utils/xmlrpcResponseUtil.ts"

describe("normalizeXmlrpcResponseText", () => {
  it("passes through XML strings", () => {
    const xml = `<?xml version="1.0"?><methodResponse><params><param><value><string>ok</string></value></param></params></methodResponse>`
    expect(normalizeXmlrpcResponseText(xml)).toBe(xml)
  })

  it("extracts body from forwardProxy-like wrapper objects", () => {
    const xml = "<methodResponse></methodResponse>"
    expect(normalizeXmlrpcResponseText({ status: 200, body: xml })).toBe(xml)
  })

  it("extracts data field when body is missing", () => {
    const xml = `<?xml version="1.0"?><methodResponse></methodResponse>`
    expect(normalizeXmlrpcResponseText({ data: xml })).toBe(xml)
  })

  it("throws a clear error for plain objects without text fields", () => {
    expect(() => normalizeXmlrpcResponseText({ status: 200, headers: {} })).toThrow(/non-text response/)
  })

  it("does not throw when passed to removeXmlHeader after normalization", () => {
    const xml = `<?xml version="1.0"?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`
    expect(() => XmlrpcUtil.removeXmlHeader(normalizeXmlrpcResponseText({ body: xml }))).not.toThrow()
  })

  it("removeXmlHeader throws on raw object (regression guard)", () => {
    expect(() => XmlrpcUtil.removeXmlHeader({ body: "<x/>" } as unknown as string)).toThrow(/indexOf/)
  })
})
