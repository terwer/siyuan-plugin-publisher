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

import { WebAuthApi } from "~/src/adaptors/web/base/web/WebAuthApi.ts"

/**
 * 知乎网页授权适配器
 *
 * @see [wechatsync zhihu adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/%40wechatsync/drivers/src/zhihu.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class ZhihuWebAdaptor extends WebAuthApi {
  // /**
  //  * 初始化知乎 API 适配器
  //  *
  //  * @param appInstance 应用实例
  //  * @param cfg 配置项
  //  */
  // constructor(appInstance: AppInstance, cfg: ZhihuConfig) {
  //   super(appInstance, cfg)
  //
  //   this.cfg = cfg
  //   this.logger = createAppLogger("zhihu-web-adaptor")
  // }

  public async getMetaData(): Promise<any> {
    const res = await this.proxyFetch(
      "https://www.zhihu.com/api/v4/me?include=account_status%2Cis_bind_phone%2Cis_force_renamed%2Cemail%2Crenamed_fullname"
    )
    const flag = !!res.uid
    this.logger.info(`get zhihu metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.uid,
      title: res.name,
      avatar: res.avatar_url,
      supportTypes: ["html"],
      type: "zhihu",
      displayName: "知乎",
      home: "https://www.zhihu.com/settings/account",
      icon: "https://static.zhihu.com/static/favicon.ico",
    }
  }

  // public async getPreviewUrl(postid: string): Promise<string> {
  //   return Promise.resolve(`https://zhuanlan.zhihu.com/p/${postid}`)
  // }
}

export { ZhihuWebAdaptor }
