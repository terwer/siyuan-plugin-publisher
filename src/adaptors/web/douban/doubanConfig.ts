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
 * 豆瓣配置
 */
class DoubanConfig extends CommonWebConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://www.douban.com", "https://www.douban.com", username, password, middlewareUrl)

    // 设置豆瓣的预览URL，使用博客ID作为博客预览的URL参数
    this.previewUrl = "/note/[noteid]"
    // 设置页面类型为Markdown或其他适用的类型
    this.pageType = PageTypeEnum.Markdown
    // 设置密码类型，使用Cookie来管理密码
    this.passwordType = PasswordType.PasswordType_Cookie
    // 是否启用用户名
    this.usernameEnabled = true
    // 是否启用标签
    this.tagEnabled = true
    // 是否启用分类
    this.cateEnabled = true
    // 是否启用知识空间
    this.knowledgeSpaceEnabled = false
  }
}

export { DoubanConfig }
