/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import type { BlogConfig } from "zhi-blog-api"

/**
 * 平台是否声明支持原生封面字段。
 *
 * 支持时发布层按「思源题头图 → 正文首图 → 自定义」解析封面；
 * 不支持的平台保持原有正文行为。
 *
 * @param cfg - 平台配置
 */
export const isCoverEnabled = (cfg?: BlogConfig): boolean => {
  return (cfg as { coverEnabled?: boolean } | undefined)?.coverEnabled === true
}

/**
 * 把封面候选地址补成可用于平台封面字段的链接。
 *
 * 已经是完整 URL/data URI 时原样返回；相对资源按思源内核地址补全。
 *
 * @param kernelApi - 思源内核 API（提供 resolveDocTitleImageUrl）
 * @param link - 封面候选地址
 */
export const resolveCoverLink = (
  kernelApi: { resolveDocTitleImageUrl?: (path?: string) => string } | undefined,
  link?: string
): string => {
  const trimmed = (link ?? "").trim()
  if (StrUtil.isEmptyString(trimmed)) {
    return ""
  }
  if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) {
    return trimmed
  }
  return kernelApi?.resolveDocTitleImageUrl?.(trimmed) ?? trimmed
}

const normalizeImagePath = (value: string): string => {
  let normalized = (value ?? "").trim()
  try {
    normalized = decodeURIComponent(normalized)
  } catch {
    // 非法的 URI 编码按原值比较
  }
  return normalized.replace(/^\.?\//, "")
}

const parseMarkdownImageLine = (line: string): string => {
  const match = line
    .trim()
    .match(/^!\[[^\]]*]\(\s*(?:<([^>]+)>|([^)]*?))\s*(?:"[^"]*"|'[^']*')?\s*\)$/)
  return (match?.[1] ?? match?.[2] ?? "").trim()
}

/**
 * 找出 Markdown 开头（可跳过 YAML front matter 与空行）是否为指定题头图。
 *
 * @param markdown - Markdown 内容
 * @param titleImage - 题头图地址
 */
export const startsWithDocTitleImage = (markdown: string, titleImage: string): boolean => {
  if (StrUtil.isEmptyString(markdown) || StrUtil.isEmptyString(titleImage)) {
    return false
  }

  const lines = markdown.split(/\r?\n/)
  let start = 0
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---")
    if (end > 0) {
      start = end + 1
    }
  }

  let index = start
  while (index < lines.length && lines[index].trim() === "") {
    index++
  }
  if (index >= lines.length) {
    return false
  }

  const imagePath = parseMarkdownImageLine(lines[index])
  return !StrUtil.isEmptyString(imagePath) && normalizeImagePath(imagePath) === normalizeImagePath(titleImage)
}

/**
 * 从 Markdown 开头剔除思源导出时自动前置的题头图。
 *
 * 只删除与题头图地址一致的第一张图片及其后的空行；不匹配时原样返回。
 *
 * @param markdown - Markdown 内容
 * @param titleImage - 题头图地址
 */
export const stripLeadingDocTitleImage = (markdown: string, titleImage: string): string => {
  if (!startsWithDocTitleImage(markdown, titleImage)) {
    return markdown
  }

  const lines = markdown.split(/\r?\n/)
  let start = 0
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---")
    if (end > 0) {
      start = end + 1
    }
  }

  let index = start
  while (index < lines.length && lines[index].trim() === "") {
    index++
  }

  lines.splice(index, 1)
  while (index < lines.length && lines[index].trim() === "") {
    lines.splice(index, 1)
  }

  return lines.join("\n")
}
