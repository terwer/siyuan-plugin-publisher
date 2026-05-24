/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"

export interface V2QuickPublishErrorText {
  summary: string
  details: string
}

export interface V2QuickPublishResultErrorInput {
  errMsg?: unknown
  errDetails?: unknown
  fallback?: string
}

const MAX_SUMMARY_LENGTH = 220
const MESSAGE_KEYS = ["msg", "message"] as const

const stringifyUnknown = (input: unknown): string => {
  if (input === null || input === undefined) {
    return ""
  }
  if (input instanceof Error) {
    return input.message || String(input)
  }
  if (typeof input === "string") {
    return input
  }
  if (typeof input === "number" || typeof input === "boolean" || typeof input === "bigint") {
    return String(input)
  }
  try {
    return JSON.stringify(input)
  } catch {
    return String(input)
  }
}

export const sanitizeV2QuickPublishText = (input: unknown): string => {
  const sanitized = sanitizeSensitiveForLog(input)
  if (sanitized === null || sanitized === undefined) {
    return ""
  }
  if (typeof sanitized === "string") {
    return sanitized
  }
  try {
    return JSON.stringify(sanitized)
  } catch {
    return String(sanitized)
  }
}

const compactSummary = (input: string): string => {
  const normalized = input.replace(/\s+/g, " ").trim()
  if (normalized.length <= MAX_SUMMARY_LENGTH) {
    return normalized
  }
  return `${normalized.slice(0, MAX_SUMMARY_LENGTH - 1)}…`
}

const stripFailurePrefix = (input: string): string => {
  let text = input.trim()
  const arrowIndex = text.indexOf("=>")
  if (arrowIndex >= 0 && arrowIndex <= 80) {
    text = text.slice(arrowIndex + 2).trim()
  }

  return text
    .replace(/^(?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)?(?:Error|Exception):\s*/u, "")
    .replace(/^[A-Za-z_$][\w$]*(?:Error|Exception):\s*/u, "")
    .trim()
}

const tryParseJson = (input: string): unknown | null => {
  const text = input.trim()
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const extractJsonObjectCandidates = (input: string): string[] => {
  const candidates: string[] = []

  for (let start = 0; start < input.length; start++) {
    if (input[start] !== "{") {
      continue
    }

    let depth = 0
    let inString = false
    let escaped = false

    for (let index = start; index < input.length; index++) {
      const char = input[index]

      if (inString) {
        if (escaped) {
          escaped = false
          continue
        }
        if (char === "\\") {
          escaped = true
          continue
        }
        if (char === "\"") {
          inString = false
        }
        continue
      }

      if (char === "\"") {
        inString = true
        continue
      }
      if (char === "{") {
        depth += 1
        continue
      }
      if (char === "}") {
        depth -= 1
        if (depth === 0) {
          candidates.push(input.slice(start, index + 1))
          break
        }
      }
    }
  }

  return candidates
}

const maybeParseJsonString = (input: string): unknown | null => {
  const text = input.trim()
  if (!text.startsWith("{") && !text.startsWith("[")) {
    return null
  }
  return tryParseJson(text)
}

const findMessageField = (value: unknown, seen = new Set<unknown>()): string | null => {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value === "string") {
    const nestedJson = maybeParseJsonString(value)
    if (nestedJson !== null) {
      return findMessageField(nestedJson, seen)
    }
    return null
  }
  if (typeof value !== "object") {
    return null
  }
  if (seen.has(value)) {
    return null
  }
  seen.add(value)

  const record = value as Record<string, unknown>
  for (const key of MESSAGE_KEYS) {
    const candidate = record[key]
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate
    }
  }

  const error = record.error
  if (typeof error === "string" && error.trim()) {
    return error
  }
  const nestedErrorMessage = findMessageField(error, seen)
  if (nestedErrorMessage) {
    return nestedErrorMessage
  }

  return null
}

const buildJsonParseCandidates = (raw: string): string[] => {
  const candidates = new Set<string>()
  const stripped = stripFailurePrefix(raw)
  candidates.add(raw.trim())
  candidates.add(stripped)
  candidates.add(raw.replace(/^.*?=>/u, "").trim())
  candidates.add(stripped.replace(/^Error:\s*/u, "").trim())

  extractJsonObjectCandidates(raw).forEach((candidate) => candidates.add(candidate))
  extractJsonObjectCandidates(stripped).forEach((candidate) => candidates.add(candidate))

  return Array.from(candidates).filter((candidate) => candidate.length > 0)
}

const extractBusinessSummary = (raw: string): string => {
  for (const candidate of buildJsonParseCandidates(raw)) {
    const parsed = tryParseJson(stripFailurePrefix(candidate))
    const message = findMessageField(parsed)
    if (message) {
      return compactSummary(sanitizeV2QuickPublishText(message))
    }
  }

  const fallbackLine = stripFailurePrefix(raw)
    .split(/\r?\n/u)
    .map((line) => stripFailurePrefix(line))
    .find((line) => line.length > 0)

  return compactSummary(sanitizeV2QuickPublishText(fallbackLine || raw))
}

const joinDetails = (parts: unknown[], fallback: string): string => {
  const detailParts = parts
    .map((part) => stringifyUnknown(part).trim())
    .filter((part, index, array) => part.length > 0 && array.indexOf(part) === index)

  if (detailParts.length === 0) {
    detailParts.push(fallback)
  }

  return sanitizeV2QuickPublishText(detailParts.join("\n\n"))
}

export const buildV2QuickPublishErrorText = (input: V2QuickPublishResultErrorInput): V2QuickPublishErrorText => {
  const fallback = input.fallback || ""
  const summarySource = stringifyUnknown(input.errMsg || input.errDetails || fallback)
  const summary = extractBusinessSummary(summarySource || fallback)
  const details = joinDetails([input.errDetails, input.errMsg], summary || fallback)

  return {
    summary: summary || fallback,
    details: details || summary || fallback,
  }
}

export const buildV2QuickPublishCaughtErrorText = (error: unknown, fallback: string): V2QuickPublishErrorText => {
  const errorMessage = error instanceof Error ? error.message || String(error) : stringifyUnknown(error)
  const errorDetails = error instanceof Error ? error.stack || error.message || String(error) : errorMessage

  return buildV2QuickPublishErrorText({
    errMsg: errorMessage || fallback,
    errDetails: errorDetails || errorMessage || fallback,
    fallback,
  })
}
