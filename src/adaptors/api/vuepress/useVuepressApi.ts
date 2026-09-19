/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum } from "zhi-blog-api"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { VuepressApiAdaptor } from "~/src/adaptors/api/vuepress/vuepressApiAdaptor.ts"
import { VuepressConfig } from "~/src/adaptors/api/vuepress/vuepressConfig.ts"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { VuepressYamlConverterAdaptor } from "~/src/adaptors/api/vuepress/vuepressYamlConverterAdaptor.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { Utils } from "~/src/utils/utils.ts"

const useVuepressApi = async (key: string, newCfg?: VuepressConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-vuepress-api")

  // 记录开始使用 Vuepress API
  logger.info("Start using Vuepress API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: VuepressConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = safeMergeConfig<VuepressConfig>(setting[key], VuepressConfig, ["","","","",""])

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Vuepress API 的 URL、认证令牌和其他配置信息
      const githubUsername = Utils.emptyOrDefault(process.env.VITE_GITHUB_USERNAME, "")
      const githubAuthToken = Utils.emptyOrDefault(process.env.VITE_GITHUB_AUTH_TOKEN, "")
      const githubRepo = Utils.emptyOrDefault(process.env.VITE_GITHUB_REPO, "")
      const githubBranch = Utils.emptyOrDefault(process.env.VITE_GITHUB_BRANCH, "main")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new VuepressConfig(githubUsername, githubAuthToken, githubRepo, githubBranch, middlewareUrl)
      cfg.mdFilenameRule = "[filename].md"
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
  // 推荐别名。但是不强制使用
  // cfg.mdFilenameRule = "[filename].md"
  // cfg.imageStorePath = "docs/.vuepress/public/image"
  // cfg.imageLinkPath = "images"
  // 标签
  cfg.tagEnabled = true
  // 分类
  cfg.cateEnabled = true
  cfg.allowCateChange = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  // 知识空间
  cfg.knowledgeSpaceEnabled = true
  cfg.knowledgeSpaceTitle = "发布目录"
  cfg.allowKnowledgeSpaceChange = false
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建 Vuepress 的 yamlAdaptor
  const yamlAdaptor = new VuepressYamlConverterAdaptor()

  // 创建 Vuepress API 适配器
  const blogApi = new VuepressApiAdaptor(appInstance, cfg)
  logger.info("Vuepress API created successfully.", cfg)

  return {
    cfg,
    yamlAdaptor,
    blogApi,
  }
}

export { useVuepressApi }
