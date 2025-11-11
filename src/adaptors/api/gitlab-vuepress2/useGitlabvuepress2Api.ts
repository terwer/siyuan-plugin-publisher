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
import { CategoryTypeEnum } from "zhi-blog-api"
import { Gitlabvuepress2Config } from "~/src/adaptors/api/gitlab-vuepress2/gitlabvuepress2Config.ts"
import { Gitlabvuepress2YamlConverterAdaptor } from "~/src/adaptors/api/gitlab-vuepress2/gitlabvuepress2YamlConverterAdaptor.ts"
import { Gitlabvuepress2ApiAdaptor } from "~/src/adaptors/api/gitlab-vuepress2/gitlabvuepress2ApiAdaptor.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

const useGitlabvuepress2Api = async (key: string, newCfg?: Gitlabvuepress2Config) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-gitlab-hexo-api")

  // 记录开始使用 Hexo API
  logger.info("Start using Gitlabvuepress2 API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: Gitlabvuepress2Config
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<Gitlabvuepress2Config>(setting[key], {} as Gitlabvuepress2Config)

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Hexo API 的 URL、认证令牌和其他配置信息
      const githubUsername = Utils.emptyOrDefault(process.env.VITE_GITLAB_USERNAME, "")
      const githubAuthToken = Utils.emptyOrDefault(process.env.VITE_GITLAB_AUTH_TOKEN, "")
      const githubRepo = Utils.emptyOrDefault(process.env.VITE_GITLAB_REPO, "")
      const githubBranch = Utils.emptyOrDefault(process.env.VITE_GITLAB_BRANCH, "main")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new Gitlabvuepress2Config(githubUsername, githubAuthToken, githubRepo, githubBranch, middlewareUrl)
      cfg.mdFilenameRule = "[slug].md"
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

  // 文件规则
  // 推荐别名。但是不强制使用
  // cfg.mdFilenameRule = "[slug].md"
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
  cfg.placeholder.knowledgeSpaceReadonlyModeTip =
    "Gitlabvuepress2 平台暂不支持修改发布目录，如需修改，请删除之后重新发布"
  cfg.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true

  // 创建 Hexo 的 yamlAdaptor
  const yamlAdaptor = new Gitlabvuepress2YamlConverterAdaptor()

  // 创建 Hexo API 适配器
  const blogApi = new Gitlabvuepress2ApiAdaptor(appInstance, cfg)
  logger.info("Gitlabvuepress2 API created successfully.", cfg)

  return {
    cfg,
    yamlAdaptor,
    blogApi,
  }
}

export { useGitlabvuepress2Api }
