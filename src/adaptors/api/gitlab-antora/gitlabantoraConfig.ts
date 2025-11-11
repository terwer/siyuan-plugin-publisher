/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

/**
 * Gitlab Antora 配置
 */
class GitlabantoraConfig extends HexoConfig {
  constructor(
    githubUsername: string,
    githubAuthToken: string,
    githubRepo: string,
    githubBranch: string,
    middlewareUrl?: string
  ) {
    super(githubUsername, githubAuthToken, githubRepo, githubBranch, middlewareUrl)

    // 设置Gitlab Antora的预览URL，使用文档ID作为文档预览的URL参数
    this.previewUrl = "/docs/[docid]"
    // 设置页面类型为Markdown或其他适用的类型
    this.pageType = PageTypeEnum.Markdown
    // 设置密码类型，使用Gitlab令牌来管理密码
    this.passwordType = PasswordType.PasswordType_Token
    // 是否启用标签
    this.tagEnabled = true
    // 是否启用分类
    this.cateEnabled = true
    // 是否启用知识空间
    this.knowledgeSpaceEnabled = true
    // Gitlab Antora的主页URL
    this.home = "[your-gitlab-antora-home]"
    // Gitlab Antora的API URL
    this.apiUrl = "[your-gitlab-antora-api-url]"
    // Gitlab Antora令牌设置URL
    this.tokenSettingUrl = `[your-gitlab-antora-host]/${GITLAB_CONSTANTS.TOKEN_SETTING_URL}`
    // 是否显示令牌提示
    this.showTokenTip = true
    // 设置默认发布路径
    this.defaultPath = "source/_posts"
    // 设置知识空间只读模式的提示
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "Gitlab Antora 平台暂不支持修改发布目录，如需修改，请删除之后重新发布"
    // 知识空间的类型，可以根据实际情况选择
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
  }
}

export { GitlabantoraConfig }
