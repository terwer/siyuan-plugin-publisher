/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ZhihuWebAdaptor } from "~/src/adaptors/web/zhihu/zhihuWebAdaptor.ts"
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum, PicbedServiceTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { ZhihuPlaceholder } from "~/src/adaptors/web/zhihu/zhihuPlaceholder.ts"

/**
 * 用于获取Zhihu的API的自定义Hook
 */
const useZhihuWeb = async (key?: string, newCfg?: ZhihuConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-zhihu-web")

  // 记录开始使用Zhihu WebAuth
  logger.info("Start using Zhihu WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: ZhihuConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<ZhihuConfig>(setting[key], {} as ZhihuConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      // 从环境变量获取Zhihu的cookie
      const zhihuCookie = Utils.emptyOrDefault(process.env.VITE_ZHIHU_AUTH_TOKEN, "")
      cfg = new ZhihuConfig("", zhihuCookie, middlewareUrl)
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

  // 标签
  cfg.tagEnabled = false
  // 知乎使用单选分类作为专栏
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = false
  // fix error cfg arg
  if (!cfg.placeholder) {
    cfg.placeholder = new ZhihuPlaceholder()
  }
  cfg.placeholder.knowledgeSpaceReadonlyModeTip =
    "由于知乎平台的限制，暂时不支持编辑所属专栏。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的专栏发布"
  // 退出登录
  cfg.logoutUrl = "https://www.zhihu.com/logout"
  // picbed service
  cfg.picgoPicbedSupported = false
  cfg.bundledPicbedSupported = true

  const webApi = new ZhihuWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useZhihuWeb }
