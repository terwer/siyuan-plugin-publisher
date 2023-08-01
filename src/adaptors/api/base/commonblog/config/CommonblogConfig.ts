import { BlogConfig, PageTypeEnum } from "zhi-blog-api"
import { MetaweblogPlaceholder } from "~/src/adaptors/api/base/metaweblog/config/MetaweblogPlaceholder.ts"
import { CommonblogPlaceholder } from "~/src/adaptors/api/base/commonblog/config/CommonblogPlaceholder.ts"

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
export class CommonblogConfig extends BlogConfig {
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
   * token设置地址
   */
  public override tokenSettingUrl = ""

  /**
   * 操作提示
   */
  public override placeholder = {} as CommonblogPlaceholder

  /**
   * 代理地址
   */
  public override middlewareUrl = ""

  /**
   * 是否启用用户名
   */
  public usernameEnabled = false

  constructor(home: string, apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super()
    this.home = home
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
    this.apiStatus = false
    this.blogid = ""
    this.blogName = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageTypeEnum.Markdown
    this.placeholder = new MetaweblogPlaceholder()
    this.middlewareUrl = middlewareUrl
    this.usernameEnabled = false
  }
}
