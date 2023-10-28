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
 * 印象笔记配置
 */
class YinxiangConfig extends CommonBlogConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://dev.yinxiang.com/doc/", "https://dev.yinxiang.com/doc/api/v2", username, password, middlewareUrl)

    this.tokenSettingUrl = "https://dev.yinxiang.com/doc/settings/tokens"
    this.showTokenTip = true
    this.previewUrl = "/notebook/[notebook]/note/[noteid]"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = true
    this.passwordType = PasswordType.PasswordType_Cookie
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "笔记本"
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于印象笔记平台的限制，暂时不支持编辑所属笔记本。如果您想移动笔记，请先取消删除该笔记，然后重新选择新的笔记本发布"
  }
}

export { YinxiangConfig }
