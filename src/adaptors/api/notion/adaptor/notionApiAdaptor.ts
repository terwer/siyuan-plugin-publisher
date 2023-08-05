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

import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/config/notionConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ObjectUtil, StrUtil } from "zhi-common"

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

    const pages = await this.getPages()
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

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    return super.newPost(post)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    return await super.editPost(postid, post)
  }

  public async deletePost(postid: string): Promise<boolean> {
    return await super.deletePost(postid)
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    return await super.getPost(postid)
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const pages: any[] = await this.getPages()
    if (pages && pages.length > 0) {
      pages.forEach((item: any) => {
        const cat = new CategoryInfo()
        cat.categoryId = item.id
        const titles = item?.properties?.title?.title ?? []
        cat.categoryName = titles.map((x: any) => x.plain_text).join("")
        cat.description = cat.categoryName
        cat.categoryDescription = cat.categoryName
        cat.htmlUrl = item.public_url
        cats.push(cat)
      })
    }

    return cats
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const purl = this.cfg.previewUrl ?? ""
    const postUrl = purl.replace("[postid]", postid)
    return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  // ================
  // private methods
  // ================
  private async getPages(): Promise<any[]> {
    const params = {
      page_size: 10,
      filter: {
        value: "page",
        property: "object",
      },
    }
    const searchResp = await this.notionRequest("/search", params, "POST")
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

    return pages
  }

  /**
   * 向Notion请求数据
   *
   * @param url 请求地址
   * @param params 数据
   * @param method 请求方法 GET | POST | PUT | DELETE
   * @private
   */
  private async notionRequest(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST"
  ): Promise<any> {
    const contentType = "application/json"
    // https://developers.notion.com/reference/post-search
    const headers = {
      "Content-Type": contentType,
      Authorization: `Bearer ${this.cfg.password}`,
      "Notion-Version": "2022-06-28",
    }

    // 打印日志
    this.logger.debug("向Notion请求数据，url =>", url)
    this.logger.debug("向Notion请求数据，params =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? {} : params
    const resJson = await this.proxyFetch(url, [headers], body, method, contentType)
    this.logger.debug("向Notion请求数据，resJson =>", resJson)

    if (resJson?.status === 401) {
      throw new Error(resJson?.message)
    }

    return resJson
  }
}

export { NotionApiAdaptor }
