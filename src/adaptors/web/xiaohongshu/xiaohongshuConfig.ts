/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * 小红书配置
 */
class XiaohongshuConfig extends CommonWebConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://creator.xiaohongshu.com", "https://creator.xiaohongshu.com", username, password, middlewareUrl)

    this.previewUrl = "/p/[postid]"
    this.pageType = PageTypeEnum.Markdown
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = false
    // 小红书不支持标签
    this.tagEnabled = false
    // 小红书不支持分类
    this.cateEnabled = false
    // 小红书没有知识空间
    this.knowledgeSpaceEnabled = false
  }
}

export { XiaohongshuConfig }
