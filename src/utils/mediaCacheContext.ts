/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 思源文档级媒体缓存上下文。
 *
 * 由发布预处理层（`BaseExtendApi`）在文章和媒体对象上挂载，供平台适配器
 * 读取文档属性、按文档 + 平台复用已上传的附件；该对象只在内存中传递，
 * 不写入平台 YAML、不进入正文、不会随发布内容外泄。
 */
export interface MediaCacheContext {
  /**
   * 思源内核 API，用于读写文档属性。
   */
  kernelApi: {
    getBlockAttrs: (blockId: string) => Promise<any>
    setSingleBlockAttr: (blockId: string, key: string, value: string) => Promise<any>
  }
  /**
   * 思源文档 ID。
   */
  docId: string
  /**
   * 当前发布的平台 key（用于隔离不同平台/实例的缓存）。
   */
  platformKey: string
  /**
   * 平台地址（用于隔离不同 Halo 实例的缓存）。
   */
  endpoint: string
}

const MEDIA_CACHE_CONTEXT_KEY = "__sypMediaCacheContext"

/**
 * 把媒体缓存上下文挂到文章或媒体对象上。
 *
 * @param target - 文章或媒体对象
 * @param context - 上下文
 */
export const setMediaCacheContext = <T extends object>(target: T, context: MediaCacheContext): T => {
  ;(target as any)[MEDIA_CACHE_CONTEXT_KEY] = context
  return target
}

/**
 * 读取文章或媒体对象上的媒体缓存上下文。
 *
 * @param target - 文章或媒体对象
 */
export const getMediaCacheContext = (target?: object | null): MediaCacheContext | undefined => {
  if (!target) {
    return undefined
  }
  const context = (target as any)[MEDIA_CACHE_CONTEXT_KEY] as MediaCacheContext | undefined
  if (!context?.kernelApi || !context.docId) {
    return undefined
  }
  return context
}

/**
 * 规范化平台地址，作为缓存隔离键。
 *
 * @param endpoint - 平台地址
 */
export const normalizeMediaCacheEndpoint = (endpoint?: string): string => {
  return (endpoint ?? "").trim().replace(/\/+$/, "").toLowerCase()
}
