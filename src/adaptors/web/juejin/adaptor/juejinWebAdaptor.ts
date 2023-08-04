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

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"

/**
 * 掘金网页授权适配器
 *
 * @see [wechatsync juejin adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/Juejin.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class JuejinWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.proxyFetch("https://api.juejin.cn/user_api/v1/user/get")
    const flag = !!res.data.user_id
    this.logger.info(`get juejin metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.data.user_id,
      title: res.data.user_name,
      avatar: res.data.avatar_large,
      type: "juejin",
      displayName: "掘金",
      raw: res.data,
      supportTypes: ["markdown", "html"],
      home: "https://juejin.cn/editor/drafts",
      icon: "https://juejin.cn/favicon.ico",
    }
  }
}

export { JuejinWebAdaptor }
