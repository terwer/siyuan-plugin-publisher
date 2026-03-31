/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum, PageTypeEnum, PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"

/**
 * Docsify 配置
 *
 * @author terwer
 * @since 1.40.0
 */
class DocsifyConfig extends CommonGithubConfig {
  constructor(
    githubUsername: string,
    githubAuthToken: string,
    githubRepo: string,
    githubBranch: string,
    middlewareUrl?: string
  ) {
    super(githubUsername, githubAuthToken, githubRepo, githubBranch, middlewareUrl)

    this.tokenSettingUrl = "https://github.com/settings/tokens"
    this.showTokenTip = true
    this.defaultPath = "docs"
    this.previewUrl = "/[user]/[repo]/blob/[branch]/[docpath]"
    this.previewPostUrl = "/#/post/[postid]"
    this.mdFilenameRule = "[slug].md"
    this.imageStorePath = "docs/images"
    this.imageLinkPath = "/images"
    this.pageType = PageTypeEnum.Markdown
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.allowCateChange = false
    this.knowledgeSpaceEnabled = true
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "Docsify 平台暂不支持修改发布目录，如需修改，请删除之后重新发布"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}

export { DocsifyConfig }
