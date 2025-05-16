/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SyncStorageAdaptor } from "@stores/adaptor/StorageAdaptor"
import { createAppLogger, ILogger } from "@utils/appLogger"
import { reactive, readonly, toRefs, watch } from "vue"

/**
 * 同步存储 Hook
 *
 * @author terwer
 * @since 2.0.0
 */
export function useStorageSync<T extends object>(
  storeName: string,
  initialState: T,
  adaptor: SyncStorageAdaptor<T>,
  options: {
    deepWatch?: boolean
    deepMerge?: boolean
  } = {},
) {
  const logger: ILogger = createAppLogger(`use-storage-sync-${storeName}`)
  const { deepWatch = true } = options

  // 创建响应式状态
  const state = reactive<T>({ ...initialState })
  const readonlyState = readonly(state)

  // 加载数据
  const load = () => {
    try {
      const data = adaptor.load()
      if (data) {
        Object.assign(state, data)
      }
    } catch (error) {
      logger.error("Failed to load data:", error)
    }
  }

  // 保存数据
  const save = () => {
    try {
      adaptor.save(state as T)
    } catch (error) {
      logger.error("Failed to save data:", error)
    }
  }

  // 更新数据
  const update = (newState: Partial<T>) => {
    Object.assign(state, newState)
    save()
  }

  // 监听状态变化
  watch(
    () => state,
    () => {
      save()
    },
    {
      deep: deepWatch,
    },
  )

  // 初始化加载
  load()

  return {
    state,
    readonlyState,
    update,
    formState: toRefs(state),
  }
}
