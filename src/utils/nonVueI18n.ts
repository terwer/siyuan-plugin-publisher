/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { DEFAULT_SIYUAN_LANG } from "~/src/constants/lang.ts"
import enUS from "~/siyuan/i18n/en_US.json"
import zhCN from "~/siyuan/i18n/zh_CN.json"

/**
 * 给 adaptor、API class、普通工具函数等「非 Vue setup / 非组件上下文」使用的 i18n 解析器。
 *
 * 全插件只有一份文案：`siyuan/i18n/*.json`。Vue 组件与 composable 用 `useAppI18n()`。
 */
const resolveFromObject = (source: Record<string, any> | undefined, key: string) => {
  if (!source || !key) {
    return undefined
  }

  if (Object.prototype.hasOwnProperty.call(source, key) && typeof source[key] === "string") {
    return source[key]
  }

  if (!key.includes(".")) {
    return undefined
  }

  const nestedValue = key.split(".").reduce<any>((current, part) => {
    if (current && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, part)) {
      return current[part]
    }
    return undefined
  }, source)

  return typeof nestedValue === "string" ? nestedValue : undefined
}

export const translateNonVueI18n = (
  key: string,
  params?: Record<string, string | number | boolean | null | undefined>,
  locale = DEFAULT_SIYUAN_LANG
) => {
  const source = locale === "en_US" ? (enUS as Record<string, any>) : (zhCN as Record<string, any>)
  let message = resolveFromObject(source, key) ?? key

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      message = message.split(`{${paramKey}}`).join(String(paramValue ?? ""))
    }
  }

  return message
}
