/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import { base64ToBuffer } from "~/src/utils/polyfillUtils.ts"

/**
 * 读取特色图片文件所需的宿主能力。
 */
export interface FeaturedImageFileReader {
  /**
   * 读取图片并返回 base64 信息。
   */
  readFileToBase64(url: string): Promise<any>
}

/**
 * 把思源资源相对路径补成完整地址，外部链接保持原样。
 *
 * @param url - 特色图片地址
 * @param baseUrl - 思源内核地址（浏览器扩展等非思源宿主场景必须传，否则相对资源会解析到页面源）
 */
export const resolveFeaturedImageUrl = (url: string, baseUrl?: string): string => {
  const trimmed = (url ?? "").trim()
  if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) {
    return trimmed
  }
  const origin = (baseUrl ?? "").trim().replace(/\/+$/, "") || window.location.origin
  return StrUtil.pathJoin(origin, trimmed.replace(/^\.?\//, ""))
}

/**
 * 生成平台媒体库里的文件名：去掉查询串与锚点，缺省名按图片类型补扩展名。
 *
 * @param name - 原始文件名
 * @param mimeType - 图片类型
 */
export const toFeaturedImageMediaName = (name: string, mimeType?: string): string => {
  const rawName = (name ?? "").split("?")[0].split("#")[0].trim()
  let fileName = rawName
  try {
    fileName = decodeURIComponent(rawName)
  } catch {
    // 文件名不是合法的 URI 编码时保持原样
  }

  if (StrUtil.isEmptyString(fileName) || fileName === "unknown-image") {
    const extension = mimeType?.split("/")?.[1] ?? "png"
    fileName = `featured-image-${Date.now()}.${extension.replace(/[^a-z\d]/gi, "") || "png"}`
  }

  return fileName
}

/**
 * 把特色图片读取为可上传的媒体信息。
 *
 * @param reader - base64 文件读取器
 * @param url - 特色图片地址
 * @param baseUrl - 思源内核地址（可选）
 */
export const readFeaturedImageMedia = async (
  reader: FeaturedImageFileReader,
  url: string,
  baseUrl?: string
): Promise<{ name: string; mimeType: string; bits: Buffer }> => {
  const absoluteUrl = resolveFeaturedImageUrl(url, baseUrl)
  const base64Info = await reader.readFileToBase64(absoluteUrl)
  return {
    name: toFeaturedImageMediaName(base64Info.imageName, base64Info.mimeType),
    mimeType: base64Info.mimeType,
    bits: base64ToBuffer(base64Info.imageBase64),
  }
}
