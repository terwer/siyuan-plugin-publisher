/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { mergeDocAttrs, parseDocAttrs } from "~/src/utils/docAttrs.ts"

describe("parseDocAttrs", () => {
  it("解析普通对象，非法 JSON 或非对象时返回空对象", () => {
    expect(parseDocAttrs('{"custom-cover":"cover.png"}')).toEqual({ "custom-cover": "cover.png" })
    expect(parseDocAttrs("{bad")).toEqual({})
    expect(parseDocAttrs("[1,2]")).toEqual({})
    expect(parseDocAttrs("null")).toEqual({})
    expect(parseDocAttrs(undefined)).toEqual({})
    expect(parseDocAttrs("  ")).toEqual({})
  })
})

describe("mergeDocAttrs", () => {
  it("把文档属性合并进已有附加属性，已有字段优先", () => {
    const merged = mergeDocAttrs(JSON.stringify({ "custom-publish-status": "publish", "custom-slug": "old" }), {
      "custom-cover": "cover.png",
      "custom-slug": "from-doc",
    })
    expect(JSON.parse(merged ?? "{}")).toEqual({
      "custom-cover": "cover.png",
      "custom-slug": "old",
      "custom-publish-status": "publish",
    })
  })

  it("没有文档属性时保留原值，非法 JSON 也不会丢失文档属性", () => {
    expect(mergeDocAttrs("original", undefined)).toBe("original")
    expect(JSON.parse(mergeDocAttrs("{bad", { "custom-cover": "cover.png" }) ?? "{}")).toEqual({
      "custom-cover": "cover.png",
    })
  })

  it("忽略原型污染键", () => {
    const raw = '{"__proto__":{"polluted":true},"constructor":"bad"}'
    const docAttrs = JSON.parse('{"__proto__":{"polluted":true},"constructor":"bad","custom-cover":"cover.png"}')
    const merged = mergeDocAttrs(raw, docAttrs)
    const parsed = JSON.parse(merged ?? "{}")
    expect(parsed["custom-cover"]).toBe("cover.png")
    expect(Object.prototype.hasOwnProperty.call(parsed, "constructor")).toBe(false)
    expect(Object.prototype).not.toHaveProperty("polluted")
  })
})
