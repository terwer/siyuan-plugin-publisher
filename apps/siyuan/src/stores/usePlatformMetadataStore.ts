/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { MetadataItem, PlatformMetadata } from "@/models/platformMetadata.ts"
import { useStorageAsync } from "@stores/core/useStorageAsync.ts"
import { AsyncSiyuanStorageAdaptor } from "@stores/impl/AsyncSiyuanStorageAdaptor.ts"

/**
 * 平台元数据存储
 *
 * @author terwer
 * @version 2.0.0
 * @since 2.0.0
 */
export const usePlatformMetadataStore = () => {
  const logger = createAppLogger("use-platform-metadata-store")
  const storageKey = "platform-metadata"
  const adaptorKey = "platform-metadata"
  const filePath = "/data/storage/syp/platform-metadata.json"
  const initValue = new PlatformMetadata()

  // 创建适配器实例
  const adaptor = new AsyncSiyuanStorageAdaptor<PlatformMetadata>(
    adaptorKey,
    filePath,
  )
  const { state: allPlatformMetadata, formState: metadataRef } =
    useStorageAsync<PlatformMetadata>(storageKey, initValue, adaptor)

  /**
   * 获取某个平台元数据
   *
   * @param platformKey 平台标识
   */
  const getPlatformMetadata = (platformKey: string) => {
    const tags = []
    const categories = []
    const templates = []

    // 获取只读平台元数据
    if (allPlatformMetadata.metadata) {
      if (allPlatformMetadata.metadata.hasOwnProperty(platformKey)) {
        const datas = allPlatformMetadata.metadata[platformKey]
        tags.push(...datas.tags)
        categories.push(...datas.categories)
        templates.push(...datas.templates)
      }
    }

    return {
      tags: tags,
      categories: categories,
      templates: templates,
    }
  }

  /**
   * 更新平台元数据
   *
   * @param platformKey 平台 key
   * @param tags 新的标签数组
   * @param categories 新的分类数组
   * @param templates 新的模板数组
   */
  const updatePlatformMetadata = (
    platformKey: string,
    tags: string[],
    categories: string[],
    templates: string[],
  ) => {
    if (
      tags.length === 0 &&
      categories.length === 0 &&
      templates.length === 0
    ) {
      // 如果所有数组都是空数组，不需要进行任何操作
      return
    }

    const metadata = metadataRef.value
    metadata.metadata = metadata.metadata ?? {}
    if (!metadata.metadata.hasOwnProperty(platformKey)) {
      metadata.metadata[platformKey] = new MetadataItem()
    }

    const datas = metadata.metadata[platformKey]
    // 去除 datas 中的空字符串并进行 trim 操作
    datas.tags = datas.tags.filter((tag) => tag.trim() !== "")
    datas.categories = datas.categories.filter(
      (category) => category.trim() !== "",
    )
    datas.templates = datas.templates.filter(
      (template) => template.trim() !== "",
    )
    // 合并新的标签数组并去重
    if (tags.length > 0) {
      datas.tags = Array.from(
        new Set([...datas.tags, ...tags.filter((tag) => tag.trim() !== "")]),
      )
    }
    // 合并新的分类数组并去重
    if (categories.length > 0) {
      datas.categories = Array.from(
        new Set([
          ...datas.categories,
          ...categories.filter((category) => category.trim() !== ""),
        ]),
      )
    }
    // 合并新的模板数组并去重
    if (templates.length > 0) {
      datas.templates = Array.from(
        new Set([
          ...datas.templates,
          ...templates.filter((template) => template.trim() !== ""),
        ]),
      )
    }
    metadata.metadata[platformKey] = datas

    // 更新元数据
    metadataRef.value = metadata
  }

  logger.debug(
    "Loaded default platform-metadata, may not the latest",
    allPlatformMetadata,
  )

  return { getPlatformMetadata, updatePlatformMetadata }
}
