/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"

/**
 * B站配置
 *
 * @author terwer
 * @since 1.31.0
 */
class BilibiliConfig extends CommonWebConfig {
  public logoutUrl: string

  constructor(password: string, middlewareUrl?: string) {
    super("https://www.bilibili.com/opus", "https://api.bilibili.com", "", password, middlewareUrl)

    // 方便过期之后退出
    this.logoutUrl = "https://passport.bilibili.com/login"
    // 预览地址
    this.previewUrl = "/[postid]"
    // 使用 md 发布
    this.pageType = PageTypeEnum.Markdown
    // cookie 模式不启用用户名
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Cookie
    // 标签
    this.tagEnabled = false
    // B站使用单选分类作为专栏(文集)
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "文集"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = true
    // 关闭知识空间
    this.knowledgeSpaceEnabled = false
    // 图床配置
    this.picgoPicbedSupported = false
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}

export { BilibiliConfig }
