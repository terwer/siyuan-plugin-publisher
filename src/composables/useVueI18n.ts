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

  const translate = (key) => {
    const localeMessages = messages.value?.[locale.value]
    return localeMessages[key] || key
  }

  return { t: translate, locale }
}
