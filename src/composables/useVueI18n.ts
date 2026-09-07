/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */
import { inject } from "vue"
import { useI18n } from "vue-i18n"
import enUS from "~/src/locales/en_US.ts"
import zhCN from "~/src/locales/zh_CN.ts"
import { DEFAULT_SIYUAN_LANG } from "~/src/constants/lang.ts"
import { V2_I18N_FALLBACK_KEY } from "~/src/composables/v2/useV2I18n.ts"

/**
 * 多语言封装，解决 CSP
 *
 * https://github.com/intlify/vue-i18n-next/issues/543
 */
export const useVueI18n = () => {
  const { messages, locale } = useI18n()
  const fallback = inject(V2_I18N_FALLBACK_KEY, undefined)

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

  const translate = (key, params?: Record<string, string | number | boolean | null | undefined>) => {
    const localeMessages = messages.value?.[locale.value] as Record<string, any> | undefined
    const effectiveLocale = locale.value === "plugin" ? DEFAULT_SIYUAN_LANG : locale.value
    const legacyMessages =
      effectiveLocale === "en_US"
        ? (enUS as Record<string, any>)
        : (zhCN as Record<string, any>)

    let message =
      resolveFromObject(localeMessages, key) ??
      fallback?.resolve(key) ??
      resolveFromObject(legacyMessages, key) ??
      key

    if (!params) {
      return message
    }

    for (const [paramKey, paramValue] of Object.entries(params)) {
      message = message.split(`{${paramKey}}`).join(String(paramValue ?? ""))
    }

    return message
  }

  return { t: translate, locale }
}
