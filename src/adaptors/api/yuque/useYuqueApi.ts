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
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { YuqueApiAdaptor } from "~/src/adaptors/api/yuque/yuqueApiAdaptor.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

const useYuqueApi = async (key: string, newCfg?: YuqueConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-yuque-api")

  // 记录开始使用 Yuque API
  logger.info("Start using Yuque API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: YuqueConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<YuqueConfig>(setting[key], {} as YuqueConfig)

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Yuque API 的 URL、认证令牌和其他配置信息
      const yuqueUsername = Utils.emptyOrDefault(process.env.VITE_YUQUE_USERNAME, "")
      const yuqueAuthToken = Utils.emptyOrDefault(process.env.VITE_YUQUE_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new YuqueConfig(yuqueUsername, yuqueAuthToken, middlewareUrl)
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
  // Yuque 使用单选分类作为知识空间
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = false
  cfg.placeholder.knowledgeSpaceReadonlyModeTip =
    "由于语雀平台的限制，暂时不支持编辑所属知识库。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的知识库发布"
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = false

  // 创建 Yuque API 适配器
  const blogApi = new YuqueApiAdaptor(appInstance, cfg)
  logger.info("Yuque API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useYuqueApi }
