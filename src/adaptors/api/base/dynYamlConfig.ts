/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { Post } from "zhi-blog-api"
import dayjs from "dayjs"
import { parseDocAttrs } from "~/src/utils/docAttrs.ts"

/**
 * 「YAML 预设配置」（dynYamlCfg）的共享解析与合并。
 *
 * 静态站平台的 YAML 预设配置以 JSON 文本保存在 `BlogConfig.dynYamlCfg` 中。发布时，
 * 先解析成对象、把取值里的占位符按当前文章解析，再逐键覆盖到自动生成的 Front Matter。
 *
 * 支持的占位符（仅对字符串取值生效，嵌套对象与数组递归处理）：
 * - `[createDate-格式]` / `[updateDate-格式]`：文章创建/更新时间，格式为 dayjs 的格式串，
 *   省略格式时使用 `YYYY-MM-DD`；文章没有更新时间时用创建时间。
 * - `[tags]` / `[categories]`：标签/分类；整个取值就是该占位符时输出 YAML 数组，
 *   写在句子中时用逗号连接。
 * - `[title]` / `[slug]`：标题/别名。
 * - `[attr:属性名]`：思源文档属性（来自发布前合并进 `Post.attrs` 的完整文档属性）。
 *   属性名按文档中保存的完整名称匹配（大小写不敏感兜底）；可追加类型后缀：
 *   `[attr:custom-weight|int]`、`[attr:custom-score|float]`、`[attr:custom-draft|bool]`。
 *   整个取值就是该占位符时保留转换后的原生类型，写在句子中时按文本替换；属性不存在
 *   或为空时整个取值会被省略，类型转换失败时保留原字符串。
 *
 * 未知占位符原样保留；取值不是字符串时不做替换；整个取值就是占位符时保留原生类型。
 *
 * @author terwer
 * @since 2.4.0
 */

/** 日期格式的默认值 */
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD"

/** JSON 对象里不应该被写回 Front Matter 的键（避免原型污染） */
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"])

/** 属性占位符解析结果为「不存在」时的内部标记，用于省略整个取值 */
const ABSENT = Symbol("absent")

type DateToken = "createDate" | "updateDate"
type TextToken = "tags" | "categories" | "title" | "slug"

const DATE_TOKEN = /\[(createDate|updateDate)(?:-([^\[\]]+))?\]/g
const TEXT_TOKEN = /\[(tags|categories|title|slug)\]/g
const ATTR_TOKEN = /\[attr:([^\[\]|]+)(?:\|([^\[\]]+))?\]/g
const WHOLE_DATE_TOKEN = /^\[(createDate|updateDate)(?:-([^\[\]]+))?\]$/
const WHOLE_TEXT_TOKEN = /^\[(tags|categories|title|slug)\]$/
const WHOLE_ATTR_TOKEN = /^\[attr:([^\[\]|]+)(?:\|([^\[\]]+))?\]$/

/** 判断 JSON 解析结果是否为普通对象 */
const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

/** 把逗号分隔的标签拆成数组 */
const splitTags = (post: Post): string[] =>
  (post.mt_keywords ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")

/** 文章分类（保证是数组副本） */
const postCategories = (post: Post): string[] => (Array.isArray(post.categories) ? [...post.categories] : [])

/** 文本占位符的数组形态，用于「整个取值就是占位符」的场景 */
const resolveTextArray = (token: TextToken, post: Post): string[] | string => {
  switch (token) {
    case "tags":
      return splitTags(post)
    case "categories":
      return postCategories(post)
    case "title":
      return post.title ?? ""
    case "slug":
      return post.wp_slug ?? ""
  }
}

/** 文本占位符的字符串形态，用于写在句子中的场景 */
const resolveTextString = (token: TextToken, post: Post): string => {
  const value = resolveTextArray(token, post)
  return Array.isArray(value) ? value.join(",") : value
}

/** 按格式输出文章时间；日期不可用或格式为空时使用默认格式 */
const resolveDate = (token: DateToken, format: string | undefined, post: Post): string => {
  const date = token === "createDate" ? post.dateCreated : post.dateUpdated ?? post.dateCreated
  if (date === undefined || date === null) {
    return ""
  }
  const parsed = dayjs(date)
  if (!parsed.isValid()) {
    return ""
  }
  const normalizedFormat = format?.trim() || DEFAULT_DATE_FORMAT
  return parsed.format(normalizedFormat)
}

/** 文档属性值转成文本；只接受可安全写入 YAML 的标量 */
const attrValueToText = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return undefined
}

/** 按名称查找文档属性；精确命中优先，兼容历史大写属性名 */
const lookupDocAttr = (attrs: Record<string, unknown>, name: string): unknown => {
  if (Object.prototype.hasOwnProperty.call(attrs, name)) {
    return attrs[name]
  }
  const lowerName = name.toLowerCase()
  const matchedKey = Object.keys(attrs).find((key) => key.toLowerCase() === lowerName)
  return matchedKey === undefined ? undefined : attrs[matchedKey]
}

/** 按类型后缀转换属性值；转换失败时保留原字符串 */
const coerceAttrValue = (text: string, type: string | undefined): unknown => {
  switch (type?.trim().toLowerCase()) {
    case "int": {
      const trimmed = text.trim()
      if (!/^[+-]?\d+$/.test(trimmed)) {
        return text
      }
      const parsed = Number.parseInt(trimmed, 10)
      return Number.isSafeInteger(parsed) ? parsed : text
    }
    case "float": {
      const trimmed = text.trim()
      if (trimmed === "") {
        return text
      }
      const parsed = Number(trimmed)
      return Number.isFinite(parsed) ? parsed : text
    }
    case "bool": {
      const normalized = text.trim().toLowerCase()
      if (normalized === "true") {
        return true
      }
      if (normalized === "false") {
        return false
      }
      return text
    }
    default:
      return text
  }
}

/** 解析一个属性占位符；不存在或为空时返回 ABSENT */
const resolveAttrToken = (
  name: string,
  type: string | undefined,
  attrs: Record<string, unknown>
): unknown | typeof ABSENT => {
  const attrName = name.trim()
  if (attrName === "" || FORBIDDEN_KEYS.has(attrName)) {
    return ABSENT
  }
  const value = lookupDocAttr(attrs, attrName)
  const text = attrValueToText(value)
  if (text === undefined || text === "") {
    return ABSENT
  }
  return coerceAttrValue(text, type)
}

/** 解析一个字符串取值：整个取值是占位符时保留原生类型，否则按文本替换 */
const resolveString = (value: string, post: Post, attrs: Record<string, unknown>): unknown => {
  const wholeDate = WHOLE_DATE_TOKEN.exec(value)
  if (wholeDate) {
    return resolveDate(wholeDate[1] as DateToken, wholeDate[2], post)
  }

  const wholeText = WHOLE_TEXT_TOKEN.exec(value)
  if (wholeText) {
    return resolveTextArray(wholeText[1] as TextToken, post)
  }

  const wholeAttr = WHOLE_ATTR_TOKEN.exec(value)
  if (wholeAttr) {
    return resolveAttrToken(wholeAttr[1], wholeAttr[2], attrs)
  }

  return value
    .replace(DATE_TOKEN, (_match, token: string, format: string | undefined) =>
      resolveDate(token as DateToken, format, post)
    )
    .replace(TEXT_TOKEN, (_match, token: string) => resolveTextString(token as TextToken, post))
    .replace(ATTR_TOKEN, (_match, name: string, type: string | undefined) => {
      const resolved = resolveAttrToken(name, type, attrs)
      return resolved === ABSENT ? "" : String(resolved)
    })
}

/** 递归解析预设配置里的取值 */
const resolveValue = (value: unknown, post: Post, attrs: Record<string, unknown>): unknown => {
  if (typeof value === "string") {
    return resolveString(value, post, attrs)
  }
  if (Array.isArray(value)) {
    const resolved: unknown[] = []
    for (const item of value) {
      const itemValue = resolveValue(item, post, attrs)
      if (itemValue !== ABSENT) {
        resolved.push(itemValue)
      }
    }
    return resolved
  }
  if (isPlainRecord(value)) {
    const resolved: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(key)) {
        continue
      }
      const itemValue = resolveValue(item, post, attrs)
      if (itemValue !== ABSENT) {
        resolved[key] = itemValue
      }
    }
    return resolved
  }
  return value
}

/** 当前文章可用的文档属性 */
const postDocAttrs = (post: Post | undefined): Record<string, unknown> =>
  parseDocAttrs((post as { attrs?: string } | undefined)?.attrs)

/**
 * 把 YAML 预设配置的 JSON 文本解析成对象；非法 JSON 或非对象时返回空对象。
 *
 * @param raw 配置原文（`BlogConfig.dynYamlCfg`）
 */
const parseDynYamlCfg = (raw: string | undefined): Record<string, unknown> => {
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
 * 解析 YAML 预设配置并按当前文章替换占位符。
 *
 * @param raw 配置原文（`BlogConfig.dynYamlCfg`）
 * @param post 当前文章
 * @returns 解析后的配置；非法 JSON 或非对象时为空对象
 */
const resolveDynYamlCfg = (raw: string | undefined, post: Post): Record<string, unknown> =>
  resolveValue(parseDynYamlCfg(raw), post, postDocAttrs(post)) as Record<string, unknown>

/**
 * 把 YAML 预设配置合并进 Front Matter。
 *
 * 解析后的配置为空时，写入平台默认字段（没有默认字段时什么都不做）；否则逐键覆盖
 * 已生成的字段，保持「预设配置优先」的既有语义。
 *
 * @param yamlObj 待写入的 Front Matter 对象
 * @param raw 配置原文（`BlogConfig.dynYamlCfg`）
 * @param post 当前文章
 * @param platformDefaults 预设配置为空时使用的平台默认字段
 */
const applyDynYamlCfg = (
  yamlObj: Record<string, any>,
  raw: string | undefined,
  post: Post,
  platformDefaults: Record<string, any> = {}
): void => {
  const parsed = parseDynYamlCfg(raw)
  const configuredKeys = Object.keys(parsed).filter((key) => !FORBIDDEN_KEYS.has(key))
  const resolved = resolveValue(parsed, post, postDocAttrs(post)) as Record<string, unknown>

  // 是否应用平台默认值按「用户是否配置了预设」判断，而不是按解析后的键数量：
  // 预设里只写了缺失的文档属性时，解析结果虽然为空，也不应悄悄补上平台默认字段。
  if (configuredKeys.length === 0) {
    for (const [key, value] of Object.entries(platformDefaults)) {
      yamlObj[key] = value
    }
    return
  }

  for (const key of Object.keys(resolved)) {
    if (!FORBIDDEN_KEYS.has(key)) {
      yamlObj[key] = resolved[key]
    }
  }
}

/**
 * 校验 YAML 预设配置的文本形态。
 *
 * @param raw 配置原文（`BlogConfig.dynYamlCfg`）
 * @returns 合法时返回 `undefined`，否则返回错误类型，供界面给出可读提示
 */
const validateDynYamlCfg = (raw: string | undefined): "invalidJson" | "notObject" | undefined => {
  if (typeof raw !== "string" || raw.trim() === "") {
    return undefined
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return "invalidJson"
  }
  return isPlainRecord(parsed) ? undefined : "notObject"
}

export { applyDynYamlCfg, parseDynYamlCfg, resolveDynYamlCfg, validateDynYamlCfg }
