/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BilibiliConfig } from "~/src/adaptors/web/bilibili/bilibiliConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { BilibiliWebAdaptor } from "~/src/adaptors/web/bilibili/bilibiliWebAdaptor.ts"
import { Utils } from "~/src/utils/utils.ts"
import { CategoryTypeEnum } from "zhi-blog-api"

/**
 * 用于获取BilibiliWeb的API的自定义Hook
 *
 * @param key - 平台 key
 * @param newCfg - 可选参数，用于指定新的配置
 */
const useBilibiliWeb = async (key?: string, newCfg?: BilibiliConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-bilibili-web")

  // 记录开始使用Bilibili WebAuth
  logger.info("Start using Bilibili WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: BilibiliConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<BilibiliConfig>(setting[key], {} as BilibiliConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Bilibili的cookie
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      const bilibiliCookie = Utils.emptyOrDefault(process.env.VITE_BILIBILI_AUTH_TOKEN, "")
      cfg = new BilibiliConfig(bilibiliCookie, middlewareUrl)
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

  // B站使用单选分类作为专栏(文集)
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceTitle = "文集"
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = true

  const webApi = new BilibiliWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useBilibiliWeb }
