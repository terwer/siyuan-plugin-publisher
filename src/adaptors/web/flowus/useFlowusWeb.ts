/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { FlowusWebAdaptor } from "~/src/adaptors/web/flowus/flowusWebAdaptor.ts"
import { FlowusConfig } from "~/src/adaptors/web/flowus/flowusConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum } from "zhi-blog-api"

/**
 * 用于获取Flowus的API的自定义Hook
 */
const useFlowusWeb = async (key?: string, newCfg?: FlowusConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-flowus-web")

  // 记录开始使用Flowus WebAuth
  logger.info("Start using Flowus WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: FlowusConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<FlowusConfig>(setting[key], {} as FlowusConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      const middlewareUrl = Utils.emptyOrDefault(
        process.env.VITE_MIDDLEWARE_URL,
        "https://api.flowus.space/api/middleware"
      )
      // 从环境变量获取Flowus的cookie
      const flowusCookie = Utils.emptyOrDefault(process.env.VITE_FLOWUS_AUTH_TOKEN, "")
      cfg = new FlowusConfig("", flowusCookie, middlewareUrl)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
    const middlewareUrl = Utils.emptyOrDefault(
      process.env.VITE_MIDDLEWARE_URL,
      "https://api.flowus.space/api/middleware"
    )
    if (StrUtil.isEmptyString(cfg.middlewareUrl)) {
      cfg.middlewareUrl = middlewareUrl
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  // 适应Flowus的配置
  // 标签
  cfg.tagEnabled = false
  // 知乎使用单选分类作为根页面
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = false
  cfg.placeholder.knowledgeSpaceReadonlyModeTip =
    "由于Flowus平台的限制，暂时不支持编辑所属专栏。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的专栏发布"

  const webApi = new FlowusWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useFlowusWeb }
