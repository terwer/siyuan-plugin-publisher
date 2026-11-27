/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"
import { BlogConfig, CategoryInfo, MediaObject, PageTypeEnum, Post, UserBlog } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import WebUtils from "~/src/adaptors/web/base/webUtils.ts"
import * as _ from "lodash-es"
import FormDataHostUtil from "~/src/utils/FormDataHostUtil.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { getFeaturedImage, type FeaturedImagePost } from "~/src/utils/featuredImage.ts"
import { readFeaturedImageMedia } from "~/src/utils/featuredImageMedia.ts"

/**
 * CSDN 图片上传通道。
 *
 * 正文图与封面图走两条互不通用的通道：用错通道不会报错，只是图片不显示。
 */
type CsdnImageKind = "body" | "cover"

/**
 * CSDN网页授权适配器
 *
 * @see [wechatsync csdn adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/CSDN.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CsdnWebAdaptor extends BaseWebApi {
  // /**
  //  * 初始化CSDN API 适配器
  //  *
  //  * @param appInstance 应用实例
  //  * @param cfg 配置项
  //  */
  // constructor(appInstance: PublisherAppInstance, cfg: CsdnConfig) {
  //   super(appInstance, cfg)
  //   this.cfg = cfg
  //
  //   this.logger = createAppLogger("csdn-web-adaptor")
  // }

  public async getMetaData(): Promise<any> {
    const res = await this.csdnFetch("https://bizapi.csdn.net/blog-console-api/v1/user/info")
    const flag = !!res.data.username
    return {
      flag: flag,
      uid: res.data.username,
      title: res.data.username,
      avatar: res.data.avatar,
      type: "csdn",
      displayName: "CSDN",
      supportTypes: ["markdown", "html"],
      home: "https://mp.csdn.net/",
      icon: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    }
  }

  public async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []

    const res = await this.csdnFetch("https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all")
    if (res?.code === 200) {
      const columnList = res?.data?.list
      const column = columnList?.column ?? []
      const payCcolumn = columnList?.pay_column ?? []

      // 普通专栏
      column.forEach((item: any) => {
        const userblog: UserBlog = new UserBlog()
        userblog.blogid = item.id
        userblog.blogName = item.edit_title
        userblog.url = item.column_url
        // userblog.imgUrl = item.img_url
        result.push(userblog)
      })

      // 付费专栏
      payCcolumn.forEach((item: any) => {
        const userblog: UserBlog = new UserBlog()
        userblog.blogid = item.id
        userblog.blogName = item.edit_title
        userblog.url = item.column_url
        // userblog.imgUrl = item.img_url
        result.push(userblog)
      })
    }

    return result
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const res = await this.csdnFetch("https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all")
    if (res?.code === 200) {
      const columnList = res?.data?.list
      const column = columnList?.column ?? []
      const payCcolumn = columnList?.pay_column ?? []

      // 普通专栏
      column.forEach((item: any) => {
        const cat = new CategoryInfo()

        cat.categoryId = item.id
        cat.categoryName = item.edit_title
        cat.description = item.column_url
        cat.categoryDescription = item.desc
        cats.push(cat)
      })

      // 付费专栏
      payCcolumn.forEach((item: any) => {
        const cat = new CategoryInfo()

        cat.categoryId = item.id
        cat.categoryName = item.edit_title
        cat.description = item.column_url
        cat.categoryDescription = item.desc
        cats.push(cat)
      })
    }

    return cats
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // CSDN自定义的处理
    const cfg: BlogConfig = publishCfg?.cfg
    const updatedPost = _.cloneDeep(doc) as Post
    const html = updatedPost.html
    let updatedHtml = html

    // 公式由公共 FormulaRenderService 按平台配置统一处理

    // 处理完毕
    updatedPost.html = updatedHtml

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      updatedPost.description = updatedPost.markdown
    } else {
      updatedPost.description = updatedPost.html
    }

    return updatedPost
  }

  public async addPost(post: Post) {
    let csdnHtml = post.html
    // 如果开启高亮，就使用高亮
    csdnHtml = await CsdnUtils.processPrismjs(this, csdnHtml)

    // 仅支持MD
    const coverImages = await this.resolveCoverImages(post)
    const params: Record<string, any> = {
      title: post.title,
      markdowncontent: post.markdown,
      content: csdnHtml,
      readType: "public",
      level: 0,
      tags: post.mt_keywords,
      status: 0,
      categories: post.categories.join(","),
      type: "original",
      original_link: "",
      authorized_status: false,
      Description: post.shortDesc,
      not_auto_saved: "1",
      source: "pc_mdeditor",
      is_new: 1,
      vote_id: 0,
      resource_id: "",
      pubStatus: "publish",
    }
    // cover_type=1 表示使用 cover_images 中的封面；没有封面时不下发这两个字段，
    // 避免把空封面当成“自定义封面”提交。
    if (coverImages.length > 0) {
      params.cover_images = coverImages
      params.cover_type = 1
    }

    const res = await this.csdnFetch(
      "https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle",
      [],
      JSON.stringify(params),
      "POST"
    )

    if (res?.code !== 200) {
      throw new Error("CSDN文章发布失败，可能是等级不够导致，如过等级不够，请去掉文章标签")
    }

    const postid = res.data.id.toString()

    return {
      status: "success",
      post_id: postid,
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    let csdnHtml = post.html
    // 如果开启高亮，就使用高亮
    csdnHtml = await CsdnUtils.processPrismjs(this, csdnHtml)

    // 仅支持MD
    const coverImages = await this.resolveCoverImages(post)
    const coverCleared = (post as FeaturedImagePost).featuredImageCleared === true
    if (coverImages.length === 0 && !coverCleared) {
      // saveArticle 不带封面字段会清空平台封面；本地没有新的封面来源时，
      // 回读并重发平台已有封面，避免正文更新顺手把封面删掉。
      try {
        const existingCover = await this.getPostCover(postid)
        if (!StrUtil.isEmptyString(existingCover)) {
          coverImages.push(existingCover)
        }
      } catch (e: any) {
        this.logger.warn(`CSDN 回读已有封面失败，本次更新可能清空封面 => ${e?.message ?? e}`)
      }
    }
    const params: Record<string, any> = {
      id: postid,
      title: post.title,
      markdowncontent: post.markdown,
      content: csdnHtml,
      readType: "public",
      level: "1",
      tags: post.mt_keywords,
      status: 0,
      categories: post.categories.join(","),
      type: "original",
      original_link: "",
      authorized_status: false,
      Description: post.shortDesc,
      resource_url: "",
      not_auto_saved: "1",
      source: "pc_mdeditor",
      is_new: 1,
      vote_id: 0,
      resource_id: "",
      pubStatus: "publish",
    }
    if (coverImages.length > 0) {
      params.cover_images = coverImages
      params.cover_type = 1
    } else if (coverCleared) {
      // 用户清空了封面且没有可回退的题头图/正文首图：显式清除平台侧封面。
      params.cover_images = []
      params.cover_type = 0
    }

    const res = await this.csdnFetch(
      "https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle",
      [],
      JSON.stringify(params),
      "POST"
    )

    if (res?.code !== 200) {
      throw new Error("CSDN文章更新失败，可能是等级不够导致，如果等级不够，请去掉文章标签")
    }

    return true
  }

  public async getPost(postid: string): Promise<Post> {
    const res = await this.csdnFetch(`https://bizapi.csdn.net/blog-console-api/v3/editor/getArticle?id=${postid}`)

    const post = new Post()
    if (res?.code === 200) {
      const csdnPost = res?.data
      post.postid = csdnPost.article_id
      post.title = csdnPost.title
      post.mt_keywords = csdnPost?.tags ?? ""
      post.categories = csdnPost?.categories.split(",") ?? []
      // 回读平台已有封面：更新时若本地没有新的封面来源，重发这张图即可保留封面。
      // （saveArticle 不带封面字段会清空平台封面）
      const coverImages = Array.isArray(csdnPost?.cover_images) ? csdnPost.cover_images : []
      post.cover = typeof coverImages[0] === "string" ? coverImages[0].trim() : ""
    }
    return post
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    let flag = false
    try {
      const params = JSON.stringify({
        articleId: postid,
        // 永久删除，默认只删除到回收站
        deep: false,
      })
      const res = await this.csdnFetch(
        "https://bizapi.csdn.net/blog/phoenix/console/v1/article/del",
        [],
        params,
        "POST"
      )

      if (res?.code !== 200) {
        throw new Error(res?.message)
      }

      flag = true
    } catch (e) {
      this.logger.error("CSDN文章删除失败", e)
      throw e
    }

    return flag
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const token = this.cfg.password
    const userid = WebUtils.readCookie("UserName", token)
    const previewUrl = this.cfg.previewUrl.replace(/\[userid\]/g, userid).replace(/\[postid\]/g, postid)
    return previewUrl
    // return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
  }

  public async uploadFile(mediaObject: MediaObject): Promise<any> {
    const { FormData, Blob } = FormDataHostUtil.getFormData(this.appInstance)
    const file = new Blob([mediaObject.bits], { type: mediaObject.type })
    const filename = mediaObject.name

    if (file instanceof Blob) {
      // return await this.csdnUploadImage(file, filename)
      return await this.csdnUploadImage2025(file, filename)
    }

    return {}
  }

  // ================
  // private methods
  // ================

  /**
   * 解析本次发布要提交给 CSDN 的封面地址。
   *
   * 发布层已经按「题头图 → 正文首图 → 自定义」解析出 `post.cover`：
   * - CSDN 图床地址直接使用；
   * - 思源内核资源先经封面专用通道上传到 CSDN 图床；
   * - 其它公网图片原样使用。
   *
   * 封面是正文之外的附加能力：失败时记录原因并继续发布正文。
   */
  private async resolveCoverImages(post: Post): Promise<string[]> {
    const cover = (StrUtil.isEmptyString(post.cover) ? getFeaturedImage(post) : (post.cover ?? "")).trim()
    if (StrUtil.isEmptyString(cover)) {
      return []
    }

    if (this.isCsdnImageUrl(cover)) {
      return [cover]
    }

    if (this.isSiyuanAssetUrl(cover)) {
      if ((post as any).imageUploadSkipped === true) {
        this.recordCoverError(post, "已按设置跳过图片自动上传，封面图未上传")
        return []
      }

      try {
        return [await this.uploadCoverImage(cover, post)]
      } catch (e: any) {
        const message = e?.message || String(e)
        this.recordCoverError(post, `封面图上传失败：${message}`)
        this.logger.warn(`CSDN 封面图上传失败，正文继续发布 => ${message}`)
        return []
      }
    }

    if (/^https?:\/\//i.test(cover)) {
      // 公网图片 CSDN 可直接引用，避免重复上传
      return [cover]
    }

    this.recordCoverError(post, "封面图地址无法访问，请填写图片链接或思源资源")
    return []
  }

  /**
   * 读取平台文章当前封面地址。
   *
   * `saveArticle` 更新时若不带封面字段会清空平台封面，因此更新前需要回读并重发。
   */
  private async getPostCover(postid: string): Promise<string> {
    const res = await this.csdnFetch(`https://bizapi.csdn.net/blog-console-api/v3/editor/getArticle?id=${postid}`)
    if (res?.code !== 200) {
      return ""
    }
    const coverImages = Array.isArray(res?.data?.cover_images) ? res.data.cover_images : []
    return typeof coverImages[0] === "string" ? coverImages[0].trim() : ""
  }

  /**
   * 上传封面到 CSDN 图床，返回可用于 `cover_images` 的公网地址。
   *
   * @param cover - 封面地址（思源内核资源或相对路径）
   * @param post - 文章，用于共享媒体缓存上下文
   */
  private async uploadCoverImage(cover: string, post: Post): Promise<string> {
    const baseUrl = this.baseExtendApi.getSiyuanApiBaseUrl()
    const media = await readFeaturedImageMedia(this.baseExtendApi, cover, baseUrl || undefined)
    const mediaObject = this.baseExtendApi.createMediaObject(post, media.name, media.mimeType, media.bits)
    const { Blob } = FormDataHostUtil.getFormData(this.appInstance)
    const file = new Blob([mediaObject.bits], { type: mediaObject.type })

    const uploaded = await this.csdnUploadImage2025(file, mediaObject.name, "cover")
    const url = (uploaded?.url ?? "").trim()
    if (StrUtil.isEmptyString(url)) {
      throw new Error("CSDN 未返回封面图片地址")
    }
    return url
  }

  /**
   * 记录封面处理失败原因，供发布层提示用户；不覆盖已有错误。
   */
  private recordCoverError(post: Post, message: string) {
    const featuredPost = post as FeaturedImagePost
    if (StrUtil.isEmptyString(featuredPost.featuredImageError)) {
      featuredPost.featuredImageError = message
    }
  }

  /**
   * 是否已经是 CSDN 图床地址。
   */
  private isCsdnImageUrl(url: string): boolean {
    try {
      const { hostname } = new URL(url)
      return /(^|\.)csdnimg\.cn$/i.test(hostname) || /(^|\.)csdn\.net$/i.test(hostname)
    } catch {
      return false
    }
  }

  /**
   * 是否为思源内核资源（本机地址，CSDN 无法直接访问）。
   */
  private isSiyuanAssetUrl(url: string): boolean {
    if (!/^https?:\/\//i.test(url)) {
      return true
    }
    const baseUrl = (this.baseExtendApi.getSiyuanApiBaseUrl() ?? "").replace(/\/+$/, "")
    if (!StrUtil.isEmptyString(baseUrl) && url.startsWith(`${baseUrl}/`)) {
      return true
    }
    // 内核地址未声明时，本机地址同样不能直接交给 CSDN
    try {
      const { hostname } = new URL(url)
      return /^(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[?::1]?)$/i.test(hostname)
    } catch {
      return false
    }
  }

  private async csdnUploadImage2025(file: any, filename: string, kind: CsdnImageKind = "body") {
    const signUrl = "https://bizapi.csdn.net/resource-api/v1/image/direct/upload/signature"
    const fileExt = filename.split(".").pop() ?? ""
    if (!this.validateFileExt(fileExt, kind)) {
      if (kind === "cover") {
        throw new Error(`不支持的封面图片格式：.${fileExt}`)
      }
      return null
    }

    // 正文图与封面图必须使用各自的 appName / imageTemplate，两条通道不通用。
    const channel =
      kind === "cover"
        ? { appName: "direct_blog_coverimage", imageTemplate: "" }
        : { appName: "direct_blog_markdown", imageTemplate: "standard" }
    const res = await this.csdnMediaFetch(
      signUrl,
      {},
      JSON.stringify({
        imageTemplate: channel.imageTemplate,
        appName: channel.appName,
        imageSuffix: fileExt,
      }),
      "POST"
    )
    if (res.code !== 200) {
      this.logger.error("图片上传签名错误，信息如下", res)
      if (kind === "cover") {
        throw new Error(`封面图上传签名失败 => ${res?.msg ?? res?.code ?? "未知错误"}`)
      }
      return null
    }
    const uploadData = res.data
    if (!uploadData) {
      throw new Error("CSDN图片签名信息获取失败 =>" + filename)
    }

    const uploadUrl = uploadData.host
    const { FormData, Blob } = FormDataHostUtil.getFormData(this.appInstance)

    const formData = new FormData()
    formData.append("key", uploadData.filePath)
    formData.append("policy", uploadData.policy)
    formData.append("signature", uploadData.signature)
    formData.append("callbackBody", uploadData.callbackBody)
    formData.append("callbackBodyType", uploadData.callbackBodyType)
    // 对象存储按 provider 区分凭据字段名；发错只会得到没有说明的空 400。
    // 未返回 provider 时沿用旧的 obs 字段名，保持既有上传行为。
    if (!uploadData.provider || uploadData.provider === "obs") {
      formData.append("AccessKeyId", uploadData.accessId)
      formData.append("callbackUrl", uploadData.callbackUrl)
    } else {
      formData.append("OSSAccessKeyId", uploadData.accessId)
      formData.append("callback", uploadData.callbackUrl)
    }
    for (const [key, value] of Object.entries(uploadData.customParam ?? {})) {
      if (value !== undefined && value !== null) {
        formData.append(`x:${key}`, String(value))
      }
    }
    formData.append("file", file)
    const headers = {}
    const resJson = await this.csdnFormFetch(uploadUrl, formData, headers)
    const imageUrl = resJson?.data?.imageUrl ?? resJson?.imageUrl
    if (StrUtil.isEmptyString(imageUrl)) {
      this.logger.error("CSDN图片上传失败，信息如下", resJson)
      throw new Error("CSDN图片上传失败 =>" + filename)
    }
    return {
      id: resJson?.data?.targetObjectKey ?? "",
      object_key: resJson?.data?.targetObjectKey ?? "",
      url: imageUrl,
    }
  }

  private async csdnUploadImage(file: any, filename: string) {
    const api = "https://imgservice.csdn.net/direct/v1.0/image/upload?watermark=&type=blog&rtype=markdown"
    const fileExt = filename.split(".").pop()
    if (!this.validateFileExt(fileExt)) {
      return null
    }

    const res = await this.csdnFetch(api, {
      "x-image-app": "direct_blog",
      "x-image-suffix": fileExt,
      "x-image-dir": "direct",
    })
    if (res.code !== 200) {
      this.logger.error("图片可能已经上传，信息如下", res)
      return null
    }

    const uploadData = res.data
    if (!uploadData) {
      throw new Error("CSDN图片信息获取失败 =>" + filename)
    }

    const uploadUrl = uploadData.host
    const { FormData, Blob } = FormDataHostUtil.getFormData(this.appInstance)

    const formData = new FormData()
    formData.append("key", uploadData.filePath)
    formData.append("policy", uploadData.policy)
    formData.append("OSSAccessKeyId", uploadData.accessId)
    formData.append("success_action_status", "200")
    formData.append("signature", uploadData.signature)
    formData.append("callback", uploadData.callbackUrl)
    formData.append("file", file)

    const headers = {}
    const resJson = await this.csdnFormFetch(uploadUrl, formData, headers)
    if (resJson.code !== 200) {
      throw new Error("CSDN图片上传失败 =>" + filename)
    }
    return {
      id: resJson.data.targetObjectKey,
      object_key: resJson.data.targetObjectKey,
      url: resJson.data.imageUrl,
    }
  }

  private validateFileExt(ext: string, kind: CsdnImageKind = "body"): boolean {
    switch (ext.toLowerCase()) {
      case "jpg":
      case "png":
      case "jpeg":
      case "gif":
        return true
      // 封面图床额外支持 webp/bmp；正文通道维持原有格式范围
      case "webp":
      case "bmp":
        return kind === "cover"
      default:
        return false
    }
  }

  private async csdnFetch(
    url: string,
    headers: any = {},
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ) {
    // 设置请求头
    const accept = "*/*"
    const xcakey = CsdnUtils.X_CA_KEY
    const xCaNonce = CsdnUtils.generateXCaNonce()
    const xCaSignature = await CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("accept", accept)
    reqHeaderMap.set("content-type", contentType)
    reqHeaderMap.set("x-ca-key", xcakey)
    reqHeaderMap.set("x-ca-nonce", xCaNonce)
    reqHeaderMap.set("x-ca-signature", xCaSignature)
    reqHeaderMap.set("x-ca-signature-headers", "x-ca-key,x-ca-nonce")
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    // 构建请求选项
    const requestOptions: RequestInit = {
      method: method,
      headers: mergedHeaders,
      body: params,
    }

    // 发送请求并返回响应
    const res = await this.webFetch(url, [mergedHeaders], params, method, contentType, true, "base64")
    return res
  }

  private async csdnMediaFetch(
    url: string,
    headers: any = {},
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ) {
    // 设置请求头
    const accept = "*/*"
    const xcakey = CsdnUtils.X_CA_KEY_MEDIA
    const xCaNonce = CsdnUtils.generateXCaNonce()
    const timestamp = new Date().getTime().toString()
    const xCaSignature = await CsdnUtils.generateXCaSignatureForMedia(
      url,
      method,
      accept,
      xCaNonce,
      contentType,
      timestamp
    )

    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("accept", accept)
    reqHeaderMap.set("content-type", contentType)
    reqHeaderMap.set("x-ca-key", xcakey)
    reqHeaderMap.set("x-ca-nonce", xCaNonce)
    reqHeaderMap.set("x-ca-timestamp", timestamp)
    reqHeaderMap.set("x-ca-signature", xCaSignature)
    reqHeaderMap.set("x-ca-signature-headers", "x-ca-key,x-ca-nonce,x-ca-timestamp")
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    // 构建请求选项
    const requestOptions: RequestInit = {
      method: method,
      headers: mergedHeaders,
      body: params,
    }

    // 发送请求并返回响应
    const res = await this.webFetch(url, [mergedHeaders], params, method, contentType, true, "base64")
    return res
  }

  /**
   * 向 CSDN 发送表单数据
   *
   * @param url 请求地址
   * @param formData 表单数据，默认为undefined，支持 ReadableStream、Blob | BufferSource | FormData | URLSearchParams | string。这里只需要 FormData
   * @param headers 请求头
   * @param forceProxy 是否强制使用代理，默认为 false
   */
  private async csdnFormFetch(url: string, formData: FormData, headers: Record<any, any> = {}, forceProxy = false) {
    const apiUrl = url

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: formData,
    }

    const resJson = await this.webFormFetch(apiUrl, [headers], formData, forceProxy)
    if (resJson.error) {
      throw new Error("CSDN 表单提交错误。详细错误 =>" + resJson.error)
    }

    return resJson
  }
}

export { CsdnWebAdaptor }
