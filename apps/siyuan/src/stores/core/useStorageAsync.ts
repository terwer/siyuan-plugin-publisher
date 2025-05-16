/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger"
import { cloneDeep, merge } from "lodash-es"
import { computed, reactive, readonly, watch, type DeepReadonly } from "vue"
import { AsyncStorageAdaptor } from "@stores/adaptor/StorageAdaptor.ts"
// import { isDev } from "@/Constants.ts"

export interface StorageOptions {
  debounce: number
  deepWatch: boolean
  deepMerge: boolean
}

const logger = createAppLogger("use-storage-async")

/**
 * 通用异步存储
 *
 * @param storageKey 存储标识
 * @param initialState 初始值
 * @param adaptor 适配器
 * @param options 选项
 *
 * @author terwer
 * @since 2.0.0
 */
export const useStorageAsync = <T extends object>(
  storageKey: string,
  initialState: T,
  adaptor: AsyncStorageAdaptor<T>,
  options: StorageOptions = {
    debounce: 300,
    deepWatch: true,
    deepMerge: true,
  } as any,
) => {
  // 合并默认选项
  const mergedOptions: Required<StorageOptions> = {
    ...options,
  }

  // 内部字段
  const __loadedField = "__pt_loaded_" + new Date().getTime()
  const internalFields = [__loadedField]

  // 反应式状态
  const _state = reactive<T>({
    ...initialState,
    [__loadedField]: false,
  } as T)

  // 控制状态
  let isSyncing = false
  let isInitialized = false

  // 状态差异记录器
  // const stateDiff = (prev: T, current: T) => {
  //   const changes: Partial<T> = {}
  //   ;(Object.keys(current) as Array<keyof T>).forEach((key) => {
  //     if (!Object.is(prev[key], current[key])) {
  //       changes[key] = current[key]
  //     }
  //   })
  //   return changes
  // }

  // 核心更新方法
  const atomicUpdate = (
    partialState: Partial<T>,
    context: string = "anonymous",
  ) => {
    if (!isInitialized) {
      logger.warn(
        `[${storageKey}] Operation blocked: Not initialized | Context: ${context}`,
      )
      return
    }

    if (isSyncing) {
      logger.debug(
        `[${storageKey}] Concurrent modification detected | Context: ${context}`,
      )
      return
    }

    isSyncing = true
    try {
      // 提升生产环境性能
      // let snapshot = null as unknown as T
      // if (isDev) {
      //   snapshot = cloneDeep(_state)
      //   logger.debug(`[${storageKey}] Atomic update start`, {
      //     context,
      //     snapshot,
      //   })
      // }

      // 统一合并策略
      if (mergedOptions.deepMerge) {
        merge(_state, partialState)
      } else {
        Object.assign(_state, partialState)
      }

      // 提升生产环境性能
      // if (isDev) {
      //   if (!snapshot) {
      //     return
      //   }
      //   const changes = stateDiff(snapshot, _state)
      //   if (Object.keys(changes).length > 0) {
      //     logger.debug(`[${storageKey}] State changed`, {
      //       context,
      //       changes,
      //       newState: cloneDeep(_state),
      //     })
      //   } else {
      //     logger.debug(`[${storageKey}] No state changes detected`)
      //   }
      // }
    } catch (error) {
      logger.error(`[${storageKey}] Atomic update failed`, {
        error,
        context,
        currentState: cloneDeep(_state),
      })
      throw error
    } finally {
      isSyncing = false
    }
  }

  // 持久化控制器
  const persistenceEngine = (() => {
    const pendingUpdates = new Map<string, any>()
    const updateQueue = new Map<string, T>()

    const persistState = async (key: string) => {
      try {
        const currentState = updateQueue.get(key)
        if (currentState) {
          const stateToSave = cloneDeep(currentState)
          // 移除所有内部字段
          internalFields.forEach((field) => {
            delete (stateToSave as any)[field]
          })
          await adaptor.save(stateToSave)
          updateQueue.delete(key)
          logger.debug(`[${key}] Persistence successful`)
        }
      } catch (error) {
        logger.error(`[${key}] Persistence failed`, error)
        updateQueue.delete(key)
      }
    }

    return {
      scheduleUpdate: (key: string, data: T) => {
        updateQueue.set(key, data)
        clearTimeout(pendingUpdates.get(key))
        pendingUpdates.set(
          key,
          setTimeout(() => persistState(key), mergedOptions.debounce),
        )
      },
      flush: async (key: string) => {
        clearTimeout(pendingUpdates.get(key)!)
        await persistState(key)
      },
      cleanup: () => {
        pendingUpdates.forEach((timer) => clearTimeout(timer))
        pendingUpdates.clear()
        updateQueue.clear()
      },
    }
  })()

  // 初始化流程
  const initializeStorage = async () => {
    try {
      logger.debug(`[${storageKey}] Initializing...`)

      const loadedData = await adaptor.load()
      if (loadedData) {
        const loadedDataWithState = {
          ...loadedData,
          [__loadedField]: true,
        }
        if (mergedOptions.deepMerge) {
          merge(_state, loadedDataWithState)
        } else {
          Object.assign(_state, loadedDataWithState)
        }
      } else {
        logger.error(`[${storageKey}] Initialization failed`)
      }
    } catch (e) {
      isInitialized = false
      logger.error(`[${storageKey}] Initialization failed`, e)
      throw e
    }
  }

  // 自动持久化监听
  watch(
    () => _state,
    (newState: any) => {
      if (!isInitialized && newState[__loadedField]) {
        isInitialized = true
        logger.info(`[${storageKey}] Initialization completed`, newState)
        return
      }
      if (isInitialized && !isSyncing) {
        persistenceEngine.scheduleUpdate(storageKey, newState)
      }
    },
    { deep: mergedOptions.deepWatch },
  )

  // ===================================================================================================================
  // 延迟初始化，防止阻塞渲染
  // ===================================================================================================================
  void initializeStorage()

  return {
    // 只读快照
    state: readonly(_state) as DeepReadonly<T>,
    // 表单双向绑定支持
    formState: computed({
      get: () => _state,
      set: (value: T) => atomicUpdate(value, "formBinding"),
    }),

    // 状态操作
    update: (changes: Partial<T>) => atomicUpdate(changes, "directUpdate"),
    flush: () => persistenceEngine.flush(storageKey),
    cleanup: persistenceEngine.cleanup,
  }
}
