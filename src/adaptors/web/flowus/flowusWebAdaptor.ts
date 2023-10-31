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
import { CategoryInfo } from "zhi-blog-api"

/**
 * Flowus网页授权适配器
 *
 * @see [Flowus](https://flowus.cn/)
 * @author terwer
 * @version 0.16.0
 * @since 0.16.0
 */
class FlowusWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.webProxyFetch("https://flowus.cn/api/users/me")
    const flag = res?.code === 200
    this.logger.info(`get flowus metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res?.data?.uuid,
      title: res?.data?.nickname,
      avatar: res?.data?.avatar,
      spaceViews: res?.data?.spaceViews,
      supportTypes: ["html"],
      type: "flowus",
      displayName: "Flowus 息流",
      home: "https://flowus.cn",
      icon: "https://cdn.allflow.cn/assets/favicon.png",
    }
  }

  // public async getCategories(keyword?: string): Promise<CategoryInfo[]> {
  //   const cats = [] as CategoryInfo[]
  //
  //   // const pages: any[] = await this.getPages(keyword)
  // }


  // ================
  // private methods
  // ================
}

export { FlowusWebAdaptor }
