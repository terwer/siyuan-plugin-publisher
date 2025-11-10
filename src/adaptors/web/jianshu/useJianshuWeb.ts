/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JianshuConfig } from "~/src/adaptors/web/jianshu/jianshuConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { JianshuWebAdaptor } from "~/src/adaptors/web/jianshu/jianshuWebAdaptor.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

/**
 * 用于获取JianshuWeb的API的自定义Hook
 */
const useJianshuWeb = async (key?: string, newCfg?: JianshuConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-jianshu-web")

  // 记录开始使用Jianshu WebAuth
  logger.info("Start using Jianshu WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: JianshuConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<JianshuConfig>(setting[key], {} as JianshuConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      // 从环境变量获取Jianshu的cookie
      const jianshuCookie = Utils.emptyOrDefault(process.env.VITE_JIANSHU_AUTH_TOKEN, "")
      cfg = new JianshuConfig("", jianshuCookie, middlewareUrl)
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

  cfg.tagEnabled = false
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceTitle = "笔记本"
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = false
  cfg.placeholder.knowledgeSpaceReadonlyModeTip =
    "由于简书平台的限制，暂时不支持编辑所属笔记本。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的笔记本发布"
  // 退出登录
  cfg.logoutUrl = "https://www.jianshu.com/shakespeare/sign_out"
  // picbed service
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true

  const webApi = new JianshuWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useJianshuWeb }
