/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Attachment, CategoryInfo, MediaObject, Post, UserBlog } from "zhi-blog-api"
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
    return await this.updatePage(confluencePostidKey.pageId, post.title, post.description, confluencePostidKey.spaceKey)
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

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    let resJson: any
    // pageId
    const post = mediaObject.post
    const confluencePostidKey = this.getConfluencePostidKey(post.postid)
    const pageId = confluencePostidKey.pageId
    if (!pageId) {
      throw new Error("Error uploading image to confluence: no pageId found")
    }
    // fileName
    let fileName: any
    try {
      // bits
      const bits = mediaObject.bits
      this.logger.debug("newMediaObject on confluence =>", mediaObject)
      const url = `/rest/api/content/${pageId}/child/attachment`
      // formData
      const blob = new Blob([bits], { type: mediaObject.type })
      const formData = new FormData()
      formData.append("id", pageId)
      formData.append("file", blob, mediaObject.name)
      formData.append("minorEdit", "false")
      resJson = await this.confluenceMediaFetch(url, formData)
      this.logger.debug("confluence upload media finished=>", resJson)
    } catch (e) {
      // 检查message中是否包含重复文件的关键词
      const errorMessage = e.message
      if (errorMessage.includes("same file name as an existing attachment")) {
        // 提取重复的文件名
        const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"]
        // 在字符串中 \S 需要转义为 \\S
        const pattern = new RegExp(`attachment: (\\S+\\.(?:${imageExtensions.join("|")}))`, "i")
        const match = errorMessage.match(pattern)
        // 如果上面的方法不行，尝试更简单直接的方法
        if (!match) {
          // 方法2：使用字符串分割
          const startIndex = errorMessage.indexOf("attachment: ") + 12
          const endIndex = errorMessage.indexOf(". Log referral")
          if (startIndex > 11 && endIndex > startIndex) {
            fileName = errorMessage.substring(startIndex, endIndex)
          }
        } else {
          fileName = match[1]
        }
        this.logger.debug("get duplicate file：" + fileName)
      } else {
        this.logger.error("Error uploading image to confluence:", e)
        throw new Error("Error uploading image to confluence:" + e.toString())
      }
    }
    this.logger.debug("newMediaObject success, start update metadata to page=>", resJson)
    // 正常情况从返回信息取图片
    if (!fileName) {
      const results = resJson.results || []
      if (results.length <= 0) {
        throw new Error("Error uploading image to confluence: no attachment id found")
      }
      const first = results[0]
      // 从附件响应中提取文件名
      fileName = first.title
    }

    // 构建图片宏
    const imageMacro = `<p><ac:image ac:height="250"><ri:attachment ri:filename="${fileName}" /></ac:image></p>`
    return {
      macro: imageMacro,
    }
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
      expand: "ancestors",
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
  private async updatePage(pageId: string, title: string, content: string, spaceKey?: string): Promise<boolean> {
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

  public async confluenceMediaFetch(url: string, formData: any = undefined) {
    try {
      const contentType = "application/json"
      const apiUrl = `${this.cfg.apiUrl}${url}`
      const header = {
        Authorization: `Bearer ${this.cfg.password}`,
        // CF tunnels
        "X-Atlassian-Token": "no-check",
        // Origin: this.cfg.apiUrl,
        // Referer: this.cfg.apiUrl,
        // Accept: "application/json",
      }
      this.logger.debug(`向 Confluence 请求数据上传文件，apiUrl => header:${header}`, apiUrl)
      return await this.apiFetch(apiUrl, [header], formData, "POST", contentType, true, "base64")
    } catch (error) {
      this.logger.error("Confluence 上传文件 API 请求异常 =>", error)
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
          '<ac:structured-macro ac:name="code">',
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
