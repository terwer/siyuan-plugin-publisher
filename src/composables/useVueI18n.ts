/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */
import { useI18n } from "vue-i18n"

/**
 * 多语言封装，解决 CSP
 *
 * https://github.com/intlify/vue-i18n-next/issues/543
 */
export const useVueI18n = () => {
  const { messages, locale } = useI18n()

  const translate = (key, params?: Record<string, string | number | boolean | null | undefined>) => {
    const localeMessages = messages.value?.[locale.value]
    let message = localeMessages[key] || key

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
