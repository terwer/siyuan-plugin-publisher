/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 思源文档属性在发布链路中的序列化与合并。
 *
 * `Post.attrs` 是 zhi-blog-api 的附加属性 JSON 字符串。zhi-siyuan-api 的 `getPost`
 * 只把少量固定属性写进去；为了让 YAML 预设的 `[attr:...]` 能读取任意文档属性，
 * 发布前把 `getBlockAttrs` 的完整结果合并进来。
 *
 * @author terwer
 * @since 2.5.0
 */

/** JSON 对象里不应该被写回 Front Matter 的键（避免原型污染） */
const FORBIDDEN_ATTR_KEYS = new Set(["__proto__", "constructor", "prototype"])

/** 判断 JSON 解析结果是否为普通对象 */
const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

/**
 * 解析 `Post.attrs`；非法 JSON、非对象或空值时返回空对象。
 *
 * @param raw `Post.attrs` 原文
 */
const parseDocAttrs = (raw: string | undefined): Record<string, unknown> => {
  if (typeof raw !== "string" || raw.trim() === "") {
    return {}
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    return isPlainRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * 把文档属性合并进 `Post.attrs`，已有字段优先保留。
 *
 * 合并顺序为「完整文档属性 → 已有附加属性」：前者提供 YAML 预设需要的全部属性，
 * 后者保留平台适配器写入的派生字段（如发布状态、平台 YAML）。
 *
 * @param raw 已有的 `Post.attrs` 原文
 * @param docAttrs `getBlockAttrs` 读取到的文档属性；读取失败时传 undefined
 * @returns 合并后的 JSON 字符串；没有可用文档属性时原样返回
 */
const mergeDocAttrs = (
  raw: string | undefined,
  docAttrs: Record<string, any> | undefined | null
): string | undefined => {
  if (!docAttrs) {
    return raw
  }

  const merged: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(docAttrs)) {
    if (!FORBIDDEN_ATTR_KEYS.has(key)) {
      merged[key] = value
    }
  }
  for (const [key, value] of Object.entries(parseDocAttrs(raw))) {
    if (!FORBIDDEN_ATTR_KEYS.has(key)) {
      merged[key] = value
    }
  }
  return JSON.stringify(merged)
}

export { mergeDocAttrs, parseDocAttrs }
