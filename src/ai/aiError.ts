/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { AiParseFailureReason } from "~/src/ai/aiResult.ts"

export type AiFailureKind = "timeout" | "auth" | "request" | "format" | "empty"

const TIMEOUT_PATTERN = /timeout|timed out|ETIMEDOUT|abort/i
const AUTH_PATTERN = /(^|\D)(401|403)(\D|$)|unauthor|invalid[^\n]*key|api key|forbidden/i

/**
 * 把 AI 请求异常归为可读的原因，避免所有失败都提示「请配置 key」。
 */
export const classifyAiError = (error: unknown): Exclude<AiFailureKind, "format" | "empty"> => {
  const message = String((error as { message?: unknown })?.message ?? error ?? "")
  const name = String((error as { name?: unknown })?.name ?? "")
  const combined = `${name} ${message}`

  if (TIMEOUT_PATTERN.test(combined)) {
    return "timeout"
  }
  if (AUTH_PATTERN.test(combined)) {
    return "auth"
  }
  return "request"
}

/**
 * 解析失败原因对应的 i18n key。
 */
export const aiParseFailureI18nKey = (reason: AiParseFailureReason): string =>
  reason === "empty" ? "ai.error.empty" : "ai.error.format"

/**
 * 请求失败原因对应的 i18n key。
 */
export const aiErrorI18nKey = (kind: Exclude<AiFailureKind, "format" | "empty">): string => `ai.error.${kind}`
