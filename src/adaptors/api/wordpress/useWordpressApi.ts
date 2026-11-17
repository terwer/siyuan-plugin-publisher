/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { Utils } from "~/src/utils/utils.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { ObjectUtil, StrUtil } from "zhi-common"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { WordpressApiAdaptor } from "~/src/adaptors/api/wordpress/wordpressApiAdaptor.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { SHARED_PROXY_MIDDLEWARE } from "~/src/utils/constants.ts"

/**
 * 使用Wordpress API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const useWordpressApi = async (key?: string, newCfg?: WordpressConfig) => {
  // 创建应用日志记录器

  // 记录开始使用Wordpress API

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: WordpressConfig
  if (newCfg) {
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = safeMergeConfig<WordpressConfig>(setting[key], WordpressConfig, ["","","",""])
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Wordpress API的URL、用户名、认证令牌和中间件URL
      const wordpressApiUrl = Utils.emptyOrDefault(process.env.VITE_WORDPRESS_API_URL, "http://your-wordpress-home.com")
      const wordpressUsername = Utils.emptyOrDefault(process.env.VITE_WORDPRESS_USERNAME, "")
      const wordpressAuthToken = Utils.emptyOrDefault(process.env.VITE_WORDPRESS_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, SHARED_PROXY_MIDDLEWARE)
      cfg = new WordpressConfig(wordpressApiUrl, wordpressUsername, wordpressAuthToken, middlewareUrl)
    } else {
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
  // 特色图片：与其它能力位一样在这里统一声明。发布链路的配置是设置反序列化出来的普通对象，
  // 只靠构造器默认值不够；只有 WordPress 打开，其它 MetaWeblog 平台保持关闭。
  cfg.featuredImageEnabled = true
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建Wordpress API适配器
  const blogApi = new WordpressApiAdaptor(appInstance, cfg)

  return {
    cfg,
    blogApi,
  }
}
