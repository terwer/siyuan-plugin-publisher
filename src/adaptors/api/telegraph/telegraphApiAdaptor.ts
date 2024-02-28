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

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { UserBlog } from "zhi-blog-api"
import { TelegraphConfig } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"

/**
 * Telegraph API 适配器
 *
 * @see https://telegra.ph/ telegra.ph
 */
class TelegraphApiAdaptor extends BaseBlogApi {
  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const checkJson = await this.telegraphRequest("/check", "page_id=0", "POST")
    if (checkJson.error) {
      throw new Error("telegraph request error =>" + checkJson.error)
    }
    this.logger.debug("checkJson =>", checkJson)

    // 数据适配
    const userblog: UserBlog = new UserBlog()
    const cfg = this.cfg as TelegraphConfig
    userblog.blogid = checkJson.save_hash
    userblog.blogName = "telegra.ph"
    userblog.url = cfg.apiUrl
    // 元数据映射
    // @since 1.20.0
    userblog.metadataMap = {
      password: checkJson.save_hash,
    }
    result.push(userblog)
    this.logger.debug("get telegraph cfg =>", result)

    return result
  }

  // ================
  // private methods
  // ================
  /**
   * 向 Telegraph 请求数据
   */
  private async telegraphRequest(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    header: Record<any, any> = {}
  ) {
    const contentType = "text/plain"
    const headers = {
      "Content-Type": contentType,
      origin: "https://telegra.ph",
      referer: "https://telegra.ph/",
      ...header,
    }

    // 输出日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Telegraph 请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向 Telegraph 请求数据，content =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = params
    const resJson = await this.proxyFetch(apiUrl, [headers], body, method, contentType)
    this.logger.debug("向 Telegraph 请求数据，resJson =>", resJson)

    return resJson ?? null
  }
}

export { TelegraphApiAdaptor }
