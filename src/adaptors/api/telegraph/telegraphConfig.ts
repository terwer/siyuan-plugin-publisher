/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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
import { PasswordType } from "zhi-blog-api"

/**
 * 发布方式
 */
enum TelegraphPostType {
  // 匿名用户
  ANONYMOUS = "anonymous",
  // 登录用户
  LOGIN_USER = "user",
}

/**
 * Telegraph 配置
 */
class TelegraphConfig extends CommonBlogConfig {
  public postType: TelegraphPostType
  public accessToken: string
  public saveHash: string
  public forceReAuth: boolean

  constructor(telegraphUrl: string, telegraphToken: string, middlewareUrl?: string) {
    super(telegraphUrl, "https://edit.telegra.ph", "", telegraphToken, middlewareUrl)

    this.postType = TelegraphPostType.ANONYMOUS
    this.previewUrl = "/[postid]"
    this.allowPreviewUrlChange = false
    this.forceReAuth = false
  }
}

export { TelegraphPostType, TelegraphConfig }
