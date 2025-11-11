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
 * 吾爱破解配置
 */
class WuaipojieConfig extends CommonWebConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://www.52pojie.cn", "https://www.52pojie.cn/api", username, password, middlewareUrl)
    this.previewUrl = "/thread-[threadid]-1-1.html"
    this.pageType = PageTypeEnum.Html
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = true
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "帖子"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于吾爱破解平台的限制，暂时不支持编辑所属帖子。如果您想移动帖子，请先取消删除该帖子，然后重新选择新的帖子发布"
  }
}

export { WuaipojieConfig }
