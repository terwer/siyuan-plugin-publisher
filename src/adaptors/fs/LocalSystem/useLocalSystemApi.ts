/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { FsUtils } from "~/src/adaptors/fs/LocalSystem/FsUtils.ts"
import { LocalSystemApiAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemApiAdaptor.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 本地系统适配器
 *
 * @param key
 * @param newCfg
 * @author terwer
 * @since 1.38.0
 */
const useLocalSystemApi = async (key: string, newCfg?: LocalSystemConfig) => {
  const logger = createAppLogger("use-local-system-api")
  let cfg: LocalSystemConfig
  if (newCfg) {
    cfg = newCfg
  } else {
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = safeMergeConfig<LocalSystemConfig>(setting[key], LocalSystemConfig, [])
    logger.info("Using configuration from settings...")
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  const appInstance = new PublisherAppInstance()

  cfg.tagEnabled = true
  cfg.cateEnabled = true
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  const blogApi = new LocalSystemApiAdaptor(appInstance, cfg)
  const yamlAdaptor = FsUtils.getYamlAdaptor(cfg)

  return {
    cfg,
    blogApi,
    yamlAdaptor,
  }
}

export { useLocalSystemApi }
