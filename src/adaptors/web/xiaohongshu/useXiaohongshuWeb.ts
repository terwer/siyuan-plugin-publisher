/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { XiaohongshuWebAdaptor } from "./XiaohongshuWebAdaptor"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { Utils } from "~/src/utils/utils"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { XiaohongshuConfig } from "~/src/adaptors/web/xiaohongshu/xiaohongshuConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 用于获取小红书的API的自定义Hook
 *
 * @param key - 平台 key
 * @param newCfg - 可选参数，用于指定新的配置
 */
const useXiaohongshuWeb = async (key?: string, newCfg?: XiaohongshuConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-xiaohongshu-web")

  // 记录开始使用小红书 WebAuth
  logger.info("Start using Xiaohongshu WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: XiaohongshuConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<XiaohongshuConfig>(setting[key], {} as XiaohongshuConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取小红书的cookie
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      const xiaohongshuCookie = Utils.emptyOrDefault(process.env.VITE_XIAOHONGSHU_AUTH_TOKEN, "")
      cfg = new XiaohongshuConfig(xiaohongshuCookie, middlewareUrl)
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

  // 小红书其他配置

  const webApi = new XiaohongshuWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useXiaohongshuWeb }
