/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum, PageTypeEnum } from "zhi-blog-api"
import { MetaweblogPlaceholder } from "~/src/adaptors/api/base/metaweblog/metaweblogPlaceholder.ts"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"

/**
 * Metaweblog配置类
 */
export class MetaweblogConfig extends CommonBlogConfig {
  /**
   * 首页
   */
  public override home = ""

  /**
   * API地址
   */
  public override apiUrl = ""
  /**
   * 用户名
   */
  public override username = ""
  /**
   * 密码
   */
  public override password = ""

  /**
   * 是否发布
   */
  public override apiStatus = false

  /**
   * 博客ID
   */
  public override blogid = ""

  /**
   * 博客名（API获取）
   */
  public override blogName = ""

  /**
   * 文章别名key
   */
  public override posidKey = ""

  /**
   * 文章预览链接
   */
  public override previewUrl = ""

  /**
   * 文章类型
   */
  public override pageType = PageTypeEnum.Markdown

  /**
   * 操作提示
   */
  public override placeholder = {} as MetaweblogPlaceholder

  /**
   * 跨域请求代理
   */
  public override middlewareUrl = ""

  constructor(home: string, apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super(home, apiUrl, username, password, middlewareUrl)

    this.home = home
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
    this.apiStatus = false
    this.blogid = ""
    this.blogName = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageTypeEnum.Html
    this.middlewareUrl = middlewareUrl
    this.placeholder = new MetaweblogPlaceholder()
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
