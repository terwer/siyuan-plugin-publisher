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

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"

/**
 * B站配置
 *
 * @author terwer
 * @since 1.31.0
 */
class BilibiliConfig extends CommonWebConfig {
  public logoutUrl: string

  constructor(password: string, middlewareUrl?: string) {
    super("https://www.bilibili.com/opus", "https://api.bilibili.com", "", password, middlewareUrl)

    // 方便过期之后退出
    this.logoutUrl = "https://passport.bilibili.com/login"
    // 预览地址
    this.previewUrl = "/[postid]"
    // 使用 md 发布
    this.pageType = PageTypeEnum.Markdown
    // cookie 模式不启用用户名
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Cookie
    // 标签
    this.tagEnabled = false
    // B站使用单选分类作为专栏(文集)
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "文集"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = true
    // 关闭知识空间
    this.knowledgeSpaceEnabled = false
    // 图床配置
    this.picgoPicbedSupported = false
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}

export { BilibiliConfig }
