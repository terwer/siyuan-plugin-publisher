/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum } from "zhi-blog-api"
import { ObjectUtil, StrUtil } from "zhi-common"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { NotionApiAdaptor } from "~/src/adaptors/api/notion/notionApiAdaptor.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { Utils } from "~/src/utils/utils.ts"

const useNotionApi = async (key: string, newCfg?: NotionConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-notion-api")

  // 记录开始使用 Notion API
  logger.info("Start using Notion API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: NotionConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = safeMergeConfig<NotionConfig>(setting[key], NotionConfig, ["", ""])

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Notion API 的 URL、认证令牌和其他配置信息
      const notionAuthToken = Utils.emptyOrDefault(process.env.VITE_NOTION_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new NotionConfig(notionAuthToken, middlewareUrl)
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
  // Notion 使用单选分类作为知识空间
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = false
  cfg.cateSearchEnabled = true
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = false

  // 创建 Notion API 适配器
  const blogApi = new NotionApiAdaptor(appInstance, cfg)
  logger.info("Notion API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useNotionApi }
