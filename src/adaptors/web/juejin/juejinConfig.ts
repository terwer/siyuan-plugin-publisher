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
 * 掘金配置
 */
export class JuejinConfig extends CommonWebConfig {
  public logoutUrl: string


  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://juejin.cn", "https://api.juejin.cn", username, password, middlewareUrl)

    this.logoutUrl = "https://juejin.cn/passport/web/logout"
    this.previewUrl = "/post/[postid]"
    this.pageType = PageTypeEnum.Markdown
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = false
    this.tagEnabled = false
    this.tagSlugEnabled = true
    this.cateEnabled = false
    this.categoryType = CategoryTypeEnum.CategoryType_Single
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "分类"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = true
    // 原生图片上传（字节 veImageX 直传）+ 外链图片（实测外链 URL 原样保留不转存）
    // 双通道均可用：PicGo 外链图床 / 平台图床，默认平台图床
    this.picgoPicbedSupported = true
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}
