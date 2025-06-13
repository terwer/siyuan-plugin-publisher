/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SiyuanConfig } from "zhi-siyuan-api"
import { useStorageAsync } from "@/stores/core/useStorageAsync.ts"
import { DEFAULT_SIYUAN_API_URL, LEGENCY_SHARED_PROXY_MIDDLEWARE } from "@/Constants.ts"
import { readonly } from "vue"
import { useComputedObject } from "@/composables/useComputedObject.ts"
import { createAppLogger } from "@/utils/appLogger.ts"
import { AsyncSiyuanStorageAdaptor } from "@/stores/adapters/siyuan/AsyncSiyuanStorageAdaptor.ts"

/**
 * 思源笔记设置
 *
 * @author terwer
 * @version 2.0.0
 * @since 1.8.0
 */
export const useSiyuanSettingStore = () => {
  const logger = createAppLogger("use-siyuan-setting-store")
  const storageKey = "siyuan-setting"
  const adaptorKey = "siyuan-cfg"
  const filePath = "/data/storage/syp/siyuan-cfg.json"
  const initValue = {
    home: DEFAULT_SIYUAN_API_URL,
    apiUrl: DEFAULT_SIYUAN_API_URL,
    middlewareUrl: LEGENCY_SHARED_PROXY_MIDDLEWARE,
  } as SiyuanConfig

  // 创建适配器实例
  const adaptor = new AsyncSiyuanStorageAdaptor<SiyuanConfig>(adaptorKey, filePath)

  // 获取响应式存储
  const { formState } = useStorageAsync<SiyuanConfig>(storageKey, initValue, adaptor)

  const newSiyuanCfg = useComputedObject(formState, initValue)
  logger.info("Loaded default siyuan-cfg, may not the latest", newSiyuanCfg.value)

  return {
    // 只读状态
    readonlySiyuanCfg: readonly(newSiyuanCfg.value),
    // 响应式表单对象
    siyuanCfg: newSiyuanCfg,
  }
}
