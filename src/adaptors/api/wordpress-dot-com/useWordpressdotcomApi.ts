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
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { WordpressdotcomConfig } from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomConfig.ts"
import { WordpressdotcomApiAdaptor } from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomApiAdaptor.ts"

/**
 * 使用 Wordpress.com API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg
 * @author terwer
 * @version 1.20.0
 * @since 1.20.0
 */
export const useWordpressdotcomApi = async (key?: string, newCfg?: WordpressdotcomConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-wordpress-dot-com-api")

  // 记录开始使用Wordpress.com API
  logger.info("Start using Wordpress.com API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: WordpressdotcomConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<WordpressConfig>(setting[key], {} as WordpressdotcomConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Wordpress API的URL、用户名、认证令牌和中间件URL
      const wordpressApiUrl = Utils.emptyOrDefault(
        process.env.VITE_WORDPRESS_API_URL,
        "https://[username].wordpress.com"
      )
      const wordpressUsername = Utils.emptyOrDefault(process.env.VITE_WORDPRESS_USERNAME, "")
      const wordpressAuthToken = Utils.emptyOrDefault(process.env.VITE_WORDPRESS_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new WordpressConfig(wordpressApiUrl, wordpressUsername, wordpressAuthToken, middlewareUrl)
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
  // WordPress使用多选分类
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建 Wordpress.com API 适配器
  const blogApi = new WordpressdotcomApiAdaptor(appInstance, cfg)
  logger.info("Wordpress.com API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}
