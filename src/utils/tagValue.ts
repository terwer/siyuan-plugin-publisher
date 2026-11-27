/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 把平台/YAML/AI 返回的标签值归一化为字符串数组。
 *
 * 历史数据与模型输出可能是数组、逗号分隔字符串、YAML 流式数组字符串，
 * 甚至把单个标签写成对象。这里统一兼容，避免读取侧直接调用 `.join`
 * 或 `.split` 时抛错，也避免把 "a,b" 按字符拆开。
 *
 * @param value 原始标签值
 * @returns 去空、去重后的标签数组，保持原始顺序
 */
export const normalizeTagValue = (value: unknown): string[] => {
  const collected: string[] = []

  const collect = (input: unknown): void => {
    if (input === null || input === undefined) {
      return
    }
    if (Array.isArray(input)) {
      input.forEach((item) => collect(item))
      return
    }
    if (typeof input === "string") {
      let text = input.trim()
      if (text === "") {
        return
      }
      // 兼容 YAML 流式数组被当成普通字符串传入的情况：tags: [a, b]
      if (text.startsWith("[") && text.endsWith("]")) {
        text = text.slice(1, -1)
      }
      text.split(/[,，]/).forEach((part) => {
        const tag = part.trim().replace(/^['"]|['"]$/g, "").trim()
        if (tag !== "") {
          collected.push(tag)
        }
      })
      return
    }
    if (typeof input === "number" || typeof input === "boolean") {
      collected.push(String(input))
    }
  }

  collect(value)
  return Array.from(new Set(collected))
}

/**
 * 把标签值归一化为插件内部统一使用的逗号分隔字符串。
 */
export const tagValueToKeywords = (value: unknown): string => normalizeTagValue(value).join(",")
