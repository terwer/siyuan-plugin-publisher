/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { normalizeTagValue, tagValueToKeywords } from "~/src/utils/tagValue.ts"

describe("tagValue", () => {
  it("normalizes comma separated strings", () => {
    expect(normalizeTagValue("标签甲, 标签乙")).toEqual(["标签甲", "标签乙"])
    expect(normalizeTagValue("标签甲，标签乙")).toEqual(["标签甲", "标签乙"])
  })

  it("accepts arrays, flow sequences and numbers", () => {
    expect(normalizeTagValue(["a", "b,c"])).toEqual(["a", "b", "c"])
    expect(normalizeTagValue("[a, b]")).toEqual(["a", "b"])
    expect(normalizeTagValue([1, true])).toEqual(["1", "true"])
  })

  it("dedupes and drops empty entries", () => {
    expect(normalizeTagValue("a,,a, b ")).toEqual(["a", "b"])
  })

  it("never throws for null/object values", () => {
    expect(normalizeTagValue(null)).toEqual([])
    expect(normalizeTagValue(undefined)).toEqual([])
    expect(normalizeTagValue({})).toEqual([])
    expect(tagValueToKeywords(undefined)).toBe("")
    expect(tagValueToKeywords(["a", "b"])).toBe("a,b")
  })
})
