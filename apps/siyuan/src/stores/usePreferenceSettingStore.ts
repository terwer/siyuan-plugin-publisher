/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { SiyuanStorageAdaptor } from "@stores/vendor/SiyuanStorageAdaptor.ts"
import { PublishPreferenceCfg } from "@/models/publishPreferenceCfg.ts"
import { useStorageAsync } from "@stores/core/useStorageAsync.ts"
import { useComputedObject } from "@composables/useComputedObject.ts"
import { WINDOW_SIYUAN } from "@/Constants.ts"
import { WritableComputedRef, readonly } from "vue"

/**
 * 使用发布偏好设置的自定义钩子
 */
export const usePreferenceSettingStore = () => {
  const logger = createAppLogger("use-preference-setting-store")
  const storageKey = "preference-setting"
  const adaptorKey = "publish-preference-cfg"
  const filePath = "/data/storage/syp/publish-preference-cfg.json"
  const initValue = new PublishPreferenceCfg()

  // 创建适配器实例
  const adaptor = new SiyuanStorageAdaptor<PublishPreferenceCfg>(
    adaptorKey,
    filePath,
  )

  // 获取响应式存储
  const { formState } = useStorageAsync(storageKey, initValue, adaptor)

  const syAiCfg = WINDOW_SIYUAN?.config?.ai?.openAI
  logger.info("try load ai cfg from window.siyuan.config =>", syAiCfg)
  let newPreferenceCfg: WritableComputedRef<
    PublishPreferenceCfg,
    PublishPreferenceCfg
  >
  if (syAiCfg) {
    newPreferenceCfg = useComputedObject(formState, {
      experimentalUseSiyuanNoteAIConfig: true,
      experimentalAIProxyUrl: syAiCfg.apiProxy,
      experimentalAICode: syAiCfg.apiKey,
      experimentalAIBaseUrl: syAiCfg.apiBaseURL,
      experimentalAIApiModel: syAiCfg.apiModel,
      experimentalAIApiMaxTokens: syAiCfg.apiMaxTokens,
      experimentalAIApiTemperature: syAiCfg.apiTemperature,
    })
    logger.info("use siyuan-note ai config")
  } else {
    newPreferenceCfg = useComputedObject(formState, {
      experimentalUseSiyuanNoteAIConfig: false,
    })
    logger.info("use custom ai config")
  }
  logger.debug(
    "Loaded default preference-cfg, may not the latest",
    newPreferenceCfg.value,
  )

  return {
    // 只读状态
    readonlyPreferenceCfg: readonly(newPreferenceCfg.value),
    // 响应式表单对象
    preferenceCfg: newPreferenceCfg,
  }
}
