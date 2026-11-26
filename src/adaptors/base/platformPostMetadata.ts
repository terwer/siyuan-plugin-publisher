/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { Post } from "zhi-blog-api"
import { normalizeTagValue } from "~/src/utils/tagValue.ts"

/**
 * 平台文章元数据归一化。
 *
 * 不同平台的 YAML 适配器把摘要写在不同字段：
 * - Vuepress/Hugo/Hexo 等写 `shortDesc`；
 * - Astro/Docsify 只写 `mt_excerpt`。
 *
 * 发布表单绑定的是 `shortDesc`，因此读取平台文章或已保存 YAML 后必须把
 * 两个字段补齐，否则「再次打开」时摘要为空。标签字段同理，统一成
 * 逗号分隔字符串，兼容历史 YAML 里的数组/字符串/单数 tag。
 *
 * 该函数只补空值，不覆盖已有值，避免平台数据与思源本地回退互相污染。
 */
export const normalizePlatformPostMetadata = (post: Post): Post => {
  if (!post) {
    return post
  }

  const summary = firstNonEmptyString(post.shortDesc, post.mt_excerpt)
  if (summary !== "") {
    if (isEmptyString(post.shortDesc)) {
      post.shortDesc = summary
    }
    if (isEmptyString(post.mt_excerpt)) {
      post.mt_excerpt = summary
    }
    if (isEmptyString(post.mt_text_more)) {
      post.mt_text_more = summary
    }
  }

  // 平台返回的标签可能来自 YAML 数组或旧数据字符串，统一成内部契约
  post.mt_keywords = normalizeTagValue(post.mt_keywords).join(",")

  return post
}

const isEmptyString = (value: unknown): boolean => typeof value !== "string" || value.trim() === ""

const firstNonEmptyString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim()
    }
  }
  return ""
}
