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
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ObjectUtil, StrUtil } from "zhi-common"
import { NotionMarkdownConverter } from "zhi-notion-markdown"

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
    const pageId = post.cate_slugs?.[0] ?? this.cfg.blogid
    return await this.createPage(post.title, post.description, pageId)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    return await this.updatePage(postid, post.title, post.description)
  }

  public async deletePost(postid: string): Promise<boolean> {
    const notionPostidKey = this.getNotionPostidKey(postid)
    return await this.deletePage(notionPostidKey.pageId)
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const notionPostidKey = this.getNotionPostidKey(postid)
    const notionPage = await this.getPage(notionPostidKey.pageId)
    this.logger.debug("notionPage=>", notionPage)
    this.logger.debug("postid=>", postid)
    const commonPost = new Post()
    const titles = notionPage?.properties?.title?.title ?? []
    commonPost.title = titles.map((x: any) => x.plain_text).join("")
    commonPost.description = "暂不支持Notion正文"

    // notion根页面
    const parentPageId = notionPage?.parent?.page_id
    const catSlugs = []
    catSlugs.push(parentPageId)
    commonPost.cate_slugs = catSlugs

    return commonPost
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
    const notionPostKey = this.getNotionPostidKey(postid)
    // const pageId = notionPostKey.pageId
    const endUrl = notionPostKey.endUrl
    const postUrl = purl.replace("[postid]", endUrl)
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
    const resp = await this.notionRequest("/search", params, "POST")
    const pages = resp.results as any
    this.logger.debug("notion pages=>", pages)

    // https://stackoverflow.com/a/75537092/4037224
    if (pages.length === 0) {
      throw new Error(
        "no shared page linked to your connection, you must have at least one page as root page, see more at: https://stackoverflow.com/a/75537092/4037224"
      )
    }

    return pages
  }

  // https://developers.notion.com/reference/post-page
  private async createPage(title: string, markdownText: string, parentPageId?: string) {
    // 如果没传递过来就用默认的父页面
    const page_id = parentPageId ?? this.cfg.blogid
    const notionObject = NotionMarkdownConverter.markdownToNotion(markdownText)
    const params = {
      parent: { page_id: page_id },
      properties: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      children: notionObject,
    }
    this.logger.debug("before createPage =>", { markdownText, notionObject })
    const resp = await this.notionRequest("/pages", params, "POST")
    if (resp.object !== "page") {
      throw new Error("Notion create page error")
    }

    // 保存url，否则后面打不开
    const url = resp.url
    const endUrl = url.split("/").slice(-1)[0]
    return `${resp.id}_${endUrl}`
  }

  private async deletePage(pageId: string): Promise<boolean> {
    this.logger.debug("before deletePage, pageId=>", pageId)
    const url = `/pages/${pageId}`
    const params = {
      archived: true,
    }
    const resp = await this.notionRequest(url, params, "PATCH")
    if (resp.object !== "page") {
      throw new Error("Notion delete page error")
    }
    return resp.archived
  }

  private async updatePage(pageId: string, title: string, markdownText: string) {
    let flag = true
    if (flag) {
      throw new Error("Notion是基于块的API，暂时不支持更新，如需更新，请删除之后重新发布")
    }
    return false
  }

  private async getPage(pageId: string): Promise<any> {
    this.logger.debug("before getPage, pageId=>", pageId)
    const url = `/pages/${pageId}`
    const resp = await this.notionRequest(url, {}, "GET")
    if (resp.object !== "page") {
      throw new Error("Notion get page error")
    }
    return resp
  }

  /**
   * 获取封装的postid
   *
   * @param postid
   * @private postid
   */
  private getNotionPostidKey(postid: string): any {
    let pageId: string
    let endUrl: string
    if (postid.indexOf("_") > 0) {
      const idArr = postid.split("_")
      pageId = idArr[0]
      endUrl = idArr[1]
    } else {
      pageId = postid
    }

    return {
      pageId: pageId,
      endUrl: endUrl,
    }
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
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST"
  ): Promise<any> {
    const contentType = "application/json"
    // https://developers.notion.com/reference/post-search
    const headers = {
      "Content-Type": contentType,
      Authorization: `Bearer ${this.cfg.password}`,
      "Notion-Version": "2022-06-28",
    }

    // 打印日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向Notion请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向Notion请求数据，params =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? {} : params
    const resJson = await this.proxyFetch(apiUrl, [headers], body, method, contentType)
    this.logger.debug("向Notion请求数据，resJson =>", resJson)

    if (resJson?.status === 400 || resJson?.status === 401 || resJson?.status === 404 || resJson?.status === 429) {
      throw new Error(resJson?.message)
    }

    return resJson
  }
}

export { NotionApiAdaptor }
