/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { YuquewebConfig } from "~/src/adaptors/web/yuqueweb/YuquewebConfig.ts"
import { YuquewebWebAdaptor } from "~/src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { DynamicJsonCfg, getDynCfgByKey, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { PRE_CONSTANTS } from "~/src/platforms/PreConstants.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { DYNAMIC_CONFIG_KEY, LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { Utils } from "~/src/utils/utils.ts"
import type { ISypConfig } from "~/syp.config"
import { CategoryTypeEnum, PicbedServiceTypeEnum } from "zhi-blog-api"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"

const getYuquewebDynCfg = (setting: ISypConfig) => {
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  const dynamicConfigArray = dynJsonCfg?.totalCfg || []
  return getDynCfgByKey(dynamicConfigArray, PRE_CONSTANTS.PRE_CUSTOM_YUQUEWEB)
}

/**
 * 用于获取语雀网页版 API 的自定义 Hook
 */
const useYuquewebWeb = async (key?: string, newCfg?: YuquewebConfig) => {
  const logger = createAppLogger("use-yuqueweb-web")
  logger.info("Start using Yuqueweb WebAuth...")

  const appInstance = new PublisherAppInstance()
  let cfg: YuquewebConfig

  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    const dynCfg = getYuquewebDynCfg(setting)
    cfg = safeMergeConfig<YuquewebConfig>(setting[key], YuquewebConfig, [""])

    if (ObjectUtil.isEmptyObject(setting[key])) {
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new YuquewebConfig("", middlewareUrl)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }

    const authUrl = dynCfg?.authUrl ?? "https://www.yuque.com/login"
    const url = new URL(authUrl)
    if (url.origin !== cfg.home || url.origin !== cfg.apiUrl) {
      cfg.home = url.origin
      cfg.apiUrl = url.origin
      logger.info("authUrl has changed, update cfg.home and cfg.apiUrl")
    }

    const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
    if (StrUtil.isEmptyString(cfg.middlewareUrl)) {
      cfg.middlewareUrl = middlewareUrl
    }

    if (StrUtil.isEmptyString(cfg.posidKey)) {
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  cfg.home = "https://www.yuque.com"
  cfg.apiUrl = "https://www.yuque.com"
  cfg.pageType = "markdown" as any
  cfg.usernameEnabled = false
  cfg.showTokenTip = false
  cfg.tagEnabled = false
  cfg.cateEnabled = false
  cfg.categoryType = CategoryTypeEnum.CategoryType_None
  cfg.allowCateChange = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceTitle = "知识库"
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = true
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true
  cfg.picbedService = cfg.picbedService || PicbedServiceTypeEnum.Bundled

  const webApi = new YuquewebWebAdaptor(appInstance, cfg)

  return {
    cfg,
    webApi,
  }
}

export { useYuquewebWeb }
