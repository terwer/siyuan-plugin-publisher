/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JuejinConfig } from "~/src/adaptors/web/juejin/juejinConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { JuejinWebAdaptor } from "~/src/adaptors/web/juejin/juejinWebAdaptor.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

/**
 * 用于获取JuejinWeb的API的自定义Hook
 */
const useJuejinWeb = async (key?: string, newCfg?: JuejinConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-juejin-web")

  // 记录开始使用Juejin WebAuth
  logger.info("Start using Juejin WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: JuejinConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<JuejinConfig>(setting[key], {} as JuejinConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      // 从环境变量获取Juejin的cookie
      const juejinCookie = Utils.emptyOrDefault(process.env.VITE_JUEJIN_AUTH_TOKEN, "")
      cfg = new JuejinConfig("", juejinCookie, middlewareUrl)
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

  // 注意：
  // 分类和知识空间可以共存。但是共存的前提是。知识空间使用getCategories，分类使用getCategoryTreeNodes
  // 分类使用getCategories时候，不能开启知识空间
  //
  // 标签和别名标签不能共存
  //
  // 掘金使用单选分类、别名标签
  cfg.tagEnabled = false
  cfg.tagSlugEnabled = true
  cfg.cateEnabled = false
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceTitle = "分类"
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
  cfg.allowKnowledgeSpaceChange = true
  // 退出登录
  cfg.logoutUrl = "https://juejin.cn/passport/web/logout"
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = false

  const webApi = new JuejinWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useJuejinWeb }
