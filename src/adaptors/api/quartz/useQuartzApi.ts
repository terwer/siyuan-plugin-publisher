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
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { QuartzApiAdaptor } from "~/src/adaptors/api/quartz/quartzApiAdaptor.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

const useQuartzApi = async (key: string, newCfg?: QuartzConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-quartz-api")

  // 记录开始使用 Quartz API
  logger.info("Start using Quartz API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: QuartzConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<QuartzConfig>(setting[key], {} as QuartzConfig)

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Quartz API 的 URL、认证令牌和其他配置信息
      const githubUsername = Utils.emptyOrDefault(process.env.VITE_GITHUB_USERNAME, "")
      const githubAuthToken = Utils.emptyOrDefault(process.env.VITE_GITHUB_AUTH_TOKEN, "")
      const githubRepo = Utils.emptyOrDefault(process.env.VITE_GITHUB_REPO, "")
      const githubBranch = Utils.emptyOrDefault(process.env.VITE_GITHUB_BRANCH, "main")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new QuartzConfig(githubUsername, githubAuthToken, githubRepo, githubBranch, middlewareUrl)
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

  // 文件规则，占位符
  // [slug] 别名
  // [filename] 真实文件名
  // [yyyy] 年
  // [mm] 月
  // [dd] 日
  // 推荐别名。但是不强制使用，默认调整为 [filename].md since 1.34.0
  // cfg.mdFilenameRule = "[slug].md"
  // cfg.imageStorePath = "content/images"
  // 标签
  cfg.tagEnabled = true
  // 分类
  cfg.cateEnabled = true
  cfg.allowCateChange = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  // 知识空间
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceTitle = "发布目录"
  cfg.allowKnowledgeSpaceChange = true
  cfg.placeholder.knowledgeSpaceReadonlyModeTip = "Quartz 平台支持修改发布目录，如文章已发布过会先删除原来的再发布新的"
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建 Quartz 的 yamlAdaptor
  const yamlAdaptor = new QuartzYamlConverterAdaptor()

  // 创建 Quartz API 适配器
  const blogApi = new QuartzApiAdaptor(appInstance, cfg)
  logger.info("Quartz API created successfully.", cfg)

  return {
    cfg,
    yamlAdaptor,
    blogApi,
  }
}

export { useQuartzApi }
