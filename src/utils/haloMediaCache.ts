/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { Attachment, MediaObject } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import {
  getMediaCacheContext,
  normalizeMediaCacheEndpoint,
  type MediaCacheContext,
} from "~/src/utils/mediaCacheContext.ts"

const CACHE_VERSION = 1
const MAX_CACHE_ITEMS = 200

/**
 * 单张图片的 Halo 附件缓存。
 */
interface HaloMediaCacheItem {
  name: string
  url: string
  attachmentId: string
  updatedAt: number
}

/**
 * Halo 文档级媒体缓存：按内容哈希复用已上传的附件。
 */
interface HaloMediaCacheData {
  version: number
  endpoint: string
  items: Record<string, HaloMediaCacheItem>
}

const fnv1a = (value: string | Uint8Array): string => {
  let hash = 0x811c9dc5
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i]
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, "0")
}

const toHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * 计算媒体内容的 SHA-256（不可用时退化为 FNV-1a）。
 *
 * 缓存只用于判断「同一份图片内容是否已经上传过」，哈希变化即重新上传。
 *
 * @param bits - 图片字节
 */
export const hashMediaBits = async (bits: Uint8Array | Buffer): Promise<string> => {
  const bytes = bits instanceof Uint8Array ? bits : new Uint8Array(bits)
  const subtle = globalThis.crypto?.subtle
  if (subtle) {
    try {
      return toHex(await subtle.digest("SHA-256", bytes as unknown as BufferSource))
    } catch {
      // 非安全上下文或不支持 WebCrypto 时走降级哈希
    }
  }
  return fnv1a(bytes)
}

const sanitizeAttrSegment = (value: string): string => {
  return value
    .trim()
    .replace(/_/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

/**
 * 生成 Halo 文档级缓存属性 key。
 *
 * @param platformKey - 平台 key
 * @param endpoint - 平台地址
 * @param suffix - 属性用途
 */
export const getHaloCacheAttrKey = (platformKey: string, endpoint: string, suffix: string): string => {
  const segment = sanitizeAttrSegment(platformKey) || `endpoint-${fnv1a(normalizeMediaCacheEndpoint(endpoint))}`
  return `custom-halo-${segment}-${suffix}`.toLowerCase()
}

const createEmptyCache = (context: MediaCacheContext): HaloMediaCacheData => {
  return {
    version: CACHE_VERSION,
    endpoint: normalizeMediaCacheEndpoint(context.endpoint),
    items: {},
  }
}

const readDocAttr = async (context: MediaCacheContext, key: string): Promise<string> => {
  try {
    const attrs = await context.kernelApi.getBlockAttrs(context.docId)
    const value = attrs?.[key]
    return typeof value === "string" ? value : ""
  } catch {
    // 文档属性读取失败只影响缓存命中，不阻断发布
    return ""
  }
}

const writeDocAttr = async (context: MediaCacheContext, key: string, value: string): Promise<void> => {
  try {
    await context.kernelApi.setSingleBlockAttr(context.docId, key, value)
  } catch {
    // 缓存写入失败不影响已经完成的发布
  }
}

/**
 * 读取当前文档 + 平台的媒体缓存。
 *
 * @param context - 媒体缓存上下文
 */
export const readHaloMediaCache = async (context: MediaCacheContext): Promise<HaloMediaCacheData> => {
  const key = getHaloCacheAttrKey(context.platformKey, context.endpoint, "media-cache")
  const raw = await readDocAttr(context, key)
  if (StrUtil.isEmptyString(raw)) {
    return createEmptyCache(context)
  }

  try {
    const parsed = JSON.parse(raw) as HaloMediaCacheData
    if (parsed?.version !== CACHE_VERSION) {
      return createEmptyCache(context)
    }
    if (normalizeMediaCacheEndpoint(parsed.endpoint) !== normalizeMediaCacheEndpoint(context.endpoint)) {
      return createEmptyCache(context)
    }
    if (!parsed.items || typeof parsed.items !== "object") {
      return createEmptyCache(context)
    }
    return parsed
  } catch {
    return createEmptyCache(context)
  }
}

/**
 * 写回当前文档 + 平台的媒体缓存，并按最近使用时间裁剪。
 *
 * @param context - 媒体缓存上下文
 * @param data - 缓存数据
 */
export const writeHaloMediaCache = async (context: MediaCacheContext, data: HaloMediaCacheData): Promise<void> => {
  const entries = Object.entries(data.items)
  if (entries.length > MAX_CACHE_ITEMS) {
    entries
      .sort(([, left], [, right]) => right.updatedAt - left.updatedAt)
      .slice(MAX_CACHE_ITEMS)
      .forEach(([hash]) => delete data.items[hash])
  }

  data.version = CACHE_VERSION
  data.endpoint = normalizeMediaCacheEndpoint(context.endpoint)
  const key = getHaloCacheAttrKey(context.platformKey, context.endpoint, "media-cache")
  await writeDocAttr(context, key, JSON.stringify(data))
}

const attachmentFromCache = (mediaObject: MediaObject, item: HaloMediaCacheItem): Attachment => {
  return {
    attachment_id: item.attachmentId || item.name,
    date_created_gmt: new Date(),
    parent: 0,
    link: item.url,
    title: mediaObject.name,
    caption: "",
    description: "",
    metadata: {
      width: 0,
      height: 0,
      file: "",
      filesize: 0,
      sizes: [],
    },
    type: mediaObject.type,
    thumbnail: "",
    id: item.attachmentId,
    file: mediaObject.name,
    url: item.url,
  }
}

/**
 * Halo 媒体上传选项。
 */
export interface HaloMediaUploadOptions {
  /**
   * 实际执行上传。
   */
  upload: () => Promise<Attachment>
  /**
   * 校验缓存里的附件是否仍然存在（可选）。
   */
  isAttachmentAlive?: (attachmentId: string) => Promise<boolean>
}

/**
 * 带内容哈希缓存的 Halo 媒体上传。
 *
 * 同一文档同一平台的同一份图片内容只上传一次：命中缓存且附件仍存在时直接复用，
 * 图片内容变化时重新上传并更新缓存。
 *
 * @param mediaObject - 媒体对象（需由发布预处理层挂载缓存上下文）
 * @param options - 上传与校验回调
 */
export const uploadHaloMediaWithCache = async (
  mediaObject: MediaObject,
  options: HaloMediaUploadOptions
): Promise<Attachment> => {
  const context = getMediaCacheContext(mediaObject)
  if (!context) {
    return await options.upload()
  }

  const hash = await hashMediaBits(mediaObject.bits)
  const cache = await readHaloMediaCache(context)
  const cached = cache.items[hash]
  if (cached?.url) {
    let alive = true
    if (cached.attachmentId && options.isAttachmentAlive) {
      try {
        alive = await options.isAttachmentAlive(cached.attachmentId)
      } catch {
        alive = false
      }
    }
    if (alive) {
      cached.updatedAt = Date.now()
      await writeHaloMediaCache(context, cache)
      return attachmentFromCache(mediaObject, cached)
    }
  }

  const attachment = await options.upload()
  if (!StrUtil.isEmptyString(attachment?.url)) {
    cache.items[hash] = {
      name: mediaObject.name,
      url: attachment.url,
      attachmentId: StrUtil.isEmptyString(attachment.id) ? "" : attachment.id,
      updatedAt: Date.now(),
    }
    await writeHaloMediaCache(context, cache)
  }
  return attachment
}
