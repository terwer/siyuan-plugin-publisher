/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { CategoryTypeEnum, PageTypeEnum } from "zhi-blog-api"

/**
 * Halo 配置
 */
class HaloConfig extends CommonBlogConfig {
  /**
   * Halo 配置项
   *
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 代理地址
   */
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("", "", username, password, middlewareUrl)

    this.home = "[your-halo-home]"
    this.apiUrl = "[your-halo-api-url]"
    this.previewUrl = "/archives/{slug}"
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

export { HaloConfig }
