/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { TelegraphConfig, TelegraphPostType } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { TelegraphApiAdaptor } from "~/src/adaptors/api/telegraph/telegraphApiAdaptor.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

const useTelegraphApi = async (key: string, newCfg?: TelegraphConfig) => {
  const logger = createAppLogger("use-telegraph-api")
  logger.info("Start using Telegraph API...")

  const appInstance = new PublisherAppInstance()

  let cfg: TelegraphConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<TelegraphConfig>(setting[key], {} as TelegraphConfig)

    if (ObjectUtil.isEmptyObject(cfg)) {
      const telegraphUrl = Utils.emptyOrDefault(process.env.VITE_TELEGRAPH_URL, "https://telegra.ph")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      const telegraphToken = Utils.emptyOrDefault(process.env.VITE_TELEGRAPH_TOKEN, "")
      cfg = new TelegraphConfig(telegraphUrl, telegraphToken, middlewareUrl)
      logger.info("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }

    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  cfg.usernameEnabled = true
  cfg.cateEnabled = false
  cfg.tagEnabled = false
  cfg.postType = cfg.postType ?? TelegraphPostType.ANONYMOUS
  // picbed service
  cfg.picgoPicbedSupported = true
  // 已失效。无法实现
  cfg.bundledPicbedSupported = false

  const blogApi = new TelegraphApiAdaptor(appInstance, cfg)
  logger.info("Telegraph API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useTelegraphApi }
