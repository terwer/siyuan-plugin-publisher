/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { CategoryInfo, MediaObject, Post, TagInfo, UserBlog } from "zhi-blog-api"
import { JsonUtil, StrUtil } from "zhi-common"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { createByteImagexClient } from "~/src/vendors/byteimagex/imagexClient.ts"
import { createCasePreservingNodeFetch } from "~/src/utils/rawHeaderFetch.ts"

/**
 * 掘金网页授权适配器
 *
 * @see [wechatsync juejin adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/Juejin.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class JuejinWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.juejinFetch("https://api.juejin.cn/user_api/v1/user/get", undefined, "GET")
    const flag = !!res.data?.user_id
    if (!flag) {
      throw new Error(`掘金平台校验失败，详细错误：code: ${res?.err_no}，msg: ${res?.err_msg}`)
    }
    this.logger.info(`get juejin metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.data.user_id,
      title: res.data.user_name,
      avatar: res.data.avatar_large,
      type: "juejin",
      displayName: "掘金",
      raw: res.data,
      supportTypes: ["markdown", "html"],
      home: "https://juejin.cn/editor/drafts",
      icon: "https://juejin.cn/favicon.ico",
    }
  }

  public async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []

    const header = {
      accept: "application/json",
    }
    const res = await this.juejinFetch(
      "https://api.juejin.cn/tag_api/v1/query_category_list",
      undefined,
      "POST",
      header
    )
    this.logger.info(`get juejin categories`, res.data)

    if (res.data && res.data.length > 0) {
      const cates = res.data
      cates.forEach((item: any) => {
        const useBlog = new UserBlog()

        useBlog.blogid = item.category_id
        useBlog.blogName = item.category.category_name
        useBlog.url = item.category.icon
        result.push(useBlog)
      })
    }

    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  /**
   * 掘金原生图片上传（字节 veImageX 直传）
   *
   * 链路：gen_token(STS) → ApplyImageUpload(SigV4) → TOS 裸字节直传(CRC32 强制)
   *       → CommitImageUpload → get_img_url(预览用)
   * 正文契约：markdown 只嵌裸 StoreUri（`![](tos-cn-i-73owjymdk6/<32hex>)`），
   * 签名 URL 由掘金读取端动态重签，持久层不存任何域名与签名。
   */
  public async uploadFile(mediaObject: MediaObject): Promise<any> {
    const filename = mediaObject.name
    const rawBits: any = mediaObject.bits
    const bytes = rawBits instanceof Uint8Array ? rawBits : new Uint8Array(rawBits)
    this.logger.info(`juejin start uploadFile ${filename}, bytes => ${bytes.length}`)

    // 1. STS 临时凭证。uuid 为字节 tea 追踪 web_id，实测服务端不校验，随机生成即可
    const teaUuid = String(Math.floor(Math.random() * 9e18))
    const genTokenUrl = `https://api.juejin.cn/imagex/v2/gen_token?aid=2608&uuid=${teaUuid}&client=web`
    const tokenRes = await this.juejinFetch(genTokenUrl, undefined, "GET")
    if (tokenRes.err_no !== 0 || !tokenRes.data?.token) {
      throw new Error("掘金图片上传失败：获取上传凭证错误 =>" + tokenRes.err_msg)
    }

    // 2-4. Apply → TOS 直传 → Commit（SigV4 签名、CRC32 校验在 imagex 客户端内完成）
    // imagex/TOS 为签名敏感外部主机：volcengine 网关对 x-amz-* 头名大小写敏感，
    // 统一 facade 各通道写出时会小写化头名（100024 InvalidAuthorization），
    // 因此宿主内优先走大小写保真的 node:https 通道，不可用时回退 webFetch。
    const casePreservingFetch = createCasePreservingNodeFetch(this.appInstance)
    const client = createByteImagexClient({
      logger: this.logger,
      requestJson: async (req) => {
        if (casePreservingFetch) {
          this.logger.debug(`[byte-imagex] via case-preserving node:https => ${req.method} ${req.url.slice(0, 80)}`)
          const raw = await casePreservingFetch({
            url: req.url,
            method: req.method,
            headers: req.headers,
            params: req.method === "GET" ? undefined : (req.params as string | Uint8Array) ?? "",
          })
          if (!(raw.status >= 200 && raw.status < 300)) {
            throw new Error(`HTTP request failed (${raw.status}): ${raw.text.slice(0, 500)}`)
          }
          return JsonUtil.safeParse<any>(raw.text, {} as any)
        }
        this.logger.warn("[byte-imagex] case-preserving fetch unavailable, fallback to webFetch")
        return await this.webFetch(
          req.url,
          [req.headers ?? {}],
          req.method === "GET" ? undefined : req.params ?? "",
          req.method,
          req.contentType ?? "application/json",
          false
        )
      },
    })
    const result = await client.uploadImage({
      stsToken: tokenRes.data.token,
      serviceId: "73owjymdk6",
      bytes,
    })

    // 5. 换取可对外访问的完整签名 URL。掘金文章页 SSR 不重签裸 StoreUri，只认带签名/域名的
    //    完整 URL；否则正文图片会渲染成「相对链接」。官方编辑器行为一致：把 get_img_url 的
    //    main_url 直接插入 mark_content（读取端会动态重签延长有效期）。
    let mainUrl = ""
    let getImgUrlErr: any = null
    try {
      const imgUrlRes = await this.juejinFetch(
        `https://api.juejin.cn/imagex/v2/get_img_url?aid=2608&uuid=${teaUuid}&uri=${encodeURIComponent(result.storeUri)}&img_type=private`,
        undefined,
        "GET"
      )
      mainUrl = imgUrlRes?.data?.main_url ?? ""
    } catch (e) {
      getImgUrlErr = e
      this.logger.warn("juejin fetch image main url failed =>", e)
    }
    if (!mainUrl) {
      // 无法生成可访问 URL 时显式失败，避免静默写入裸 URI 导致文章页相对链接
      throw new Error(
        "掘金图片上传成功但获取可访问 URL 失败（get_img_url 未返回 main_url）：" +
          (getImgUrlErr?.message ?? JSON.stringify(getImgUrlErr)?.slice(0, 300))
      )
    }
    this.logger.debug("juejin uploadFile finished", { storeUri: result.storeUri, mainUrl })

    return {
      id: result.storeUri,
      object_key: result.storeUri,
      url: mainUrl,
      preview_url: mainUrl,
    }
  }

  public async addPost(post: Post) {
    let cate_slug = post.cate_slugs?.[0] ?? this.cfg.blogid
    if (StrUtil.isEmptyString(cate_slug)) {
      // 默认分类：后端
      cate_slug = "6809637769959178254"
      this.logger.error("掘金平台未选择分类，将使用默认分类：后端")
      // throw new Error("掘金平台必须选择一个分类")
    }

    let tag_slug = post.tags_slugs ?? ""
    if (StrUtil.isEmptyString(tag_slug)) {
      // 默认贴标签：程序员
      tag_slug = "6809640482725954000"
      this.logger.error("掘金平台未选择标签，将使用默认标签：程序员")
      // throw new Error("掘金平台必须选择一个标签")
    }

    const DEFAULT_DESC =
      "由于掘金平台的摘要有强制字数要求，这里需要给一下默认文字作为摘要。这里是掘金平台的默认摘要，您可以稍后自行修改。"
    if (StrUtil.isEmptyString(post.shortDesc) || post.shortDesc.length < DEFAULT_DESC.length) {
      post.shortDesc = DEFAULT_DESC
      this.logger.error("掘金平台未设置摘要或者摘要字数，将使用默认摘要")
    }

    // 摘要控制在 50 - 100
    if (post.shortDesc.length < 50) {
      while (post.shortDesc.length < 50) {
        post.shortDesc += post.shortDesc
      }
      post.shortDesc = post.shortDesc.slice(0, 100)
    } else if (post.shortDesc.length > 100) {
      post.shortDesc = post.shortDesc.slice(0, 100)
    }

    // 保存草稿
    const draftUrl = "https://api.juejin.cn/content_api/v1/article_draft/create"
    const draftParams = JSON.stringify({
      category_id: cate_slug,
      tag_ids: tag_slug.split(","),
      link_url: "",
      cover_image: "",
      title: post.title,
      brief_content: post.shortDesc,
      edit_type: 10,
      html_content: "deprecated",
      mark_content: post.description,
      theme_ids: [],
    })
    const draftRes = await this.juejinFetch(draftUrl, draftParams, "POST", {})
    this.logger.debug("juejin add post =>", draftRes)
    if (draftRes.err_no !== 0) {
      throw new Error("掘金文章草稿保存错误 =>" + draftRes.err_msg)
    }
    const draftId = draftRes.data.id.toString()

    // 发布文章
    const pageId = await this.publishPost(draftId)
    const postid = [pageId, draftId].join("_")
    return {
      status: "success",
      post_id: postid,
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    let cate_slug = post.cate_slugs?.[0] ?? this.cfg.blogid
    if (StrUtil.isEmptyString(cate_slug)) {
      // 与 addPost 保持一致：默认分类「后端」
      cate_slug = "6809637769959178254"
      this.logger.error("掘金平台未选择分类，将使用默认分类：后端")
    }

    let tag_slug = post.tags_slugs ?? ""
    if (StrUtil.isEmptyString(tag_slug)) {
      // 与 addPost 保持一致：默认标签「程序员」
      tag_slug = "6809640482725954000"
      this.logger.error("掘金平台未选择标签，将使用默认标签：程序员")
    }

    // 与 addPost 保持一致：摘要为空或过短时使用默认摘要
    const DEFAULT_DESC =
      "由于掘金平台的摘要有强制字数要求，这里需要给一下默认文字作为摘要。这里是掘金平台的默认摘要，您可以稍后自行修改。"
    if (StrUtil.isEmptyString(post.shortDesc) || post.shortDesc.length < DEFAULT_DESC.length) {
      post.shortDesc = DEFAULT_DESC
      this.logger.error("掘金平台未设置摘要或者摘要字数，将使用默认摘要")
    }
    if (post.shortDesc.length < 50) {
      while (post.shortDesc.length < 50) {
        post.shortDesc += post.shortDesc
      }
      post.shortDesc = post.shortDesc.slice(0, 100)
    } else if (post.shortDesc.length > 100) {
      post.shortDesc = post.shortDesc.slice(0, 100)
    }

    const juejinPostKey = this.getJuejinPostidKey(postid)
    // const pageId = juejinPostKey.pageId
    const draftId = juejinPostKey.draftId

    // 更新文章
    const draftUpdateUrl = "https://api.juejin.cn/content_api/v1/article_draft/update"
    const draftParams = JSON.stringify({
      id: draftId,
      category_id: cate_slug,
      tag_ids: tag_slug.split(","),
      link_url: "",
      cover_image: "",
      title: post.title,
      brief_content: post.shortDesc,
      edit_type: 10,
      html_content: "deprecated",
      mark_content: post.markdown,
      theme_ids: [],
    })
    // 更新草稿
    const draftRes = await this.juejinFetch(draftUpdateUrl, draftParams, "POST", {})
    this.logger.debug("juejin update post =>", draftRes)
    if (draftRes.err_no !== 0) {
      throw new Error("掘金文章更新错误 =>" + draftRes.err_msg)
    }

    // 发布文章
    await this.publishPost(draftId)

    return true
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const juejinPostKey = this.getJuejinPostidKey(postid)
    const pageId = juejinPostKey.pageId
    const postUrl = this.cfg.previewUrl.replace("[postid]", pageId)
    return postUrl
    // return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    const url = "https://api.juejin.cn/content_api/v1/article/delete"
    const juejinPostKey = this.getJuejinPostidKey(postid)
    const pageId = juejinPostKey.pageId
    const params = JSON.stringify({
      article_id: pageId,
    })
    const res = await this.juejinFetch(url, params, "POST", {})
    this.logger.debug("juejin delete post res =>", res)
    if (res.err_no !== 0) {
      throw new Error("掘金文章删除失败 =>" + res.err_msg)
    }

    return true
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const juejinPostKey = this.getJuejinPostidKey(postid)
    const pageId = juejinPostKey.pageId

    const url = "https://api.juejin.cn/content_api/v1/article/detail"
    const params = JSON.stringify({
      article_id: pageId,
    })
    const res = await this.juejinFetch(url, params, "POST", {})
    this.logger.debug("juejin get post res =>", res)
    if (res.err_no !== 0) {
      throw new Error("掘金文章获取失败 =>" + res.err_msg)
    }

    const commonPost = new Post()

    // 掘金标签
    const tags = res.data.tags ?? []
    const tagSlugs = []
    tags.forEach((item: any) => {
      tagSlugs.push(item.tag_id)
    })
    commonPost.tags_slugs = tagSlugs.join(",")

    // 掘金分类
    const cate = res.data.category.category_id
    const catSlugs = []
    catSlugs.push(cate)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const header = {
      accept: "application/json",
    }
    const res = await this.juejinFetch(
      "https://api.juejin.cn/tag_api/v1/query_category_list",
      undefined,
      "POST",
      header
    )
    this.logger.info(`get juejin categories`, res.data)

    if (res.data && res.data.length > 0) {
      res.data.forEach((item: any) => {
        const cat = new CategoryInfo()
        cat.categoryId = item.category_id
        cat.categoryName = item.category.category_name
        cats.push(cat)
      })
    }

    return cats
  }

  public async getTags(): Promise<TagInfo[]> {
    const tags = [] as TagInfo[]

    const header = {
      accept: "application/json",
    }
    const params = JSON.stringify({
      cursor: "0",
      key_word: "",
      limit: 10,
      sort_type: 1,
    })
    const res = await this.juejinFetch("https://api.juejin.cn/tag_api/v1/query_tag_list", params, "POST", header)
    this.logger.info(`get juejin categories`, res.data)

    if (res.data && res.data.length > 0) {
      res.data.forEach((item: any) => {
        const tag = new TagInfo()
        tag.tagId = item.tag_id
        tag.tagName = item.tag.tag_name
        tags.push(tag)
      })
    }

    return tags
  }

  // ================
  // private methods
  // ================
  /**
   * 获取封装的postid
   *
   * @param postid
   * @private postid
   */
  private getJuejinPostidKey(postid: string): any {
    let pageId: string
    let draftId: string
    if (postid.indexOf("_") > 0) {
      const idArr = postid.split("_")
      pageId = idArr[0]
      draftId = idArr[1]
    } else {
      pageId = postid
    }

    return {
      pageId: pageId,
      draftId: draftId,
    }
  }

  private async publishPost(draftId: string) {
    // 发布文章
    const url = "https://api.juejin.cn/content_api/v1/article/publish"
    const params = JSON.stringify({
      draft_id: draftId,
      sync_to_org: false,
      column_ids: [],
      theme_ids: [],
    })
    const res = await this.juejinFetch(url, params, "POST", {})
    this.logger.debug("juejin publish post res =>", res)
    if (res.err_no !== 0) {
      throw new Error("掘金文章发布失败 =>" + (res?.err_msg ?? res))
    }

    return res.data.article_id.toString()
  }

  /**
   * 向掘金请求数据
   */
  private async juejinFetch(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    headers: Record<any, any> = {},
    contentType: string = "application/json"
  ) {
    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    const body = params

    // 输出日志
    const apiUrl = url
    this.logger.debug("向掘金请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向掘金请求数据，headers =>", headers)
    this.logger.debug("向掘金请求数据，body =>", body)

    const resJson = await this.webFetch(apiUrl, [mergedHeaders], body, method, contentType, true, "base64")
    this.logger.debug("向掘金请求数据，resJson =>", resJson)

    return resJson ?? null
  }
}

export { JuejinWebAdaptor }
