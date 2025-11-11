/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * 墨滴配置
 */
class MdniceConfig extends CommonWebConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://mdnice.com", "https://mdnice.com/api", username, password, middlewareUrl)
    this.previewUrl = "/post/[postid]"
    this.pageType = PageTypeEnum.Html
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = true
    this.tagEnabled = true // Assuming tags are supported on Mdnice
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "文章"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于墨滴平台的限制，暂时不支持编辑所属文章。如果您想移动文档，请先取消删除该文档，然后重新选择新的文章发布"
  }
}

export { MdniceConfig }
