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

import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Post, UserBlog } from "zhi-blog-api"
import { ObjectUtil } from "zhi-common"
import { Base64 } from "js-base64"

/**
 * Halo API 适配器
 * @see [Halo API](https://github.com/halo-sigs/vscode-extension-halo/blob/main/src/service/index.ts)
 * @see [Halo docs](https://docs.halo.run/getting-started/install/docker-compose/)
 */
class HaloApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: HaloConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("halo-api-adaptor")
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const cates = await this.getHaloCategories()
    // 数据适配
    cates.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.spec.slug
      userblog.blogName = item.spec.displayName
      userblog.url = item.status.permalink
      result.push(userblog)
    })
    this.logger.debug("get halo categories =>", result)

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const url = ""

    return ""
  }

  // ================
  // private methods
  // ================
  private async getHaloCategories() {
    const categories = await this.haloRequest("/apis/content.halo.run/v1alpha1/categories", {}, "GET")
    return Promise.resolve(categories.items)
  }

  /**
   * 向 Halo 请求数据
   *
   * @param url 请求地址
   * @param params 数据
   * @param method 请求方法 GET | POST | PUT | DELETE
   * @private
   */
  private async haloRequest(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST"
  ): Promise<any> {
    const contentType = "application/json"
    const basicAuth = "Basic " + Base64.btoa(this.cfg.username + ":" + this.cfg.password)
    const headers = {
      "Content-Type": contentType,
      Authorization: basicAuth,
    }

    // 打印日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Halo 请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向 Halo 请求数据，params =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? "" : JSON.stringify(params)
    const resJson = await this.proxyFetch(apiUrl, [headers], body, method, contentType)
    this.logger.debug("向 Halo 请求数据，resJson =>", resJson)

    return resJson ?? null
  }
}

export { HaloApiAdaptor }
