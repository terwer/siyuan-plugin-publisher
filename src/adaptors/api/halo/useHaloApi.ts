/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { HaloApiAdaptor } from "~/src/adaptors/api/halo/HaloApiAdaptor.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

const useHaloApi = async (key: string, newCfg?: HaloConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-halo-api")

  // 记录开始使用 Halo API
  logger.info("Start using Halo API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: HaloConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<HaloConfig>(setting[key], {} as HaloConfig)

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Halo API 的 URL、认证令牌和其他配置信息
      const haloUsername = Utils.emptyOrDefault(process.env.VITE_YUQUE_USERNAME, "")
      const haloAuthToken = Utils.emptyOrDefault(process.env.VITE_YUQUE_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new HaloConfig(haloUsername, haloAuthToken, middlewareUrl)
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
  // 标签
  cfg.tagEnabled = true
  // Halo 使用多选分类
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建 Halo API 适配器
  const blogApi = new HaloApiAdaptor(appInstance, cfg)
  logger.info("Halo API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useHaloApi }
