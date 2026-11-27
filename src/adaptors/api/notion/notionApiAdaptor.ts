/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ObjectUtil } from "zhi-common"
import { chunkNotionBlocks, markdownToNotionBlocks } from "~/src/adaptors/api/notion/notionBlocks.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

/** Notion 限流（429）时的重试次数与基础等待时间 */
const NOTION_RATE_LIMIT_MAX_RETRIES = 2
const NOTION_RATE_LIMIT_RETRY_DELAY_MS = 1000

/**
 * Notion API 适配器
 */
class NotionApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: NotionConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("notion-api-adaptor")
  }

  public async getUsersBlogs(keyword?: string): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const pages = await this.getPages(keyword)
    // 数据适配
    pages.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.id
      const titles = item?.properties?.title?.title ?? []
      userblog.blogName = titles.map((x: any) => x.plain_text).join("")
      userblog.url = item.public_url
      result.push(userblog)
    })

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const pageId = post.cate_slugs?.[0] ?? this.cfg.blogid
    return await this.createPage(post.title, post.description, pageId)
  }

  public async editPost(oldPostid: string, post: Post, publish?: boolean): Promise<boolean> {
    await this.deletePost(oldPostid)
    const newPostid = await this.newPost(post)
    // ================================
    // 下面这一段是更新postid，需要注意适配
    // 写入属性到配置
    const { getSetting, updateSetting } = usePublishSettingStore()
    const setting = await getSetting()
    const posidKey = this.cfg.posidKey
    const id = post.originalId
    const postMeta = ObjectUtil.getProperty(setting, id, {})
    postMeta[posidKey] = newPostid
    setting[id] = postMeta
    await updateSetting(setting)
    // ==============================
    return true

    // Notion的原生更新不支持
    // return await this.updatePage(postid, post.title, post.description)
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    const notionPostidKey = this.getNotionPostidKey(postid)
    return await this.deletePage(notionPostidKey.pageId)
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const notionPostidKey = this.getNotionPostidKey(postid)
    const notionPage = await this.getPage(notionPostidKey.pageId)
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

  public async getCategories(keyword?: string): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const pages: any[] = await this.getPages(keyword)
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
    return postUrl
  }

  // ================
  // private methods
  // ================
  private async getPages(keyword?: string): Promise<any[]> {
    const params = {
      page_size: 10,
      query: keyword ?? "",
      filter: {
        value: "page",
        property: "object",
      },
    }
    const resp = await this.notionRequest("/search", params, "POST")
    const pages = resp.results as any

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
    // Notion 每次请求最多接收 100 个块，长文必须按批次写入。
    const [firstBatch, ...remainingBatches] = chunkNotionBlocks(markdownToNotionBlocks(markdownText))
    const params: any = {
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
    }
    if (firstBatch?.length) {
      params.children = firstBatch
    }
    const resp = await this.notionRequest("/pages", params, "POST")
    if (resp.object !== "page") {
      throw new Error("Notion create page error")
    }

    // 剩余块按顺序追加；任何一批失败都回滚整页，避免留下半篇文档。
    try {
      for (const batch of remainingBatches) {
        await this.appendBlockChildren(resp.id, batch)
      }
    } catch (error) {
      await this.archivePageQuietly(resp.id)
      throw error
    }

    // 保存url，否则后面打不开
    const url = resp.url
    const endUrl = url.split("/").slice(-1)[0]
    return `${resp.id}_${endUrl}`
  }

  /**
   * 按 Notion 单次请求上限追加子块，遇到限流（429）时做有限次退避重试。
   *
   * @see https://developers.notion.com/reference/patch-block-children
   */
  private async appendBlockChildren(pageId: string, children: any[], retry = 0): Promise<void> {
    try {
      const resp = await this.notionRequest(`/blocks/${pageId}/children`, { children }, "PATCH")
      if (resp?.object !== "list") {
        throw new Error("Notion append block children error")
      }
    } catch (error) {
      if (retry < NOTION_RATE_LIMIT_MAX_RETRIES && isNotionRateLimitError(error)) {
        await sleep(NOTION_RATE_LIMIT_RETRY_DELAY_MS * (retry + 1))
        return await this.appendBlockChildren(pageId, children, retry + 1)
      }
      throw error
    }
  }

  /**
   * 长文分块失败时尽力回滚已创建的页面；回滚失败不覆盖原始错误。
   */
  private async archivePageQuietly(pageId: string): Promise<void> {
    try {
      await this.deletePage(pageId)
    } catch (error) {
      this.logger.warn(`Notion 回滚未完成的页面失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async deletePage(pageId: string): Promise<boolean> {
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

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? undefined : JSON.stringify(params)
    const resJson = await this.apiFetch(apiUrl, [headers], body, method, contentType, true, "base64", "text")

    if (resJson?.status === 400 || resJson?.status === 401 || resJson?.status === 404 || resJson?.status === 429) {
      const error = new Error(resJson?.message ?? `Notion request failed (${resJson?.status})`) as Error & {
        status?: number
      }
      error.status = resJson.status
      throw error
    }

    return resJson
  }
}

/**
 * 判断是否为 Notion 的限流错误。不同传输通道可能只给出状态码或错误消息。
 */
function isNotionRateLimitError(error: unknown): boolean {
  const status = (error as { status?: number })?.status
  if (status === 429) {
    return true
  }
  const message = error instanceof Error ? error.message : String(error ?? "")
  return /rate.?limit|too many requests|请求过于频繁|429/i.test(message)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export { NotionApiAdaptor }
