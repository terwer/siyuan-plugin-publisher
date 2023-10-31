/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
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
