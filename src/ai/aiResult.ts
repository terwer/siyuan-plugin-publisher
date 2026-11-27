/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { normalizeTagValue } from "~/src/utils/tagValue.ts"

export type AiParseFailureReason = "empty" | "invalid-json"

export type AiParseResult = { ok: boolean; value?: unknown; reason?: AiParseFailureReason }

const CODE_FENCE_REGEX = /```(?:json|JSON)?\s*([\s\S]*?)```/
const JSON_START_REGEX = /[{[]/

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const stripOuterQuotes = (value: string): string => value.trim().replace(/^["'“”]+|["'“”]+$/g, "").trim()

/**
 * 从模型输出中解析 JSON。
 *
 * 兼容：
 * - ```json 围栏（大小写不敏感）；
 * - JSON 前后带说明文字；
 * - 尾逗号；
 * - 直接返回 JSON 字符串字面量。
 *
 * 解析失败明确返回原因，调用方据此决定兜底文案，不再把空对象当成
 * 「文档信息量太少」。
 */
export const parseAiJson = (text: unknown): AiParseResult => {
  if (typeof text !== "string" || text.trim() === "") {
    return { ok: false, reason: "empty" }
  }

  const raw = text.trim()
  const fenced = raw.match(CODE_FENCE_REGEX)
  const candidates = [fenced?.[1]?.trim(), raw].filter((item): item is string => !!item && item !== "")

  for (const candidate of candidates) {
    const direct = tryParseJson(candidate)
    if (direct.ok) {
      return direct
    }

    const extracted = extractJsonCandidate(candidate)
    if (extracted && extracted !== candidate) {
      const parsed = tryParseJson(extracted)
      if (parsed.ok) {
        return parsed
      }
    }

    const repaired = repairTrailingCommas(extracted ?? candidate)
    const parsedRepaired = tryParseJson(repaired)
    if (parsedRepaired.ok) {
      return parsedRepaired
    }
  }

  return { ok: false, reason: "invalid-json" }
}

/**
 * 从解析结果中取字段；单值响应（字符串/数组）直接作为字段值。
 */
export const pickAiField = (value: unknown, ...keys: string[]): unknown => {
  if (isRecord(value)) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return value[key]
      }
    }
    return undefined
  }
  return value
}

export const normalizeAiTitle = (value: unknown): string => {
  if (typeof value !== "string") {
    return ""
  }
  return stripOuterQuotes(value)
}

export const normalizeAiDescription = (value: unknown): string => {
  if (typeof value !== "string") {
    return ""
  }
  return value.trim()
}

export const normalizeAiTags = (value: unknown): string[] => {
  const raw = isRecord(value) ? (value.tags ?? value.tag ?? value.keywords) : value
  const flattened = Array.isArray(raw) ? raw.map((item) => (isRecord(item) ? item.name : item)) : raw
  return normalizeTagValue(flattened)
    .map((tag) => tag.replace(/^#+/, "").trim())
    .filter((tag) => tag !== "")
}

export const normalizeAiCategories = (value: unknown): string[] => {
  const raw = isRecord(value) ? (value.categories ?? value.category) : value
  const flattened = Array.isArray(raw) ? raw.map((item) => (isRecord(item) ? item.name : item)) : raw
  return normalizeTagValue(flattened)
    .map((category) => category.replace(/^#+/, "").trim())
    .filter((category) => category !== "")
}

// ================
// private methods
// ================
const tryParseJson = (text: string): AiParseResult => {
  try {
    let value = JSON.parse(text)
    // 兼容模型把 JSON 再包一层字符串的情况
    if (typeof value === "string" && /^[{[].*[}\]]$/s.test(value)) {
      value = JSON.parse(value)
    }
    return { ok: true, value }
  } catch {
    return { ok: false, reason: "invalid-json" }
  }
}

/**
 * 提取第一个完整的 JSON 对象/数组（跳过字符串内的括号）。
 */
const extractJsonCandidate = (text: string): string | undefined => {
  const start = text.search(JSON_START_REGEX)
  if (start < 0) {
    return undefined
  }

  const open = text[start]
  const close = open === "{" ? "}" : "]"
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i++) {
    const char = text[i]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
    } else if (char === open) {
      depth++
    } else if (char === close) {
      depth--
      if (depth === 0) {
        return text.slice(start, i + 1)
      }
    }
  }

  return undefined
}

const repairTrailingCommas = (text: string): string => text.replace(/,(\s*[}\]])/g, "$1")
