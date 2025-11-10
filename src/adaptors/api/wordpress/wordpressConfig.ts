/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { CategoryTypeEnum, PageTypeEnum } from "zhi-blog-api"
import WordpressUtils from "~/src/adaptors/api/wordpress/wordpressUtils.ts"

/**
 * WordPress 配置
 *
 * @author terwer
 * @since 1.0.0
 */
class WordpressConfig extends MetaweblogConfig {
  /**
   * WordPress 配置项
   *
   * @param homeAddr WordPress 主页
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 代理地址
   */
  constructor(homeAddr: string, username: string, password: string, middlewareUrl?: string) {
    super(homeAddr, "", username, password, middlewareUrl)

    const { home, apiUrl } = WordpressUtils.parseHomeAndUrl(homeAddr)
    this.home = home
    this.apiUrl = apiUrl
    this.previewUrl = "/?p=[postid]"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = true
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
  }
}

export { WordpressConfig }
