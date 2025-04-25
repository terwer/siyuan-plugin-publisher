/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { watch, readonly, type DeepReadonly, reactive } from "vue"
import { StorageAdaptor } from "@stores/core/StorageAdaptor.ts"

export interface StorageOptions {
  debounce: number
  deepWatch: boolean
}

/**
 * 通用异步存储
 *
 * @param key 存储标识
 * @param initial 初始值
 * @param adaptor 适配器
 * @param options 选项
 *
 * @author terwer
 * @since 2.0.0
 */
export const useStorageAsync = <T extends object>(
  key: string,
  initial: T,
  adaptor: StorageAdaptor<T>,
  options: StorageOptions = {
    debounce: 300,
    deepWatch: true,
  },
) => {
  const internalState = reactive<T>({ ...initial })
  let isSyncing = false

  // 加载存储数据
  adaptor.load().then((loaded) => {
    if (loaded) {
      isSyncing = true
      Object.assign(internalState, loaded)
      isSyncing = false
    }
  })

  // 持久化逻辑
  const { pushUpdate, flush } = doPersist(adaptor, options.debounce)

  // 状态监听
  watch(
    () => internalState,
    (newVal) => {
      if (!isSyncing) pushUpdate(key, newVal)
    },
    { deep: options.deepWatch },
  )

  // 受控更新方法
  const update = (newValue: Partial<T>) => {
    isSyncing = true
    Object.assign(internalState, newValue)
    isSyncing = false
  }

  return {
    state: readonly(internalState) as DeepReadonly<T>,
    update,
    flush: () => flush(key),
  }
}

const doPersist = <T>(persister: StorageAdaptor<T>, delayMs: number) => {
  const activeTimers = new Map<string, any>()
  const writeQueue = new Map<string, T>()

  const persistData = async (key: string) => {
    if (writeQueue.has(key)) {
      await persister.save(writeQueue.get(key)!)
      writeQueue.delete(key)
    }
  }

  const queuePersistTask = (key: string, data: T) => {
    writeQueue.set(key, data)
    clearTimeout(activeTimers.get(key))
    activeTimers.set(
      key,
      setTimeout(() => persistData(key), delayMs),
    )
  }

  const triggerImmediatePersist = async (key: string) => {
    clearTimeout(activeTimers.get(key)!)
    await persistData(key)
  }

  return {
    pushUpdate: queuePersistTask,
    flush: triggerImmediatePersist,
  }
}
