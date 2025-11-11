/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */
import type { StorageLike, UseStorageOptions, RemovableRef } from "@vueuse/core"
import { defaultWindow, useStorage } from "@vueuse/core"
import JsonStorage from "~/src/stores/common/jsonStorage.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { MaybeRefOrGetter } from "vue"

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
