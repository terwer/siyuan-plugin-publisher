/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { LocalSystemApiAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemApiAdaptor.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { LocalSystemYamlConvertAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemYamlConvertAdaptor.ts"

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
    cfg = JsonUtil.safeParse<LocalSystemConfig>(setting[key], {} as LocalSystemConfig)
    if (ObjectUtil.isEmptyObject(cfg)) {
      cfg = new LocalSystemConfig()
    } else {
      logger.info("Using configuration from settings...")
    }
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  const appInstance = new PublisherAppInstance()

  cfg.tagEnabled = true
  cfg.cateEnabled = true
  // picbed service
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true

  const blogApi = new LocalSystemApiAdaptor(appInstance, cfg)
  const yamlAdaptor = new LocalSystemYamlConvertAdaptor(cfg)

  return {
    cfg,
    blogApi,
    yamlAdaptor,
  }
}

export { useLocalSystemApi }
