/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { Utils } from "~/src/utils/utils.ts"
import { ConfluenceConfig } from "~/src/adaptors/api/confluence/confluenceConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { ConfluenceApiAdaptor } from "~/src/adaptors/api/confluence/confluenceApiAdaptor.ts"
import { CategoryTypeEnum, PicbedServiceTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { CONFLUENCE_CONSTANTS } from "~/src/adaptors/api/confluence/confluenceConstants.ts"

const useConfluenceApi = async (key: string, newCfg?: ConfluenceConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-confluence-api")

  // 记录开始使用 Confluence API
  logger.info("Start using Confluence API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: ConfluenceConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<ConfluenceConfig>(setting[key], {} as ConfluenceConfig)

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Confluence API 的 URL、认证令牌和其他配置信息
      const confluenceHome = Utils.emptyOrDefault(process.env.VITE_CONFLUENCE_HOME, "")
      const confluenceAuthToken = Utils.emptyOrDefault(process.env.VITE_CONFLUENCE_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new ConfluenceConfig(confluenceHome, confluenceHome, confluenceAuthToken, middlewareUrl)
      cfg.picbedService = PicbedServiceTypeEnum.Bundled
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

  // 标签
  cfg.tagEnabled = false
  // Confluence 使用单选分类作为空间
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = true
  cfg.parentPageId = cfg.parentPageId ?? ""
  cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, CONFLUENCE_CONSTANTS.TOKEN_SETTING_URL)
  cfg.previewUrl = "/spaces/[spaceKey]/pages/[postid]"
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建 Confluence API 适配器
  const blogApi = new ConfluenceApiAdaptor(appInstance, cfg)
  logger.info("Confluence API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useConfluenceApi }
