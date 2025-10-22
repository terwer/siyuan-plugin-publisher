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

import { PageTypeEnum, PasswordType } from "zhi-blog-api"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"

/**
 * Confluence 配置
 */
class ConfluenceConfig extends CommonBlogConfig {
  constructor(home: string, apiUrl: string, password: string, middlewareUrl?: string) {
    super(home, apiUrl, "", password, middlewareUrl)

    this.tokenSettingUrl = home + "/wiki/users/viewmyprofile.action"
    this.showTokenTip = true
    this.previewUrl = "/wiki/spaces/[spaceKey]/pages/[postid]"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "空间"
    this.allowKnowledgeSpaceChange = true
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于 Confluence 平台的限制，暂时不支持编辑所属空间。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的空间发布"
  }
}

export { ConfluenceConfig }
