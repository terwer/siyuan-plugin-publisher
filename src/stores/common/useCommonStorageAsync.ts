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

import CommonStorageAsync from "~/src/stores/common/commonStorageAsync.ts"
import { StorageSerializers, toValue } from "@vueuse/core"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ObjectUtil } from "zhi-common"

/**
 * https://vueuse.org/core/useStorageAsync/
 *
 * @param storageKey - 存储key
 * @param initialValue - 默认值
 */
export const useCommonStorageAsync = <T extends string | number | boolean | object | null>(
  storageKey: string,
  initialValue: T
) => {
  const logger = createAppLogger("common-storage-async")
  const commonStorage = new CommonStorageAsync(storageKey)

  // 获取 initialValue 类型对应的序列化器，如果不存在则使用默认序列化器
  const rawInit: T = toValue(initialValue)
  const type = guessSerializerType<T>(rawInit) as
    | "boolean"
    | "object"
    | "number"
    | "any"
    | "string"
    | "map"
    | "set"
    | "date"
  logger.debug(`It is detected that the serialization type is ${type}`)
  const serializer = StorageSerializers[type]

  // 定义 commonStore 对象
  const commonStore = {
    async get(): Promise<T> {
      logger.debug("Fetching data from common storage...")
      const rawValue = (await commonStorage.getItem(commonStorage.key)) ?? "{}"
      let ret = (await serializer.read(rawValue)) ?? {}

      if (ObjectUtil.isEmptyObject(ret)) {
        logger.info("Initial data not found in common storage. Setting initial value...")
        await commonStorage.setItem(commonStorage.key, serializer.write(initialValue))
        logger.debug("Initial value set:", initialValue)
        ret = initialValue
      }
      return ret
    },
    async set(value: T): Promise<void> {
      await commonStorage.setItem(commonStorage.key, serializer.write(value))
    },
  }

  return { commonStore }
}

function guessSerializerType<T extends string | number | boolean | object | null>(rawInit: T) {
  return rawInit == null
    ? "any"
    : rawInit instanceof Set
    ? "set"
    : rawInit instanceof Map
    ? "map"
    : rawInit instanceof Date
    ? "date"
    : typeof rawInit === "boolean"
    ? "boolean"
    : typeof rawInit === "string"
    ? "string"
    : typeof rawInit === "object"
    ? "object"
    : !Number.isNaN(rawInit)
    ? "number"
    : "any"
}
