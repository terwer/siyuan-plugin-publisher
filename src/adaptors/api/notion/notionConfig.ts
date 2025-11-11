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
 * Notion 配置
 */
class NotionConfig extends CommonBlogConfig {
  constructor(password: string, middlewareUrl?: string) {
    super("https://www.notion.so/", "https://api.notion.com/v1", "", password, middlewareUrl)

    this.tokenSettingUrl = "https://www.notion.so/my-integrations"
    this.showTokenTip = true
    this.previewUrl = "/[postid]"
    this.pageType = PageTypeEnum.Markdown
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "根页面"
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于Notion平台的限制，暂时不支持编辑所属父页面。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的根页面发布"
    this.cateSearchEnabled = true
  }
}

export { NotionConfig }
