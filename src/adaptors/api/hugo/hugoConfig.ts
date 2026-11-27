/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { CONTENT_LAYOUT_SINGLE } from "~/src/adaptors/api/base/contentLayout.ts"
import type { ContentLayout } from "~/src/adaptors/api/base/contentLayout.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * Hugo 配置
 *
 * @author terwer
 * @since 1.14.0
 */
class HugoConfig extends CommonGithubConfig {
  /**
   * 内容组织方式：单文件（默认）或页面目录（Leaf Bundle）。
   *
   * 该字段由 Hugo 族适配器消费；默认值保证唤醒旧配置时行为不变。
   */
  public contentLayout: ContentLayout

  /**
   * 当前平台是否支持页面目录（Leaf Bundle）。
   *
   * 只作为配置页渲染开关：非 Hugo 族不应出现「内容组织方式」选项。
   */
  public pageBundleSupported: boolean

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
    this.defaultPath = "content/post"
    this.previewUrl = "/[user]/[repo]/blob/[branch]/[docpath]"
    this.previewPostUrl = "/post/[postid].html"
    this.mdFilenameRule = "[slug].md"
    this.imageStorePath = "static/images"
    this.imageLinkPath = "images"
    this.contentLayout = CONTENT_LAYOUT_SINGLE
    this.pageBundleSupported = true
    this.pageType = PageTypeEnum.Markdown
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = true
    this.cateEnabled = true
    this.allowCateChange = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.knowledgeSpaceEnabled = true
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip = "Hugo 平台暂不支持修改发布目录，如需修改，请删除之后重新发布"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
  }
}

export { HugoConfig }
