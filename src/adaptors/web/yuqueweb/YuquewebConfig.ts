/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"

/**
 * 语雀网页版配置
 */
class YuquewebConfig extends CommonWebConfig {
  constructor(password = "", middlewareUrl?: string) {
    super("https://www.yuque.com", "https://www.yuque.com", "", password, middlewareUrl)

    this.previewUrl = "/{login}/{bookSlug}/{slug}"
    this.pageType = PageTypeEnum.Markdown
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Cookie
    this.passwordLabel = "Cookie"
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = false
    this.cateEnabled = false
    this.categoryType = CategoryTypeEnum.CategoryType_None
    this.allowCateChange = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "知识库"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = true
    this.picgoPicbedSupported = false
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}

export { YuquewebConfig }
