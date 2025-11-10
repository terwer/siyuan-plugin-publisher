/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { RemovableRef, StorageSerializers } from "@vueuse/core"
import { MetadataItem, PlatformMetadata } from "~/src/models/platformMetadata.ts"
import useCommonLocalStorage from "~/src/stores/common/useCommonLocalStorage.ts"
import { readonly } from "vue"

/**
 * 使用平台元数据存储的自定义钩子
 *
 * @returns 包含获取平台元数据和只读平台元数据的函数
 */
const usePlatformMetadataStore = () => {
  // 存储键
  const filePath = "storage/syp/platform-metadata.json"
  const storageKey = "platform-metadata"
  const logger = createAppLogger("use-platform-metadata")

  /**
   * 获取平台元数据
   *
   * @returns 包含平台元数据的可移除引用
   */
  const getAllPlatformMetadata = (): RemovableRef<PlatformMetadata> => {
    const initialValue = new PlatformMetadata()
    const metadata = useCommonLocalStorage<PlatformMetadata>(filePath, storageKey, initialValue, {
      serializer: StorageSerializers.object,
    })
    return metadata
  }

  /**
   * 获取只读平台元数据
   *
   * @returns 只读平台元数据的引用
   */
  const getReadOnlyAllPlatformMetadata = () => {
    const metadataRef = getAllPlatformMetadata()
    const readOnlyMetadataRef = readonly(metadataRef)
    return readOnlyMetadataRef
  }

  const getPlatformMetadata = (platformKey: string) => {
    const tags = []
    const categories = []
    const templates = []

    const metadataRef = getReadOnlyAllPlatformMetadata()
    const metadata = metadataRef.value
    if (metadata.metadata) {
      // eslint-disable-next-line no-prototype-builtins
      if (metadata.metadata.hasOwnProperty(platformKey)) {
        const datas = metadata.metadata[platformKey]
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
  const updatePlatformMetadata = (platformKey: string, tags: string[], categories: string[], templates: string[]) => {
    if (tags.length === 0 && categories.length === 0 && templates.length === 0) {
      // 如果所有数组都是空数组，不需要进行任何操作
      return
    }

    const metadataRef = getAllPlatformMetadata()
    const metadata = metadataRef.value
    metadata.metadata = metadata.metadata ?? {}
    // eslint-disable-next-line no-prototype-builtins
    if (!metadata.metadata.hasOwnProperty(platformKey)) {
      metadata.metadata[platformKey] = new MetadataItem()
    }

    const datas = metadata.metadata[platformKey]
    // 去除 datas 中的空字符串并进行 trim 操作
    datas.tags = datas.tags.filter((tag) => tag.trim() !== "")
    datas.categories = datas.categories.filter((category) => category.trim() !== "")
    datas.templates = datas.templates.filter((template) => template.trim() !== "")
    // 合并新的标签数组并去重
    if (tags.length > 0) {
      datas.tags = Array.from(new Set([...datas.tags, ...tags.filter((tag) => tag.trim() !== "")]))
    }
    // 合并新的分类数组并去重
    if (categories.length > 0) {
      datas.categories = Array.from(
        new Set([...datas.categories, ...categories.filter((category) => category.trim() !== "")])
      )
    }
    // 合并新的模板数组并去重
    if (templates.length > 0) {
      datas.templates = Array.from(
        new Set([...datas.templates, ...templates.filter((template) => template.trim() !== "")])
      )
    }
    metadata.metadata[platformKey] = datas

    // 更新元数据
    metadataRef.value = metadata
  }

  return { getPlatformMetadata, updatePlatformMetadata }
}

export { usePlatformMetadataStore }
