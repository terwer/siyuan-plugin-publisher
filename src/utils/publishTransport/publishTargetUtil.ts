/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 发布目标 URL 安全规则（XML-RPC、multipart、未来 JSON 共用）。
 */
export function isLoopbackOrLocalTargetUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    const host = hostname.toLowerCase().replace(/^\[|\]$/g, "")
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") {
      return true
    }
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true
    }
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true
    }
    const m = host.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/)
    if (m) {
      const second = Number(m[1])
      if (second >= 16 && second <= 31) {
        return true
      }
    }
  } catch {
    return false
  }
  return false
}
