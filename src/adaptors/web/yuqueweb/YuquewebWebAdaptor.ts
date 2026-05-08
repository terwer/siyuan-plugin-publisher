/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { YuquewebPostMeta } from "~/src/adaptors/web/yuqueweb/YuquewebPostMeta.ts"
import FormDataUtils from "~/src/utils/FormDataUtils.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { Attachment, CategoryInfo, MediaObject, Post, UserBlog } from "zhi-blog-api"
import { AliasTranslator, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"

interface YuquewebBookMeta {
  bookId: string
  bookSlug: string
  login: string
  name?: string
}

class YuquewebRequestError extends Error {
  public status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = "YuquewebRequestError"
    this.status = status
  }
}

/**
 * 语雀网页授权适配器。
 *
 * 脱敏 CDP 证据（2026-05-08，用户手动登录的 9222 Chrome）：
 * - `GET /api/mine` 返回当前用户 `id/login/name/avatar_url`。
 * - `GET /api/mine/user_books?user_type=User&offset=0&limit=20` 返回个人知识库，字段包含 `id/slug/name/user.login/abilities.create_doc/type`。
 * - `GET /api/mine/user_books?user_type=Group&offset=0&limit=20` 可用于组织知识库；当前测试账号返回空数组。
 * - `POST /api/docs` + `format: "markdown"` + `book_id/type/title/slug/body/status/insert_to_catalog/action` 可创建 Markdown 文档。
 * - `PUT /api/docs/{id}` + `format: "markdown"` + `book_id/type/title/slug/body/status/insert_to_catalog/action` 可更新标题、slug、正文并发布。
 * - `DELETE /api/docs/{id}` 可删除文档。
 * - `POST /api/upload/attach?type=image`，multipart 字段 `file`，响应 `data.url` 为图片 URL。
 *
 * 证据记录不得包含 Cookie、Authorization、ctoken、token、csrf、ticket 或协同 token。
 */
class YuquewebWebAdaptor extends BaseWebApi {
  public async checkAuth(): Promise<boolean> {
    const metadata = await this.getMetaData()
    return metadata.flag === true
  }

  public async getMetaData(): Promise<any> {
    const user = await this.yuquewebFetch("/api/mine")
    const flag = !StrUtil.isEmptyString(user?.login)
    this.logger.info(`get yuqueweb metadata finished, flag => ${flag}`)

    return {
      flag,
      uid: user?.id ? String(user.id) : "",
      title: user?.login ?? "",
      avatar: user?.avatar_url ?? user?.avatar ?? "",
      type: "yuqueweb",
      displayName: user?.name || user?.login || "语雀网页版",
      supportTypes: ["markdown"],
      home: "https://www.yuque.com/dashboard",
      icon: "https://www.yuque.com/favicon.ico",
      login: user?.login ?? "",
    }
  }

  public async getUsersBlogs(keyword?: string): Promise<UserBlog[]> {
    const books = await this.getYuquewebBooks(keyword)
    const result = books.map((book) => {
      const bookMeta = this.toBookMeta(book)
      const userblog = new UserBlog()
      userblog.blogid = this.serializeBookMeta(bookMeta)
      userblog.blogName = bookMeta.login
        ? `${bookMeta.name || bookMeta.bookSlug} (${bookMeta.login}/${bookMeta.bookSlug})`
        : bookMeta.name || bookMeta.bookSlug
      userblog.url = bookMeta.login ? `${this.cfg.home}/${bookMeta.login}/${bookMeta.bookSlug}` : this.cfg.home
      userblog.metadataMap = {
        yuquewebBookId: bookMeta.bookId,
        yuquewebBookSlug: bookMeta.bookSlug,
        yuquewebLogin: bookMeta.login,
      }
      return userblog
    })

    if (result.length === 0) {
      throw new Error("未获取到可发布的语雀知识库，请确认当前语雀账号已有知识库写入权限。")
    }

    this.logger.debug("get yuqueweb books =>", result.map((item) => ({ blogid: item.blogid, blogName: item.blogName })))
    return result
  }

  public async getCategories(keyword?: string): Promise<CategoryInfo[]> {
    const userBlogs = await this.getUsersBlogs(keyword)
    return userBlogs.map((userBlog) => {
      const cat = new CategoryInfo()
      cat.categoryId = userBlog.blogid
      cat.categoryName = userBlog.blogName
      cat.description = userBlog.blogName
      cat.categoryDescription = userBlog.url
      cat.htmlUrl = userBlog.url
      return cat
    })
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const bookMeta = this.resolveTargetBook(post)
    const payload = await this.buildDocPayload(bookMeta, post)
    const createdDoc = await this.yuquewebFetch("/api/docs", payload, "POST")

    if (!createdDoc?.id) {
      throw new Error("语雀文档创建失败，请稍后重试。")
    }

    // `POST /api/docs` 会创建 Markdown 文档；实测 `PUT /api/docs/{id}` 会将 Markdown 正文发布为正式文档。
    const publishPayload = {
      ...payload,
      slug: createdDoc.slug || payload.slug,
    }
    const publishedDoc = await this.yuquewebFetch(`/api/docs/${createdDoc.id}`, publishPayload, "PUT")
    const doc = publishedDoc?.id ? publishedDoc : createdDoc
    const meta = this.buildPostMeta(doc, bookMeta)
    this.logger.debug("yuqueweb newPost meta =>", meta)
    return meta.toPostid()
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const meta = YuquewebPostMeta.fromPostid(postid)
    if (StrUtil.isEmptyString(meta.id)) {
      throw new Error("语雀文档绑定信息不完整，请解除绑定后重新发布。")
    }

    const bookMeta: YuquewebBookMeta = {
      bookId: meta.bookId,
      bookSlug: meta.bookSlug,
      login: meta.login,
    }
    const payload = await this.buildDocPayload(bookMeta, post)
    const updatedDoc = await this.yuquewebFetch(`/api/docs/${meta.id}`, payload, "PUT")

    if (!updatedDoc?.id) {
      throw new Error("语雀文档更新失败，请稍后重试。")
    }

    const updatedMeta = this.buildPostMeta(updatedDoc, bookMeta)
    post.postid = updatedMeta.toPostid()
    return true
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    const meta = YuquewebPostMeta.fromPostid(postid)
    if (StrUtil.isEmptyString(meta.id)) {
      throw new Error("语雀文档绑定信息不完整，请手动检查后解除本地绑定。")
    }

    try {
      await this.yuquewebFetch(`/api/docs/${meta.id}`, {}, "DELETE")
      return true
    } catch (e) {
      if (e instanceof YuquewebRequestError && e.status === 404) {
        this.logger.warn("yuqueweb deletePost: remote doc already missing, allow local unbind")
        return true
      }
      throw e
    }
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const meta = YuquewebPostMeta.fromPostid(postid)
    if (StrUtil.isEmptyString(meta.id) && StrUtil.isEmptyString(meta.slug)) {
      throw new Error("语雀文档绑定信息不完整，请解除绑定后重新发布。")
    }

    let doc: any
    try {
      doc = await this.yuquewebFetch(`/api/docs/${meta.id}`)
    } catch (e) {
      doc = await this.yuquewebFetch(
        `/api/docs/${encodeURIComponent(meta.slug)}?book_id=${encodeURIComponent(meta.bookId)}&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false`
      )
    }

    const commonPost = new Post()
    commonPost.title = doc?.title ?? ""
    commonPost.wp_slug = doc?.slug ?? meta.slug
    commonPost.markdown = doc?.body ?? doc?.body_draft ?? ""
    commonPost.description = commonPost.markdown || doc?.content || ""
    commonPost.cate_slugs = [this.serializeBookMeta({ bookId: meta.bookId, bookSlug: meta.bookSlug, login: meta.login })]
    return commonPost
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const meta = YuquewebPostMeta.fromPostid(postid)
    if (meta.url) {
      return meta.url
    }

    const previewPath = (this.cfg.previewUrl || "/{login}/{bookSlug}/{slug}")
      .replace("{login}", meta.login)
      .replace("{bookSlug}", meta.bookSlug)
      .replace("{slug}", meta.slug)
    return previewPath.startsWith("http") ? previewPath : `${this.cfg.home}${previewPath}`
  }

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    try {
      const { FormData, Blob } = FormDataUtils.getFormData(this.appInstance)
      const blob = new Blob([mediaObject.bits], { type: mediaObject.type })
      const formData = new FormData()
      formData.append("file", blob, mediaObject.name)

      const res = await this.yuquewebFormFetch("/api/upload/attach?type=image", formData)
      const upload = res?.data ?? res
      const imageUrl = upload?.url
      if (StrUtil.isEmptyString(imageUrl)) {
        throw new Error("语雀图片上传失败，未返回可用图片地址。")
      }

      return {
        attachment_id: upload?.attachment_id ? String(upload.attachment_id) : upload?.filekey ?? mediaObject.name,
        date_created_gmt: new Date(),
        parent: 0,
        link: imageUrl,
        title: upload?.filename ?? mediaObject.name,
        caption: "",
        description: "",
        metadata: {
          width: 0,
          height: 0,
          file: upload?.filekey ?? "",
          filesize: upload?.size ?? upload?.attachment?.filesize ?? 0,
          sizes: [],
        },
        type: mediaObject.type,
        thumbnail: "",
        id: upload?.attachment_id ? String(upload.attachment_id) : upload?.filekey ?? mediaObject.name,
        file: upload?.filename ?? mediaObject.name,
        url: imageUrl,
      }
    } catch (e) {
      this.logger.error("yuqueweb image upload failed", this.sanitizeForLog(e?.toString?.() ?? e))
      throw new Error("语雀图片上传失败，请确认 Cookie 有效、图片文件可读取后重试。")
    }
  }

  private async getYuquewebBooks(keyword?: string): Promise<any[]> {
    const paths = [
      "/api/mine/user_books?user_type=User&offset=0&limit=100",
      "/api/mine/user_books?user_type=Group&offset=0&limit=100",
    ]
    const bookMap = new Map<string, any>()

    for (const path of paths) {
      try {
        const books = await this.yuquewebFetch(path)
        if (Array.isArray(books)) {
          books.forEach((book) => {
            if (this.isWritableBook(book)) {
              bookMap.set(String(book.id), book)
            }
          })
        }
      } catch (e) {
        this.logger.warn("yuqueweb get books failed", { path, err: this.sanitizeForLog(e?.toString?.() ?? e) })
      }
    }

    if (bookMap.size === 0) {
      const fallbackBooks = await this.yuquewebFetch("/api/books?offset=0&limit=100")
      if (Array.isArray(fallbackBooks)) {
        fallbackBooks.forEach((book) => {
          if (this.isWritableBook(book)) {
            bookMap.set(String(book.id), book)
          }
        })
      }
    }

    const books = Array.from(bookMap.values())
    if (StrUtil.isEmptyString(keyword)) {
      return books
    }

    const normalizedKeyword = keyword.toLowerCase()
    return books.filter((book) => {
      const meta = this.toBookMeta(book)
      return [meta.name, meta.bookSlug, meta.login].some((value) => value?.toLowerCase?.().includes(normalizedKeyword))
    })
  }

  private isWritableBook(book: any): boolean {
    if (!book || book.type !== "Book") {
      return false
    }
    const abilities = book.abilities
    if (Array.isArray(abilities)) {
      return abilities.includes("create_doc")
    }
    if (abilities && typeof abilities === "object") {
      return abilities.create_doc === true
    }
    return false
  }

  private toBookMeta(book: any): YuquewebBookMeta {
    const login = book?.user?.login ?? book?.group?.login ?? book?.login ?? ""
    return {
      bookId: String(book?.id ?? book?.book_id ?? ""),
      bookSlug: String(book?.slug ?? book?.book_slug ?? ""),
      login,
      name: book?.name ?? book?.title ?? "",
    }
  }

  private resolveTargetBook(post?: Post): YuquewebBookMeta {
    const rawValue = post?.cate_slugs?.[0] ?? this.cfg.blogid
    const meta = this.parseBookMeta(rawValue)
    if (StrUtil.isEmptyString(meta.bookId) || StrUtil.isEmptyString(meta.bookSlug) || StrUtil.isEmptyString(meta.login)) {
      throw new Error("请选择可发布的语雀知识库后再发布。")
    }
    return meta
  }

  private parseBookMeta(value: any): YuquewebBookMeta {
    if (typeof value === "object" && value) {
      return {
        bookId: String(value.bookId ?? value.book_id ?? value.id ?? ""),
        bookSlug: String(value.bookSlug ?? value.book_slug ?? value.slug ?? ""),
        login: String(value.login ?? ""),
        name: value.name,
      }
    }

    const parsed = JsonUtil.safeParse<any>(value, {} as any)
    if (!ObjectUtil.isEmptyObject(parsed)) {
      return this.parseBookMeta(parsed)
    }

    return {
      bookId: String(value ?? ""),
      bookSlug: String((this.cfg as any).yuquewebBookSlug ?? ""),
      login: String((this.cfg as any).yuquewebLogin ?? this.cfg?.metadata?.login ?? ""),
    }
  }

  private serializeBookMeta(meta: YuquewebBookMeta): string {
    return JSON.stringify({ bookId: meta.bookId, bookSlug: meta.bookSlug, login: meta.login })
  }

  private async buildDocPayload(bookMeta: YuquewebBookMeta, post: Post) {
    const slug = await this.resolveSlug(post)
    const title = StrUtil.isEmptyString(post.title) ? "无标题文档" : post.title
    const body = post.markdown ?? post.description ?? ""

    return {
      book_id: this.normalizeNumericId(bookMeta.bookId),
      type: "Doc",
      format: "markdown",
      title,
      slug,
      body,
      status: 0,
      insert_to_catalog: true,
      action: "prependChild",
    }
  }

  private async resolveSlug(post: Post): Promise<string> {
    if (!StrUtil.isEmptyString(post.wp_slug)) {
      return post.wp_slug
    }
    return await AliasTranslator.getPageSlug(post.title || "无标题文档", true)
  }

  private normalizeNumericId(value: string): string | number {
    return /^\d+$/.test(String(value)) ? Number(value) : value
  }

  private buildPostMeta(doc: any, bookMeta: YuquewebBookMeta): YuquewebPostMeta {
    const slug = String(doc?.slug ?? "")
    const meta = new YuquewebPostMeta(
      String(doc?.id ?? ""),
      slug,
      String(doc?.book_id ?? bookMeta.bookId),
      bookMeta.bookSlug,
      bookMeta.login,
      `${this.cfg.home}/${bookMeta.login}/${bookMeta.bookSlug}/${slug}`
    )
    return meta
  }

  private async yuquewebFetch(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    headers: Record<any, any> = {},
    contentType = "application/json"
  ) {
    const apiUrl = url.startsWith("http") ? url : `${this.cfg.apiUrl}${url}`
    const mergedHeaders = this.buildRequestHeaders(headers)
    const body = method === "GET" || method === "DELETE" || ObjectUtil.isEmptyObject(params) ? "" : JSON.stringify(params)

    this.logger.debug("yuqueweb request", {
      method,
      apiUrl: this.sanitizeForLog(apiUrl),
      bodyKeys: params && typeof params === "object" ? Object.keys(params) : [],
    })

    try {
      const resJson = await this.webFetch(apiUrl, [mergedHeaders], body, method, contentType, true, "base64")
      return this.unwrapYuquewebResponse(resJson, apiUrl)
    } catch (e) {
      if (e instanceof YuquewebRequestError) {
        throw e
      }
      throw new YuquewebRequestError("无法连接语雀，请检查网络或稍后重试。")
    }
  }

  private async yuquewebFormFetch(url: string, formData: BodyInit, headers: Record<any, any> = {}) {
    const apiUrl = url.startsWith("http") ? url : `${this.cfg.apiUrl}${url}`
    const mergedHeaders = this.buildRequestHeaders(headers)
    this.logger.debug("yuqueweb form request", { apiUrl: this.sanitizeForLog(apiUrl) })

    try {
      const resJson = await this.webFormFetch(apiUrl, [mergedHeaders], formData, true)
      return this.unwrapYuquewebResponse(resJson, apiUrl, "upload")
    } catch (e) {
      if (e instanceof YuquewebRequestError) {
        throw e
      }
      throw new YuquewebRequestError("语雀图片上传失败，请检查网络或稍后重试。")
    }
  }

  private buildRequestHeaders(headers: Record<any, any> = {}) {
    return {
      Cookie: this.cfg.password,
      Accept: "application/json",
      Origin: this.cfg.home,
      Referer: `${this.cfg.home}/dashboard`,
      ...headers,
    }
  }

  private unwrapYuquewebResponse(resJson: any, apiUrl: string, context?: "upload") {
    const normalized = this.normalizeProxyResponse(resJson)
    const status = Number(normalized?.status)
    const hasErrorStatus = Number.isFinite(status) && status >= 400
    const hasYuqueError = !normalized?.data && (normalized?.code || normalized?.key) && normalized?.message

    if (hasErrorStatus || hasYuqueError) {
      throw new YuquewebRequestError(this.toUserErrorMessage(status, normalized?.message, context), status)
    }

    return normalized?.data ?? normalized
  }

  private normalizeProxyResponse(resJson: any) {
    if (resJson?.body && typeof resJson.body === "string") {
      return JsonUtil.safeParse<any>(resJson.body, resJson)
    }
    return resJson
  }

  private toUserErrorMessage(status?: number, message?: string, context?: "upload") {
    if (status === 401 || status === 403) {
      return "语雀登录已失效或没有权限，请重新登录语雀后重新获取 Cookie，并确认知识库写入权限。"
    }
    if (status === 404) {
      return "语雀侧文档不存在或当前账号无权访问，请确认文档状态后重试。"
    }
    if (status === 429) {
      return "语雀请求过于频繁，请稍后重试。"
    }
    if (status === 422) {
      return context === "upload"
        ? "语雀无法处理该图片，请确认图片文件有效后重新发布。"
        : "语雀请求参数不符合要求，请检查标题、别名或知识库权限后重试。"
    }
    return message ? `语雀网页版请求失败：${this.sanitizeForLog(message)}` : "语雀网页版请求失败，请稍后重试。"
  }

  private sanitizeForLog(input: any): string {
    const text = typeof input === "string" ? input : JSON.stringify(input)
    return text
      .replace(/([?&](?:ctoken|token|csrf|ticket)=)[^&\s]+/gi, "$1<redacted>")
      .replace(/(cookie|authorization|x-auth-token|ctoken|token|csrf|ticket)(["'=:\s]+)[^"'&\s,}]+/gi, "$1$2<redacted>")
  }
}

export { YuquewebWebAdaptor, YuquewebRequestError }
