/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import {CategoryTypeEnum, PageTypeEnum} from "zhi-blog-api";

/**
 * Jvue 配置
 *
 * @author terwer
 * @since 1.20.0
 */
class JvueConfig extends MetaweblogConfig {
  /**
   * Jvue 配置项
   *
   * @param homeAddr 博客地址
   * @param apiUrl 博客api地址
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 中间件地址
   */
  constructor(homeAddr: string, apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super(homeAddr, apiUrl, username, password, middlewareUrl)

    this.home = homeAddr
    this.apiUrl = apiUrl
    this.previewUrl = "/post/[postid].html"
    this.pageType = PageTypeEnum.Markdown
    this.showTokenTip = false
    this.allowPreviewUrlChange = false
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
  }
}

export { JvueConfig }
