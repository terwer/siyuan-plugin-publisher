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
import { PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * 微信公众号配置
 */
export class WechatConfig extends CommonWebConfig {
  public logoutUrl: string

  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://mp.weixin.qq.com", "https://mp.weixin.qq.com/cgi-bin/appmsg", username, password, middlewareUrl)

    this.logoutUrl = "https://mp.weixin.qq.com/cgi-bin/logout"
    this.previewUrl =
      "/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=[postid]&token=[token]&lang=zh_CN"
    this.pageType = PageTypeEnum.Html
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = false
  }
}
