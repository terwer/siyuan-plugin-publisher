/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { DEFAULT_SIYUAN_LANG } from "@/Constants.ts"
import { SypConfig } from "@/models/sypConfig.ts"
import { useManualStorageAsync } from "@stores/core/useManualStorageAsync"
// import { createAppLogger } from "@utils/appLogger.ts"
import { defineStore } from "pinia"
import { AsyncSiyuanStorageAdaptor } from "@stores/impl/AsyncSiyuanStorageAdaptor.ts"

export const usePublishSettingStore = defineStore("publishSetting", () => {
  // const logger = createAppLogger("use-publish-setting-store")
  const key = undefined
  const path = "/data/storage/syp/sy-p-plus-cfg.json"
  const adaptor = new AsyncSiyuanStorageAdaptor<SypConfig>(key, path)

  const initialState: SypConfig = {
    lang: DEFAULT_SIYUAN_LANG as "zh_CN" | "en_US",
  }

  const {
    state,
    readonlyState,
    update,
    updateAsync,
    registerOnInit,
    doInit: initialize,
  } = useManualStorageAsync("publishSetting", initialState, adaptor, {
    debounce: 300,
    deepWatch: true,
    deepMerge: true,
  })

  return {
    state,
    readonlyState,
    update,
    updateAsync,
    registerOnInit,
    doInit: initialize,
  }
})
