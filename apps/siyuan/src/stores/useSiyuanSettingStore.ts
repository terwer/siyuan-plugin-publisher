/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SiyuanStorageAdaptor } from "@stores/vendor/SiyuanStorageAdaptor.ts"
import { SiyuanConfig } from "zhi-siyuan-api"
import { useStorageAsync } from "@stores/core/useStorageAsync.ts"
import { DEFAULT_SIYUAN_API_URL } from "@/Constants.ts"
import { computed } from "vue"
import { createAppLogger } from "@utils/appLogger.ts"

/**
 * 思源笔记设置
 *
 * @author terwer
 * @version 1.8.0
 * @since 1.8.0
 */
export const useSiyuanSettingStore = () => {
  const logger = createAppLogger("use-siyuan-setting-store")
  const storageKey = "siyuan-setting-store"
  const adaptorKey = "siyuan-cfg"
  const filePath = "/data/storage/syp/siyuan-cfg.json"
  const initial: SiyuanConfig = new SiyuanConfig(DEFAULT_SIYUAN_API_URL, "")

  // 创建适配器实例
  const adaptor = new SiyuanStorageAdaptor<SiyuanConfig>(adaptorKey, filePath)

  // 获取响应式存储
  // const { state, update, flush } = useStorageAsync(storageKey, initial, adaptor)
  const { state, flush } = useStorageAsync(storageKey, initial, adaptor)

  // 受控更新方法
  // const setSiyuanCfg = (cfg: SiyuanConfig) => {
  //   update(cfg)
  // }

  // 获取最新配置，api地址不受控
  // const newSiyuanCfg = computed({
  //   get: () => ({
  //     ...state.value,
  //     home: DEFAULT_SIYUAN_API_URL,
  //     apiUrl: DEFAULT_SIYUAN_API_URL,
  //   }),
  //   set: (value: SiyuanConfig) => {
  //     // 保留默认值逻辑，只允许修改 token
  //     // update({ token: value.token })
  //     logger.debug("Update siyuan-cfg", value)
  //   },
  // })
  // logger.debug("Loaded siyuan-cfg", newSiyuanCfg.value)

  return {
    // 只读状态
    siyuanCfg: state,
    // 唯一更新方法
    // setSiyuanCfg,
    // 立即刷新存储
    flushSiyuanCfg: flush,
  }
}
