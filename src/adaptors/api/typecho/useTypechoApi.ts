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
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/typechoConfig.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { TypechoApiAdaptor } from "~/src/adaptors/api/typecho/typechoApiAdaptor.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

/**
 * 使用Typecho API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const useTypechoApi = async (key?: string, newCfg?: TypechoConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-typecho-api")

  // 记录开始使用Typecho API
  logger.info("Start using Typecho API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: TypechoConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<TypechoConfig>(setting[key], {} as TypechoConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Typecho API的URL、用户名、认证令牌和中间件URL
      const typechoApiUrl = Utils.emptyOrDefault(process.env.VITE_TYPECHO_API_URL, "http://your-typecho-home.com/")
      const typechoUsername = Utils.emptyOrDefault(process.env.VITE_TYPECHO_USERNAME, "")
      const typechoAuthToken = Utils.emptyOrDefault(process.env.VITE_TYPECHO_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new TypechoConfig(typechoApiUrl, typechoUsername, typechoAuthToken, middlewareUrl)
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
  cfg.tagEnabled = true
  // Typecho使用多选分类
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建Typecho API适配器
  const blogApi = new TypechoApiAdaptor(appInstance, cfg)
  logger.info("Typecho API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}
