/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"

/**
 * 博客园配置
 *
 * @author terwer
 * @since 0.9.0
 */
class CnblogsConfig extends MetaweblogConfig {
  /**
   * 博客园配置项
   *
   * @param apiUrl API 地址
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 代理地址
   */
  constructor(apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super("https://www.cnblogs.com/", apiUrl, username, password, middlewareUrl)

    this.tokenSettingUrl = "https://i.cnblogs.com/settings"
    this.previewUrl = "/[userid]/p/[postid].html"
    this.pageType = PageTypeEnum.Markdown
    this.usernameEnabled = true
    this.passwordType = PasswordType.PasswordType_Token
    this.showTokenTip = true
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
  }
}

export { CnblogsConfig }
