/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CsdnWebAdaptor } from "~/src/adaptors/web/csdn/csdnWebAdaptor.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

/**
 * 用于获取CsdnWeb的API的自定义Hook
 */
const useCsdnWeb = async (key?: string, newCfg?: CsdnConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-csdn-web")

  // 记录开始使用Csdn WebAuth
  logger.info("Start using Csdn WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: CsdnConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<CsdnConfig>(setting[key], {} as CsdnConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Csdn的cookie
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      const csdnCookie = Utils.emptyOrDefault(process.env.VITE_CSDN_AUTH_TOKEN, "")
      cfg = new CsdnConfig("", csdnCookie, middlewareUrl)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
    const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
    if (StrUtil.isEmptyString(cfg.middlewareUrl)) {
      cfg.middlewareUrl = middlewareUrl
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  // 标签
  cfg.tagEnabled = true
  // CSDN使用多选分类作为专栏
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true
  // 退出登录
  cfg.logoutUrl = "https://passport.csdn.net/account/logout"
  // picbed service
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true

  const webApi = new CsdnWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useCsdnWeb }
