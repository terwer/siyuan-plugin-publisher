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
import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * 豆瓣配置
 */
class DoubanConfig extends CommonWebConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://www.douban.com", "https://www.douban.com", username, password, middlewareUrl)

    // 设置豆瓣的预览URL，使用博客ID作为博客预览的URL参数
    this.previewUrl = "/note/[noteid]"
    // 设置页面类型为Markdown或其他适用的类型
    this.pageType = PageTypeEnum.Markdown
    // 设置密码类型，使用Cookie来管理密码
    this.passwordType = PasswordType.PasswordType_Cookie
    // 是否启用用户名
    this.usernameEnabled = true
    // 是否启用标签
    this.tagEnabled = true
    // 是否启用分类
    this.cateEnabled = true
    // 是否启用知识空间
    this.knowledgeSpaceEnabled = false
  }
}

export { DoubanConfig }
