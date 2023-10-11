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
import type { StorageLike, UseStorageOptions, MaybeRefOrGetter, RemovableRef } from "@vueuse/core"
import { defaultWindow, useStorage } from "@vueuse/core"
import JsonStorage from "~/src/stores/common/jsonStorage.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"

const logger = createAppLogger("use-common-local-storage")

/**
 * 通用响应式的 LocalStorage
 *
 * @see https://vueuse.org/useLocalStorage
 * @param filePath json文件存储位置，可选，浏览器环境忽略此参数
 * @param key key
 * @param initialValue 初始值
 * @param options 选项
 */
const useCommonLocalStorage = <T extends string | number | boolean | object | null>(
  filePath: string,
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {}
): RemovableRef<any> => {
  const localStorageAdaptor: StorageLike = getLocalStorageAdaptor(filePath, options)
  return useStorage(key, initialValue, localStorageAdaptor, options)
}

/**
 * Electron环境使用json保存数据，否则使用浏览器存储
 *
 * @author terwer
 * @since 0.6.8
 */
const getLocalStorageAdaptor = <T>(filePath: string, options: UseStorageOptions<T> = {}): StorageLike => {
  let localStorageAdaptor: StorageLike
  const { isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()
  if (isInSiyuanOrSiyuanNewWin()) {
    localStorageAdaptor = new JsonStorage(filePath)
    logger.info("using JsonStorage for localStorage")
  } else {
    const { window = defaultWindow } = options
    localStorageAdaptor = window?.localStorage
    logger.info("using window.localStorage for localStorage")
  }
  return localStorageAdaptor
}

export default useCommonLocalStorage
