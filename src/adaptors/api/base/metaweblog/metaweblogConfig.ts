/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
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
    this.useMdFilename = false
    this.usePathCategory = false
  }
}
