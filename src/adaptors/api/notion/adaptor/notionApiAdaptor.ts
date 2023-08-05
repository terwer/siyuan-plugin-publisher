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

import { UserBlog } from "zhi-blog-api"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/config/notionConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * Notion API 适配器
 */
class NotionApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: NotionConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("notion-api-adaptor")
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    // https://developers.notion.com/reference/post-search
    const headers = {
      Authorization: `Bearer ${this.cfg.password}`,
      "Notion-Version": "2022-06-28",
    }
    const params = {
      page_size: 10,
      filter: {
        value: "page",
        property: "object",
      },
    }
    const searchResp = await this.proxyFetch("/search", [headers], params, "POST", "application/json")
    this.logger.debug("notion searchResp=>", searchResp)
    if (searchResp?.status === 401) {
      throw new Error(searchResp?.message)
    }
    const pages = searchResp.results as any
    this.logger.debug("notion pages=>", pages)

    // https://stackoverflow.com/a/75537092/4037224
    if (pages.length === 0) {
      throw new Error(
        "no shared page linked to your connection, you must have at least one page as root page, see more at: https://stackoverflow.com/a/75537092/4037224"
      )
    }

    // 数据适配
    pages.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.id
      const titles = item?.properties?.title?.title ?? []
      userblog.blogName = titles.map((x: any) => x.plain_text).join("")
      userblog.url = item.public_url
      result.push(userblog)
    })
    this.logger.debug("get usersBlogs result=>", result)

    return result
  }
}

export { NotionApiAdaptor }
