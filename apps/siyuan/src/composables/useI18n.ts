/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import SiyuanPublisherPlugin from "@/index.ts"

/**
 * 多语言
 */
export const useI18n = (pluginInstance: SiyuanPublisherPlugin) => {
  const t = (key: string, ...args: any[]) => {
    // 处理嵌套键访问
    const keys = key.split(".")
    let value: any = pluginInstance.i18n

    // 安全遍历对象层级
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }

    // 处理参数插值
    if (typeof value === "string" && args.length) {
      return value.replace(/{(\d+)}/g, (match, index) => {
        return args[Number(index)] ?? match
      })
    }

    // 找不到时返回原 key
    return value ?? key
  }

  return { t }
}
