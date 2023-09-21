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
