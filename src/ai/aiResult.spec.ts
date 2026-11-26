/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import {
  normalizeAiCategories,
  normalizeAiDescription,
  normalizeAiTags,
  normalizeAiTitle,
  parseAiJson,
  pickAiField,
} from "~/src/ai/aiResult.ts"

describe("parseAiJson", () => {
  it("parses a plain JSON object", () => {
    const parsed = parseAiJson('{"title":"标题"}')
    expect(parsed.ok).toBe(true)
    if (parsed.ok) {
      expect(pickAiField(parsed.value, "title")).toBe("标题")
    }
  })

  it("parses fenced JSON and surrounding prose", () => {
    const fenced = parseAiJson('这是结果：\n```json\n{"tags":["a","b"]}\n```\n请查收')
    expect(fenced.ok).toBe(true)
    if (fenced.ok) {
      expect(normalizeAiTags(pickAiField(fenced.value, "tags"))).toEqual(["a", "b"])
    }

    const prose = parseAiJson('结果如下 {"desc":"摘要"} 希望有帮助')
    expect(prose.ok).toBe(true)
    if (prose.ok) {
      expect(normalizeAiDescription(pickAiField(prose.value, "desc"))).toBe("摘要")
    }
  })

  it("repairs trailing commas", () => {
    const parsed = parseAiJson('{"tags":["a","b",],}')
    expect(parsed.ok).toBe(true)
    if (parsed.ok) {
      expect(normalizeAiTags(pickAiField(parsed.value, "tags"))).toEqual(["a", "b"])
    }
  })

  it("returns explicit reasons for empty/invalid output", () => {
    expect(parseAiJson("")).toEqual({ ok: false, reason: "empty" })
    expect(parseAiJson("模型没有返回 JSON")).toEqual({ ok: false, reason: "invalid-json" })
  })
})

describe("AI field normalization", () => {
  it("normalizes title/description strings", () => {
    expect(normalizeAiTitle('  "标题"  ')).toBe("标题")
    expect(normalizeAiDescription("  摘要  ")).toBe("摘要")
    expect(normalizeAiTitle(["x"] as unknown)).toBe("")
  })

  it("normalizes tags from arrays, strings, objects and hash prefixes", () => {
    expect(normalizeAiTags(["#标签甲", "标签乙,标签丙"])).toEqual(["标签甲", "标签乙", "标签丙"])
    expect(normalizeAiTags({ tags: "标签甲,标签乙" })).toEqual(["标签甲", "标签乙"])
    expect(normalizeAiTags({ tag: ["标签甲"] })).toEqual(["标签甲"])
    expect(normalizeAiTags([{ name: "标签甲" }])).toEqual(["标签甲"])
    expect(normalizeAiTags(undefined)).toEqual([])
  })

  it("normalizes categories", () => {
    expect(normalizeAiCategories(["技术", "随笔,其他"])).toEqual(["技术", "随笔", "其他"])
    expect(normalizeAiCategories({ categories: "技术" })).toEqual(["技术"])
  })
})
