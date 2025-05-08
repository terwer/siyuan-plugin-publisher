/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { DEFAULT_SIYUAN_LANG } from "@/Constants.ts"
import { SypConfig } from "@/models/SypConfig.ts"
import { SiyuanStorageAdaptor } from "@/stores/vendor/SiyuanStorageAdaptor"
import { createAppLogger } from "@utils/appLogger.ts"
import { cloneDeep, debounce, merge } from "lodash-es"
import { defineStore } from "pinia"
import { computed, reactive, readonly, ref, watch } from "vue"

// 定义深层只读类型工具
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

export const usePublishSettingStore = defineStore("publishSetting", () => {
  const logger = createAppLogger("use-publish-setting-store")
  const key = undefined
  const path = "/data/storage/syp/sy-p-plus-cfg.json"
  const adaptor = new SiyuanStorageAdaptor<SypConfig>(key, path) // 严格保留适配器
  // 初始化完成回调队列
  const onInitializedCallbacks = ref<Array<() => void>>([])
  const isInitializing = ref(false)
  // 防止多个实例混乱
  const __timestampField = "__pt_timestamp_" + new Date().getTime()

  const state = reactive<SypConfig>({
    lang: DEFAULT_SIYUAN_LANG as "zh_CN" | "en_US",
    currentPlatform: null,
  })

  const readonlyState = computed(() => {
    return readonly(state) as DeepReadonly<typeof state> // 直接返回只读视图
  })

  const registerOnInit = (callback: () => void) => {
    onInitializedCallbacks.value.push(callback)
    return () => {
      onInitializedCallbacks.value = onInitializedCallbacks.value.filter(
        (cb) => cb !== callback,
      )
    }
  }

  const initialize = async () => {
    try {
      isInitializing.value = true
      logger.debug(`Loading config from ${path}`)
      const savedConfig = await adaptor.load()
      if (savedConfig) {
        merge(state, savedConfig)
        // 强制刷新
        const st = state as any
        st[__timestampField] = new Date().getTime()
      }
      logger.debug(`Loaded cfg ${path} successfully`, state)
    } catch (e) {
      logger.error(`Failed to load config: ${e as string}`)
    }
  }

  const save = async () => {
    try {
      await adaptor.save(cloneDeep(state)) // 严格保留适配器保存
      logger.info(`Saved cfg ${key ?? path} success`)
    } catch (e) {
      logger.error(`Save cfg ${key ?? path} failed: ${e}`)
    }
  }

  const update = (changes: Partial<SypConfig>) => {
    merge(state, changes)
  }

  // 防抖函数初始化（外置定义）
  const saveDebounced = debounce(async () => {
    await save()
  }, 300)

  watch(
    () => state as SypConfig,
    (_newState: SypConfig) => {
      if (isInitializing.value) {
        // 执行所有注册的回调
        onInitializedCallbacks.value.forEach((cb) => {
          try {
            cb()
          } catch (e) {
            logger.error(`Error in initialization callback: ${e as string}`)
          }
        })
        isInitializing.value = false
        logger.debug(`Initializing publish settings, skip save`)
        return
      }
      void saveDebounced()
    },
    { deep: true },
  )

  return {
    state,
    readonlyState,
    update,
    registerOnInit,
    doInit: initialize,
    setCurrentPlatform: (platform: DynamicConfig) => {
      state.currentPlatform = platform
    },
  }
})
