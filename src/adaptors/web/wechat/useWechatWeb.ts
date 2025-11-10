/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { WechatConfig } from "~/src/adaptors/web/wechat/wechatConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { WechatWebAdaptor } from "~/src/adaptors/web/wechat/wechatWebAdaptor.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { PicbedServiceTypeEnum } from "zhi-blog-api"

/**
 * 用于获取WechatWeb的API的自定义Hook
 */
const useWechatWeb = async (key?: string, newCfg?: WechatConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-wechat-web")

  // 记录开始使用Wechat WebAuth
  logger.info("Start using Wechat WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: WechatConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<WechatConfig>(setting[key], {} as WechatConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      // 从环境变量获取Wechat的cookie
      const wechatCookie = Utils.emptyOrDefault(process.env.VITE_WECHAT_AUTH_TOKEN, "")
      cfg = new WechatConfig("", wechatCookie, middlewareUrl)
      cfg.picbedService = PicbedServiceTypeEnum.Bundled
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

  // 微信公众号不支持标签、分类、知识空间
  cfg.tagEnabled = false
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true

  const webApi = new WechatWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useWechatWeb }
