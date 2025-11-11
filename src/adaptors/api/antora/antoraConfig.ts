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
 * Antora 配置
 */
class AntoraConfig extends CommonGithubConfig {
  constructor(
    githubUsername: string,
    githubAuthToken: string,
    githubRepo: string,
    githubBranch: string,
    middlewareUrl?: string
  ) {
    super(githubUsername, githubAuthToken, githubRepo, githubBranch, middlewareUrl)

    // 设置Antora的预览URL，使用文档ID作为文档预览的URL参数
    this.previewUrl = "/docs/[docid]"
    // 设置页面类型为Markdown或其他适用的类型
    this.pageType = PageTypeEnum.Markdown
    // 设置密码类型，使用GitHub令牌来管理密码
    this.passwordType = PasswordType.PasswordType_Token
    // 是否启用标签
    this.tagEnabled = true
    // 是否启用分类
    this.cateEnabled = true
    // 是否启用知识空间
    this.knowledgeSpaceEnabled = true
    // 知识空间的标题
    this.knowledgeSpaceTitle = "文档库"
    // 知识空间的类型，可以根据实际情况选择
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Tree_Single
    // 是否允许更改知识空间
    this.allowKnowledgeSpaceChange = false
    // 设置知识空间只读模式的提示
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于Antora平台的限制，暂时不支持编辑所属文档库。如需修改，请删除之后重新发布。"
  }
}

export { AntoraConfig }
