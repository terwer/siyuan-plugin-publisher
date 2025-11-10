/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {MetaweblogConfig} from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import {createAppLogger} from "~/src/utils/appLogger.ts"
import {PublisherAppInstance} from "~/src/publisherAppInstance.ts"
import {usePublishSettingStore} from "~/src/stores/usePublishSettingStore.ts"
import {JsonUtil, ObjectUtil, StrUtil} from "zhi-common"
import {Utils} from "~/src/utils/utils.ts"
import {getDynPostidKey} from "~/src/platforms/dynamicConfig.ts"
import {MetaweblogBlogApiAdaptor} from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import {CategoryTypeEnum} from "zhi-blog-api"
import {LEGENCY_SHARED_PROXT_MIDDLEWARE} from "~/src/utils/constants.ts";

/**
 * 使用Metaweblog API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const useMetaweblogApi = async (key?: string, newCfg?: MetaweblogConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-metaweblog-api")

  // 记录开始使用Metaweblog API
  logger.info("Start using Metaweblog API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: MetaweblogConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<MetaweblogConfig>(setting[key], {} as MetaweblogConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Metaweblog API的URL、用户名、认证令牌和中间件URL
      const metaweblogApiUrl = ""
      const metaweblogUsername = ""
      const metaweblogAuthToken = ""
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)

      cfg = new MetaweblogConfig("", metaweblogApiUrl, metaweblogUsername, metaweblogAuthToken, middlewareUrl)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  cfg.tagEnabled = true
  // Metaweblog 默认支持多选分类
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建Metaweblog API适配器
  const blogApi = new MetaweblogBlogApiAdaptor(appInstance, cfg)

  // 记录Metaweblog API创建成功
  logger.info("Metaweblog API created successfully.")

  return {
    cfg,
    blogApi,
  }
}
