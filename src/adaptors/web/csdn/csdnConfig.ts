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
 * CSDN配置
 */
export class CsdnConfig extends CommonWebConfig {
  public logoutUrl: string

  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://blog.csdn.net", "https://bizapi.csdn.net", username, password, middlewareUrl)

    this.logoutUrl = "https://passport.csdn.net/account/logout"
    this.previewUrl = "/[userid]/article/details/[postid]"
    this.pageType = PageTypeEnum.Markdown
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Cookie
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
  }
}
