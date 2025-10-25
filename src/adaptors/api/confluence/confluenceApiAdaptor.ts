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
import { ConfluenceConfig } from "~/src/adaptors/api/confluence/confluenceConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { ObjectUtil } from "zhi-common"
import { load } from "cheerio"

/**
 * Confluence API 适配器
 * @see [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/v1/intro/)
 */
class ConfluenceApiAdaptor extends BaseBlogApi {
  protected declare cfg: ConfluenceConfig

  constructor(appInstance: any, cfg: ConfluenceConfig) {
    super(appInstance, cfg)
    this.cfg = cfg
    this.logger = createAppLogger("confluence-api-adaptor")
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const spaces = await this.getSpaces()
    // 数据适配
    spaces.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.key
      userblog.blogName = item.name
      userblog.url = item.key
      result.push(userblog)
    })

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    // 确保最新的文章ID都包含了空间信息
    const spaceKey = post.cate_slugs?.[0] ?? this.cfg.blogid
    return await this.createPage(post.title, post.description, spaceKey)
  }

    public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        const confluencePostidKey = this.getConfluencePostidKey(postid)
        return await this.updatePage(
            confluencePostidKey.pageId,
            post.title,
            post.description,
            confluencePostidKey.spaceKey
        )
    }

    public async deletePost(postid: string): Promise<boolean> {
        const confluencePostidKey = this.getConfluencePostidKey(postid)
        return await this.deletePage(confluencePostidKey.pageId)
    }

    public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        const confluencePostidKey = this.getConfluencePostidKey(postid)

        const page = await this.getPage(confluencePostidKey.pageId)
        this.logger.debug("confluence page=>", page)

        const commonPost = new Post()
        commonPost.title = page.title
        commonPost.description = page.body?.storage?.value || ""

        // Confluence 空间
        const space = page.space
        const catSlugs = []
        catSlugs.push(space.key)
        commonPost.cate_slugs = catSlugs

        return commonPost
    }

    public async getCategories(): Promise<CategoryInfo[]> {
        const cats = [] as CategoryInfo[]

        const spaces: any[] = await this.getSpaces()
        if (spaces && spaces.length > 0) {
            spaces.forEach((space) => {
                const cat = new CategoryInfo()
                cat.categoryId = space.key
                cat.categoryName = space.name
                cat.description = space.name
                cat.categoryDescription = space.name
                cats.push(cat)
            })
        }

        return cats
    }

    public async getPreviewUrl(postid: string): Promise<string> {
        const purl = this.cfg.previewUrl ?? ""
        const confluencePostidKey = this.getConfluencePostidKey(postid)
        const pageId = confluencePostidKey.pageId
        const spaceKey = confluencePostidKey.spaceKey ?? this.cfg.blogid ?? ""
        const postUrl = purl.replace("[postid]", pageId).replace("[spaceKey]", spaceKey)
        return postUrl
    }

    // ================
    // private methods
    // ================

    /**
     * 获取 Confluence 空间列表
     */
    private async getSpaces() {
        const url = "/rest/api/space"
        const params = {
            limit: 100,
        }
        const result = await this.confluenceRequest(url, params, "GET")
        this.logger.debug("confluence spaces=>", result)
        return result.results || []
    }

    /**
     * 创建 Confluence 页面
     *
     * @param title 标题
     * @param content 内容（HTML格式）
     * @param spaceKey 空间key
     */
    private async createPage(title: string, content: string, spaceKey?: string): Promise<string> {
        const url = "/rest/api/content"
        const targetSpaceKey = spaceKey || this.cfg.blogid
        const parentPageId = this.cfg.parentPageId?.trim()
        const storageContent = this.normalizeContentForConfluence(content, title)

        const params: Record<string, any> = {
            type: "page",
            title: title,
            space: {
                key: targetSpaceKey,
            },
            body: {
                storage: {
                    value: storageContent,
                    representation: "storage",
                },
            },
        }

        if (parentPageId) {
            // 允许指定父页面以在其下创建新页面
            params["ancestors"] = [
                {
                    id: parentPageId,
                },
            ]
        }

        const result = await this.confluenceRequest(url, params, "POST")
        this.logger.debug("confluence createPage=>", result)

        if (!result || !result.id) {
            throw new Error("请求 Confluence API 异常")
        }

        // 包含了空间key需要返回标识空间的ID，否则更新可能报错
        if (targetSpaceKey) {
            return `${result.id}_${targetSpaceKey}`
        } else {
            return `${result.id}`
        }
    }

    public async getPagesBySpace(spaceKey: string): Promise<{ id: string; title: string }[]> {
        const url = "/rest/api/content"
        const params = {
            spaceKey,
            type: "page",
            limit: 200,
            expand: "ancestors"
        }
        const result = await this.confluenceRequest(url, params, "GET")
        this.logger.debug("confluence pages list=>", result)
        return (result?.results ?? []).map((item: any) => ({ id: item.id, title: item.title }))
    }

    /**
     * 更新 Confluence 页面
     *
     * @param pageId 页面ID
     * @param title 标题
     * @param content 内容（HTML格式）
     * @param spaceKey 空间key
     */
    private async updatePage(
        pageId: string,
        title: string,
        content: string,
        spaceKey?: string
    ): Promise<boolean> {
        // 先获取页面当前版本
        const page = await this.getPage(pageId)
        const currentVersion = page.version.number

        const url = `/rest/api/content/${pageId}`
        const storageContent = this.normalizeContentForConfluence(content, title)
        const params = {
            id: pageId,
            type: "page",
            title: title,
            version: {
                number: currentVersion + 1,
            },
            body: {
                storage: {
                    value: storageContent,
                    representation: "storage",
                },
            },
        }

        const result = await this.confluenceRequest(url, params, "PUT")
        if (!result) {
            throw new Error("请求 Confluence API 异常")
        }

        return true
    }

    /**
     * 获取 Confluence 页面
     *
     * @param pageId 页面ID
     */
    private async getPage(pageId: string): Promise<any> {
        const url = `/rest/api/content/${pageId}`
        const params = {
            expand: "body.storage,version,space",
        }
        const result = await this.confluenceRequest(url, params, "GET")

        if (!result) {
            throw new Error("请求 Confluence API 异常")
        }

        return result
    }

    /**
     * 删除 Confluence 页面
     *
     * @param pageId 页面ID
     */
    private async deletePage(pageId: string): Promise<boolean> {
        const url = `/rest/api/content/${pageId}`
        const result = await this.confluenceRequest(url, {}, "DELETE")

        if (!result) {
            throw new Error("请求 Confluence API 异常")
        }

        return true
    }

    /**
     * 获取封装的 postid
     *
     * @param postid
     */
    private getConfluencePostidKey(postid: string): any {
        let pageId: string
        let spaceKey: string

        if (postid.indexOf("_") > 0) {
            const idArr = postid.split("_")
            pageId = idArr[0]
            spaceKey = idArr[1]
        } else {
            pageId = postid
        }

        return {
            pageId,
            spaceKey,
        }
    }

  /**
   * 向 Confluence 请求数据
   *
   * @param url 请求地址
   * @param params 数据
   * @param method 请求方法 GET | POST | PUT | DELETE
   */
  private async confluenceRequest(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST"
  ): Promise<any> {
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Confluence 请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向 Confluence 请求数据，params =>", params)

    let finalUrl = apiUrl
    let body: string | undefined = undefined

    if (method === "GET" && params && !ObjectUtil.isEmptyObject(params)) {
      // GET 请求将参数放到 URL 中
      const queryParams = new URLSearchParams(params).toString()
      finalUrl = `${apiUrl}?${queryParams}`
    } else if (method !== "GET") {
      // POST/PUT/DELETE 请求将参数放到 body 中
      body = ObjectUtil.isEmptyObject(params) ? undefined : JSON.stringify(params)
    }

    // 使用原生 fetch 直接请求 Confluence API
    // 这样可以确保所有必要的请求头都被正确发送
    try {
      const contentType = "application/json"
      const header = {
        "Content-Type": contentType,
        Authorization: `Bearer ${this.cfg.password}`,
        // CF tunnels
        "X-Atlassian-Token": "no-check",
        // Origin: this.cfg.apiUrl,
        // Referer: this.cfg.apiUrl,
        // Accept: "application/json",
      }
      this.logger.debug("向 Confluence 请求数据，apiUrl =>", apiUrl)
      this.logger.debug("向 Confluence 请求数据，params =>", body)
      const resJson = await this.apiFetch(finalUrl, [header], body, method, contentType, true, "base64")
      // const response = await fetch(finalUrl, {
      //   method: method,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${this.cfg.password}`,
      //     // "X-Atlassian-Token": "no-check",
      //     Accept: "application/json",
      //   },
      //   body: body,
      //   credentials: "include",
      // })
      // this.logger.debug("Confluence API 响应状态 =>", response.status)
      //
      // if (!response.ok) {
      //   const errorText = await response.text()
      //   this.logger.error("Confluence API 请求失败 =>", errorText)
      //   throw new Error(`Confluence API 请求失败: ${response.status} ${response.statusText}`)
      // }
      //
      // const resJson = await response.json()
      this.logger.debug("向 Confluence 请求数据，resJson =>", resJson)
      return resJson
    } catch (error) {
      this.logger.error("Confluence API 请求异常 =>", error)
      throw error
    }
  }
  private normalizeContentForConfluence(content: string, pageTitle?: string): string {
    if (!content) {
      return content
    }

    try {
      const $ = load(content, { decodeEntities: false, xmlMode: true } as any)

      if (pageTitle) {
        const normalizedTitle = pageTitle.trim()
        const headingSelectors = ["h1", "h2"]
        for (const tag of headingSelectors) {
          const heading = $(tag)
            .filter((_, el) => $(el).text().trim() === normalizedTitle)
            .first()
          if (heading.length > 0) {
            heading.remove()
            break
          }
        }
      }

      $("pre").each((_, element) => {
        const pre = $(element)
        const codeElem = pre.children("code").first()

        const languageHints = [
          codeElem.attr("data-language"),
          codeElem.attr("data-subtype"),
          codeElem.attr("data-info"),
          pre.attr("data-language"),
          pre.attr("data-subtype"),
          pre.attr("data-info"),
          codeElem.attr("class"),
          pre.attr("class"),
        ]

        let language = ""
        for (const hint of languageHints) {
          if (!hint) {
            continue
          }
          const match = hint.match(/language-([\w#+-]+)/i)
          if (match) {
            language = match[1]
            break
          }
          if (/^[\w#+-]+$/i.test(hint)) {
            language = hint
            break
          }
        }

        const codeText = (codeElem.length > 0 ? codeElem.text() : pre.text())?.replace(/\r\n/g, "\n") ?? ""
        const sanitizedCode = codeText.replace(/]]>/g, "]]]]><![CDATA[>")

        const macroParts = [
          "<ac:structured-macro ac:name=\"code\">",
          language ? `<ac:parameter ac:name="language">${language}</ac:parameter>` : "",
          `<ac:plain-text-body><![CDATA[${sanitizedCode}]]></ac:plain-text-body>`,
          "</ac:structured-macro>",
        ]

        pre.replaceWith(macroParts.join(""))
      })

      const normalized = $.root().html() ?? content
      const restored = normalized
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
      return restored.replace(/<br>/g, "<br />")
    } catch (error) {
      this.logger.warn("Failed to normalize Confluence content, fallback to original", error)
      return content
    }
  }

}

export { ConfluenceApiAdaptor }
