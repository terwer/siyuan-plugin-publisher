/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createI18n } from "vue-i18n"
import zh_CN from "./zh_CN"
import en_US from "./en_US"
import { SiyuanDevice } from "zhi-device"

/**
 * 获取初始语言设置
 * 优先级：1. window.siyuan.config.lang 2. 默认 zh_CN
 */
const getInitialLocale = (): "zh_CN" | "en_US" => {
  try {
    const win = SiyuanDevice.siyuanWindow()
    const siyuanLang = win?.siyuan?.config?.lang
    if (siyuanLang === "en_US" || siyuanLang === "zh_CN") {
      return siyuanLang
    }
    // 如果 SiYuan 的语言是英文相关的，返回 en_US
    if (siyuanLang && typeof siyuanLang === "string" && siyuanLang.toLowerCase().startsWith("en")) {
      return "en_US"
    }
    // 如果 SiYuan 的语言是中文相关的，返回 zh_CN
    if (siyuanLang && typeof siyuanLang === "string" && siyuanLang.toLowerCase().startsWith("zh")) {
      return "zh_CN"
    }
  } catch (e) {
    // 忽略错误，使用默认值
  }
  return "zh_CN" // 默认显示语言
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: "en_US", // 次要语言
  messages: {
    zh_CN,
    en_US,
  },
})

export default i18n
