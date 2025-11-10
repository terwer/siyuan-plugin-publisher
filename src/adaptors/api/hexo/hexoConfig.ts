/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * Hexo 配置
 *
 * @author terwer
 * @since 1.3.2
 */
class HexoConfig extends CommonGithubConfig {
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
    this.defaultPath = "source/_posts"
    this.previewUrl = "/[user]/[repo]/blob/[branch]/[docpath]"
    this.previewPostUrl = "/post/[postid].html"
    this.mdFilenameRule = "[filename].md"
    this.imageStorePath = "source/images"
    this.imageLinkPath = "source/images"
    this.pageType = PageTypeEnum.Markdown
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = true
    this.cateEnabled = true
    this.allowCateChange = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.knowledgeSpaceEnabled = true
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip = "Hexo 平台暂不支持修改发布目录，如需修改，请删除之后重新发布"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
  }
}

export { HexoConfig }
