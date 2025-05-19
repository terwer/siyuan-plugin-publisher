/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger"
import { cloneDeep, debounce, merge } from "lodash-es"
import { computed, reactive, readonly, ref, watch } from "vue"
import { AsyncStorageAdaptor } from "@stores/adaptor/StorageAdaptor.ts"

const logger = createAppLogger("use-manual-storage-async")

// 定义深层只读类型工具
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

export interface ManualStorageOptions {
  debounce: number
  deepWatch: boolean
  deepMerge: boolean
}

/**
 * 手动保存存储的完整抽象
 *
 * @param storageKey 存储标识
 * @param initialState 初始状态
 * @param adaptor 存储适配器
 * @param options 选项
 */
export const useManualStorageAsync = <T extends object>(
  storageKey: string,
  initialState: T,
  adaptor: AsyncStorageAdaptor<T>,
  options: ManualStorageOptions = {
    debounce: 300,
    deepWatch: true,
    deepMerge: true,
  },
) => {
  // 合并默认选项
  const mergedOptions: Required<ManualStorageOptions> = {
    ...options,
  }

  // 内部字段
  const __loadedField = "__pt_loaded_" + new Date().getTime()
  const __timestampField = "__pt_timestamp_" + new Date().getTime()
  const internalFields = [__loadedField, __timestampField]

  // 初始化完成回调队列
  const onInitializedCallbacks = ref<Array<() => void>>([])
  const isInitializing = ref(false)
  const isManualUpdating = ref(false)

  // 状态
  const state = reactive<T>({
    ...initialState,
    [__loadedField]: false,
  } as T)

  // 只读状态
  const readonlyState = computed(() => {
    return readonly(state) as DeepReadonly<typeof state>
  })

  // 注册初始化回调
  const registerOnInit = (callback: () => void) => {
    onInitializedCallbacks.value.push(callback)
    return () => {
      onInitializedCallbacks.value = onInitializedCallbacks.value.filter((cb) => cb !== callback)
    }
  }

  // 保存方法
  const save = async () => {
    try {
      const stateToSave = cloneDeep(state)
      // 移除所有内部字段
      internalFields.forEach((field) => {
        delete (stateToSave as any)[field]
      })
      await adaptor.save(stateToSave as T)
      logger.debug(`[${storageKey}] Saved state successfully`)
    } catch (e) {
      logger.error(`[${storageKey}] Save failed: ${e}`)
      throw e
    }
  }

  // 更新方法
  const update = (changes: Partial<T>) => {
    if (mergedOptions.deepMerge) {
      merge(state, changes)
    } else {
      Object.assign(state, changes)
    }
  }

  // 异步更新方法
  const updateAsync = async (changes: Partial<T>): Promise<{ success: boolean; error?: string }> => {
    try {
      isManualUpdating.value = true
      update(changes)
      await save()
      return { success: true }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      logger.error(`[${storageKey}] Update failed: ${errorMsg}`)
      return { success: false, error: errorMsg }
    } finally {
      isManualUpdating.value = false
    }
  }

  // 初始化方法
  const initialize = async () => {
    try {
      isInitializing.value = true
      logger.debug(`[${storageKey}] Loading config...`)
      const savedConfig = await adaptor.load()
      if (savedConfig) {
        if (mergedOptions.deepMerge) {
          merge(state, savedConfig)
        } else {
          Object.assign(state, savedConfig)
        }
        // 设置时间戳
        const st = state as any
        st[__timestampField] = new Date().getTime()
      }
      logger.debug(`[${storageKey}] Loaded config successfully`, state)
    } catch (e) {
      logger.error(`[${storageKey}] Failed to load config: ${e}`)
      throw e
    }
  }

  // 防抖保存
  const saveDebounced = debounce(async () => {
    await save()
  }, mergedOptions.debounce)

  // 自动保存监听
  watch(
    () => state as any,
    (_newState: T) => {
      if (isInitializing.value) {
        // 执行所有注册的回调
        onInitializedCallbacks.value.forEach((cb) => {
          try {
            cb()
          } catch (e) {
            logger.error(`[${storageKey}] Error in initialization callback: ${e}`)
          }
        })
        isInitializing.value = false
        logger.debug(`[${storageKey}] Initializing, skip save`)
        return
      }
      // 如果是手动更新，跳过自动保存
      if (isManualUpdating.value) {
        return
      }
      void saveDebounced()
    },
    { deep: mergedOptions.deepWatch },
  )

  // 延迟初始化
  void initialize()

  return {
    state,
    readonlyState,
    update,
    updateAsync,
    registerOnInit,
    doInit: initialize,
  }
}
