/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { Post } from "zhi-blog-api"
import { StrUtil } from "zhi-common"

/**
 * 详细发布表单里可以单独覆盖的思源元数据字段。
 *
 * 这些字段默认跟随思源文档；只有用户在详细模式里主动改过，才作为该平台的
 * 覆盖值保留下来。这样既不会把文档里的新内容锁死在旧发布值上，也不会让
 * 用户手改的平台值被文档时间/内容覆盖。
 */
export const DETAILED_METADATA_FIELDS = [
  "title",
  "excerpt",
  "tags",
  "categories",
  "dateCreated",
  "dateUpdated",
] as const

export type DetailedMetadataField = (typeof DETAILED_METADATA_FIELDS)[number]

/**
 * 思源文档侧的元数据快照，用于在平台 YAML 解析之后按覆盖策略回填。
 */
export interface SiyuanDocMetadata {
  title?: string
  shortDesc?: string
  mt_keywords?: string
  categories?: string[]
  dateCreated?: Date
  dateUpdated?: Date
}

/**
 * 携带思源元数据快照和覆盖字段的文章扩展。
 */
export interface PublishMetadataPost extends Post {
  siyuanMetadata?: SiyuanDocMetadata
  metadataOverrides?: DetailedMetadataField[]
}

const FIELD_SET = new Set<string>(DETAILED_METADATA_FIELDS)

/**
 * 把思源文档的元数据复制成独立快照。
 *
 * @param post - 思源文档文章
 */
export const extractSiyuanMetadata = (post?: Post): SiyuanDocMetadata => {
  if (!post) {
    return {}
  }
  return {
    title: post.title,
    shortDesc: post.shortDesc,
    mt_keywords: post.mt_keywords,
    categories: Array.isArray(post.categories) ? [...post.categories] : [],
    dateCreated: post.dateCreated instanceof Date ? post.dateCreated : undefined,
    dateUpdated: post.dateUpdated instanceof Date ? post.dateUpdated : undefined,
  }
}

/**
 * 从平台元数据 JSON 中解析覆盖字段集合。
 *
 * @param raw - 平台元数据里保存的 JSON 数组
 */
export const parseMetadataOverrides = (raw?: string): Set<DetailedMetadataField> => {
  if (StrUtil.isEmptyString(raw)) {
    return new Set()
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return new Set()
    }
    const fields = parsed.filter((field): field is DetailedMetadataField => {
      return typeof field === "string" && FIELD_SET.has(field)
    })
    return new Set(fields)
  } catch {
    return new Set()
  }
}

/**
 * 把覆盖字段集合序列化成平台元数据 JSON。
 *
 * @param fields - 覆盖字段集合
 */
export const serializeMetadataOverrides = (fields: Iterable<DetailedMetadataField>): string => {
  const unique = new Set<DetailedMetadataField>()
  for (const field of fields) {
    if (FIELD_SET.has(field)) {
      unique.add(field)
    }
  }
  return JSON.stringify([...unique])
}

/**
 * 读取文章上的覆盖字段集合。
 *
 * @param post - 文章
 */
export const getMetadataOverrides = (post?: Post): Set<DetailedMetadataField> => {
  const fields = (post as PublishMetadataPost | undefined)?.metadataOverrides ?? []
  return new Set(fields.filter((field) => FIELD_SET.has(field)))
}

/**
 * 标记用户主动改过某个元数据字段。
 *
 * @param post - 文章
 * @param field - 字段
 */
export const markMetadataOverride = (post: Post, field: DetailedMetadataField): Post => {
  const target = post as PublishMetadataPost
  const fields = getMetadataOverrides(post)
  fields.add(field)
  target.metadataOverrides = [...fields]
  return post
}

const categoriesEqual = (left?: string[], right?: string[]): boolean => {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return left === right
  }
  return left.length === right.length && left.every((value, index) => value === right[index])
}

const datesEqual = (left?: Date, right?: Date): boolean => {
  if (!(left instanceof Date) || !(right instanceof Date)) {
    return left === right
  }
  return left.getTime() === right.getTime()
}

const stringsEqual = (left?: string, right?: string): boolean => {
  return (left ?? "") === (right ?? "")
}

/**
 * 当前文章字段是否已经回到思源文档值。
 *
 * @param post - 文章
 * @param doc - 思源文档元数据快照
 * @param field - 字段
 */
const matchesDocValue = (post: Post, doc: SiyuanDocMetadata, field: DetailedMetadataField): boolean => {
  switch (field) {
    case "title":
      return stringsEqual(post.title, doc.title)
    case "excerpt":
      return stringsEqual(post.shortDesc, doc.shortDesc)
    case "tags":
      return stringsEqual(post.mt_keywords, doc.mt_keywords)
    case "categories":
      return categoriesEqual(post.categories, doc.categories)
    case "dateCreated":
      return datesEqual(post.dateCreated, doc.dateCreated)
    case "dateUpdated":
      return datesEqual(post.dateUpdated, doc.dateUpdated)
  }
}

/**
 * 按覆盖策略把思源文档元数据回填到文章上。
 *
 * 未覆盖的字段以思源文档为准；覆盖过的字段保留平台侧的值（来自平台文章/YAML）。
 *
 * @param post - 文章
 */
export const applyDocMetadataOverrides = (post: Post): Post => {
  const metadataPost = post as PublishMetadataPost
  const doc = metadataPost.siyuanMetadata
  if (!doc) {
    return post
  }

  const overrides = getMetadataOverrides(post)

  // 文档里有值才回填；文档没写的字段保留平台侧已有值，避免把平台摘要/标签清空。
  if (!overrides.has("title") && !StrUtil.isEmptyString(doc.title)) {
    post.title = doc.title
  }
  if (!overrides.has("excerpt") && !StrUtil.isEmptyString(doc.shortDesc)) {
    post.shortDesc = doc.shortDesc
  }
  if (!overrides.has("tags") && !StrUtil.isEmptyString(doc.mt_keywords)) {
    post.mt_keywords = doc.mt_keywords
  }
  if (!overrides.has("categories") && Array.isArray(doc.categories) && doc.categories.length > 0) {
    post.categories = [...doc.categories]
  }
  if (!overrides.has("dateCreated") && doc.dateCreated instanceof Date) {
    post.dateCreated = doc.dateCreated
  }
  if (!overrides.has("dateUpdated") && doc.dateUpdated instanceof Date) {
    post.dateUpdated = doc.dateUpdated
  }

  return post
}

/**
 * 发布成功后计算需要保留的覆盖字段。
 *
 * 如果某个覆盖字段已经被改回思源文档里的值，就移除覆盖，让它重新跟随文档。
 *
 * @param post - 发布完成的文章
 */
export const clearOverridesMatchingDoc = (post: Post): DetailedMetadataField[] => {
  const metadataPost = post as PublishMetadataPost
  const doc = metadataPost.siyuanMetadata
  if (!doc) {
    return [...getMetadataOverrides(post)]
  }

  const overrides = getMetadataOverrides(post)
  return [...overrides].filter((field) => !matchesDocValue(post, doc, field))
}
