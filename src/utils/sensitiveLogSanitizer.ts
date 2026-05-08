/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

const REDACTED = "<redacted>"

const SENSITIVE_KEY_RE = /(cookie|authorization|x-auth-token|x-csrf-token|ctoken|csrf|ticket|token)/i
const SENSITIVE_QUERY_RE = /([?&](?:ctoken|csrf|ticket|token|access_token|refresh_token)=)[^&\s]+/gi
const SENSITIVE_PAIR_RE =
  /(^|[;,\s{])((?:cookie|authorization|x-auth-token|x-csrf-token|ctoken|csrf|ticket|token)\s*[:=]\s*)[^;,\s}]+/gi

const redactSensitiveString = (input: string): string => {
  return input.replace(SENSITIVE_QUERY_RE, `$1${REDACTED}`).replace(SENSITIVE_PAIR_RE, `$1$2${REDACTED}`)
}

/**
 * 递归脱敏日志对象，避免 Cookie/Authorization/ctoken/token/csrf/ticket 等字段进入控制台。
 */
const sanitizeSensitiveForLog = <T = any>(input: T): any => {
  if (input === null || input === undefined) {
    return input
  }

  if (typeof input === "string") {
    return redactSensitiveString(input)
  }

  if (typeof input !== "object") {
    return input
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeSensitiveForLog(item))
  }

  const output: Record<string, any> = {}
  Object.entries(input as Record<string, any>).forEach(([key, value]) => {
    output[key] = SENSITIVE_KEY_RE.test(key) ? REDACTED : sanitizeSensitiveForLog(value)
  })
  return output
}

/**
 * Electron Cookie 对象的敏感值字段名通常是通用的 `value`，需要按 Cookie 语义单独脱敏。
 */
const sanitizeCookieArrayForLog = (cookies?: Array<Record<string, any>> | null): any[] => {
  if (!Array.isArray(cookies)) {
    return []
  }

  return cookies.map((cookie) => ({
    ...sanitizeSensitiveForLog(cookie),
    value: REDACTED,
  }))
}

export { sanitizeCookieArrayForLog, sanitizeSensitiveForLog }
