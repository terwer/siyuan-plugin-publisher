/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import type { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"

const parseHttpUrl = (url?: string) => {
  if (StrUtil.isEmptyString(url)) {
    return null
  }

  try {
    const parsed = new URL(String(url).trim())
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed : null
  } catch {
    return null
  }
}

const getAbsoluteOrigin = (url?: string) => parseHttpUrl(url)?.origin ?? ""

const resolveWebCookieUrl = (url?: string, home?: string, apiUrl?: string) => {
  if (StrUtil.isEmptyString(url)) {
    return ""
  }

  const rawUrl = String(url).trim()
  const absoluteUrl = parseHttpUrl(rawUrl)
  if (absoluteUrl) {
    return absoluteUrl.href
  }

  const baseOrigin = getAbsoluteOrigin(home) || getAbsoluteOrigin(apiUrl)
  if (StrUtil.isEmptyString(baseOrigin)) {
    return ""
  }

  try {
    return new URL(rawUrl, baseOrigin).href
  } catch {
    return ""
  }
}

const resolveWebCookieAuthOrigin = (authUrl?: string, home?: string, apiUrl?: string) => {
  const resolvedAuthUrl = resolveWebCookieUrl(authUrl, home, apiUrl)
  return parseHttpUrl(resolvedAuthUrl)?.origin ?? ""
}

const buildWebCookieRequestDynCfg = (
  dynCfg?: DynamicConfig,
  cfg?: { home?: string; apiUrl?: string; logoutUrl?: string }
) => {
  if (!dynCfg) {
    return dynCfg
  }

  const authUrl = resolveWebCookieUrl(dynCfg.authUrl, cfg?.home, cfg?.apiUrl)
  const logoutUrl = resolveWebCookieUrl(dynCfg.logoutUrl || cfg?.logoutUrl, cfg?.home, cfg?.apiUrl)
  const authUrlObj = parseHttpUrl(authUrl)

  return {
    ...dynCfg,
    authUrl,
    logoutUrl: logoutUrl || dynCfg.logoutUrl,
    domain: StrUtil.isEmptyString(dynCfg.domain) && authUrlObj ? authUrlObj.hostname : dynCfg.domain,
  } as DynamicConfig
}

export { buildWebCookieRequestDynCfg, resolveWebCookieAuthOrigin, resolveWebCookieUrl }
