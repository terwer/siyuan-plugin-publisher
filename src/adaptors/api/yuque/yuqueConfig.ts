/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PageTypeEnum, PasswordType } from "zhi-blog-api"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"

/**
 * Yuque 配置
 */
class YuqueConfig extends CommonBlogConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://www.yuque.com/", "https://www.yuque.com/api/v2", username, password, middlewareUrl)

    this.tokenSettingUrl = "https://www.yuque.com/settings/tokens"
    this.showTokenTip = true
    this.previewUrl = "/[notebook]/[postid]"
    this.pageType = PageTypeEnum.Markdown
    this.usernameEnabled = true
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "知识库"
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于语雀平台的限制，暂时不支持编辑所属知识库。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的知识库发布"
  }
}

export { YuqueConfig }
