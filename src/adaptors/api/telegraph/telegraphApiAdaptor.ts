/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { Attachment, MediaObject, Post, UserBlog } from "zhi-blog-api"
import { TelegraphConfig, TelegraphPostType } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import CookieUtils from "~/src/utils/cookieUtils.ts"
import md from "telegraph.md"

/**
 * Telegraph API 适配器
 *
 * @see https://telegra.ph/ telegra.ph
 */
class TelegraphApiAdaptor extends BaseBlogApi {
  private TPH_TOKEN_KEY = "tph_token"
  private TPH_UUID_KEY = "tph_uuid"

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const tgCfg = this.cfg as TelegraphConfig
    const result: UserBlog[] = []

    if (tgCfg.postType === TelegraphPostType.LOGIN_USER) {
      if (
        StrUtil.isEmptyString(tgCfg.password) ||
        StrUtil.isEmptyString(tgCfg.accessToken) ||
        StrUtil.isEmptyString(tgCfg.saveHash)
      ) {
        throw new Error("登录模式必须手动填写 uuid 、 Access Token 和 save hash，请从浏览器开发者工具获取")
      }

      // 数据适配
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = tgCfg.saveHash
      userblog.blogName = "telegra.ph"
      userblog.url = tgCfg.apiUrl
    } else {
      const contentType = "text/plain"
      let xCorsHeaders: Record<any, any> = {}

      // x-cors-headers
      xCorsHeaders["origin"] = "https://telegra.ph"
      xCorsHeaders["referer"] = "https://telegra.ph/"
      xCorsHeaders["Content-Type"] = contentType

      const headers = {
        // for cors proxy
        // siyuan proxy should ignore this header
        "x-cors-headers": JSON.stringify(xCorsHeaders),
      }
      for (const [xkey, xvalue] of Object.entries(xCorsHeaders)) {
        headers[xkey] = xvalue
      }

      let cookies: any
      let checkJson = await this.telegraphFetch("/check", "page_id=0", "POST", headers, contentType)
      this.logger.debug("checkJson =>", checkJson)

      if (checkJson["cors-received-headers"]) {
        // use cors proxy
        if (checkJson.error) {
          throw new Error("telegra.ph request error =>" + checkJson.error)
        }
        const corsHeaders = JsonUtil.safeParse<any>(checkJson["cors-received-headers"], {})
        cookies = corsHeaders["Set-Cookie-Array"]
      } else {
        // use siyuan proxy
        if (checkJson.status == 200) {
          cookies = checkJson.headers["Set-Cookie"]
          const body = JsonUtil.safeParse(checkJson.body, {})
          checkJson = {
            ...checkJson,
            ...body,
          }
        } else {
          throw new Error(`telegra.ph request error ${checkJson.status}=>` + checkJson.body)
        }
      }

      // 数据适配
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = checkJson.save_hash
      userblog.blogName = "telegra.ph"
      userblog.url = tgCfg.apiUrl

      // 元数据映射
      // @since 1.20.0
      const { isUpdated, cookieArray } = CookieUtils.addCookieArray(
        tgCfg?.corsCookieArray ?? [],
        cookies,
        tgCfg.forceReAuth
      )
      this.logger.info(`是否需要刷新：${isUpdated}，是否强制刷新：${tgCfg.forceReAuth}`)
      if (isUpdated) {
        // cookies 每一次都是最新的
        const tphUuidObj = CookieUtils.getCookieObject(cookies, this.TPH_UUID_KEY)
        userblog.metadataMap = {
          username: checkJson.author_name,
          password: tphUuidObj[this.TPH_UUID_KEY],
          saveHash: checkJson.save_hash,
          corsCookieArray: cookieArray,
        }
      } else {
        this.logger.warn("Cookie 还在有效期，可等待 Cookie 过期之后再进行操作", cookieArray)
      }

      result.push(userblog)
    }

    this.logger.debug("get telegraph cfg =>", result)

    return result
  }

  public async newPost(post: Post, _publish?: boolean): Promise<string> {
    const tgCfg = this.cfg as TelegraphConfig

    let xCorsHeaders: Record<any, any> = {}

    // x-cors-headers
    let requestCookie: string
    const uuidCookie = `${this.TPH_UUID_KEY}=${tgCfg.password}`
    if (tgCfg.postType == TelegraphPostType.ANONYMOUS) {
      if (StrUtil.isEmptyString(tgCfg.password)) {
        throw new Error(`Cookie ${this.TPH_UUID_KEY} 获取失败，无法新建文章`)
      }
      requestCookie = uuidCookie
      this.logger.warn("当前为匿名发布")
    } else {
      if (StrUtil.isEmptyString(tgCfg.password) || StrUtil.isEmptyString(tgCfg.accessToken)) {
        throw new Error(`Cookie ${this.TPH_UUID_KEY},${this.TPH_TOKEN_KEY} 获取失败，无法新建文章`)
      }
      const tokenCookie = `${this.TPH_TOKEN_KEY}=${tgCfg.accessToken}`
      requestCookie = [uuidCookie, tokenCookie].join(";")
    }
    xCorsHeaders["Cookie"] = requestCookie ?? ""
    xCorsHeaders["origin"] = "https://telegra.ph"
    xCorsHeaders["referer"] = "https://telegra.ph/"

    const headers = {
      // for cors proxy
      // siyuan proxy should ignore this header
      "x-cors-headers": JSON.stringify(xCorsHeaders),
    }
    for (const [xkey, xvalue] of Object.entries(xCorsHeaders)) {
      headers[xkey] = xvalue
    }

    // 这里不用这个，因为 telegraph 必须强制代理
    // const { FormData, Blob } = FormDataUtils.getFormData(this.appInstance)

    const formData = new FormData()
    const content = md(post.description)
    const blobData = new Blob([JSON.stringify(content)], { type: "text/plain" })
    formData.append("Data", blobData, "content.html")
    formData.append("title", post.title)
    formData.append("author", tgCfg.username)
    formData.append("save_hash", tgCfg.saveHash)
    formData.append("page_id", "0")

    const res = await this.telegraphFormFetch("/save", formData, headers)
    if (res.error) {
      throw new Error(
        "telegra.ph 发布错误，注意：切换设备（包括从PC到浏览器环境）需要重新验证，并且获取新token。详细错误 =>" +
          res.error
      )
    }
    this.logger.debug("telegraph newPost resJson =>", res)

    const postMeta = {
      update_cookie: requestCookie,
      page_id: res.page_id,
      path: res.path,
      save_hash: tgCfg.saveHash,
    }
    const postid = JSON.stringify(postMeta)
    return postid
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const tgCfg = this.cfg as TelegraphConfig
    const postMeta = JsonUtil.safeParse<any>(postid, {})

    let xCorsHeaders: Record<any, any> = {}

    // x-cors-headers
    if (StrUtil.isEmptyString(postMeta.update_cookie)) {
      throw new Error("Cookie 获取失败，无法更新文章")
    }

    xCorsHeaders["Cookie"] = postMeta.update_cookie
    xCorsHeaders["origin"] = "https://telegra.ph"
    xCorsHeaders["referer"] = "https://telegra.ph/"

    const headers = {
      // for cors proxy
      // siyuan proxy should ignore this header
      "x-cors-headers": JSON.stringify(xCorsHeaders),
    }
    for (const [xkey, xvalue] of Object.entries(xCorsHeaders)) {
      headers[xkey] = xvalue
    }

    // 这里不用这个，因为 telegraph 必须强制代理
    // const { FormData, Blob } = FormDataUtils.getFormData(this.appInstance)

    const formData = new FormData()
    const content = md(post.description)
    const blobData = new Blob([JSON.stringify(content)], { type: "text/plain" })
    formData.append("Data", blobData, "content.html")
    formData.append("title", post.title)
    formData.append("author", tgCfg.username)
    formData.append("save_hash", postMeta.save_hash)
    formData.append("page_id", postMeta.page_id)

    const res = await this.telegraphFormFetch("/save", formData, headers)
    if (res.error) {
      throw new Error(
        "telegra.ph 更新失败，注意：切换设备（包括从PC到浏览器环境）需要重新验证，并且获取新token。详细错误 =>" +
          res.error
      )
    }
    this.logger.debug("telegraph editPost resJson =>", res)

    return true
  }

  public async deletePost(postid: string): Promise<boolean> {
    throw new Error("telegra.ph 暂不支持删除文章功能")
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const commonPost = new Post()
    commonPost.postid = postid
    return commonPost
  }

  // 已失效，上传功能无法实现
  // public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
  //   const tgCfg = this.cfg as TelegraphConfig
  //
  //   let xCorsHeaders: Record<any, any> = {}
  //
  //   // x-cors-headers
  //   let requestCookie: string
  //   const uuidCookie = `${this.TPH_UUID_KEY}=${tgCfg.password}`
  //   if (tgCfg.postType == TelegraphPostType.ANONYMOUS) {
  //     if (StrUtil.isEmptyString(tgCfg.password)) {
  //       throw new Error(`Cookie ${this.TPH_UUID_KEY} 获取失败，无法上传附件`)
  //     }
  //     requestCookie = uuidCookie
  //     this.logger.warn("当前为匿名发布")
  //   } else {
  //     if (StrUtil.isEmptyString(tgCfg.password) || StrUtil.isEmptyString(tgCfg.accessToken)) {
  //       throw new Error(`Cookie ${this.TPH_UUID_KEY},${this.TPH_TOKEN_KEY} 获取失败，无法上传附件`)
  //     }
  //     const tokenCookie = `${this.TPH_TOKEN_KEY}=${tgCfg.accessToken}`
  //     requestCookie = [uuidCookie, tokenCookie].join(";")
  //   }
  //   xCorsHeaders["Cookie"] = requestCookie ?? ""
  //   xCorsHeaders["origin"] = "https://telegra.ph"
  //   xCorsHeaders["referer"] = "https://telegra.ph/"
  //
  //   const headers = {
  //     // for cors proxy
  //     // siyuan proxy should ignore this header
  //     "x-cors-headers": JSON.stringify(xCorsHeaders),
  //   }
  //   for (const [xkey, xvalue] of Object.entries(xCorsHeaders)) {
  //     headers[xkey] = xvalue
  //   }
  //
  //   const bits = mediaObject.bits
  //   const formData = new FormData()
  //   const blob = new Blob([bits], { type: mediaObject.type })
  //   formData.append("file", blob, mediaObject.name)
  //   const res = await this.telegraphFormFetch("/upload", formData)
  //   this.logger.debug("telegraph upload success, res =>", res)
  // }

  public async getPreviewUrl(postid: string): Promise<string> {
    const postMeta = JsonUtil.safeParse<any>(postid, {})
    const purl = this.cfg.previewUrl ?? ""
    const postUrl = purl.replace("[postid]", postMeta?.path ?? "")
    const useProxyPreview = false
    if (useProxyPreview && !StrUtil.isEmptyString(this.cfg.corsAnywhereUrl)) {
      const proxyHome = StrUtil.pathJoin(this.cfg.corsAnywhereUrl, this.cfg.home ?? "")
      return StrUtil.pathJoin(`${proxyHome}`, postUrl)
    }
    return postUrl
  }

  // ================
  // private methods
  // ================
  /**
   * 向 Telegraph 请求数据
   */
  private async telegraphFetch(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    headers: Record<any, any> = {},
    contentType: string = "application/json"
  ) {
    const body = params

    // 输出日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Telegraph 请求数据，apiUrl =>", apiUrl)
    // 使用兼容的fetch调用并返回统一的JSON数据
    this.logger.debug("向 Telegraph 请求数据，headers =>", headers)
    this.logger.debug("向 Telegraph 请求数据，body =>", body)

    const resJson = await this.apiFetch(apiUrl, [headers], body, method, contentType, true)
    this.logger.debug("向 Telegraph 请求数据，resJson =>", resJson)

    return resJson ?? null
  }

  /**
   * 向 Telegraph 发送表单数据
   *
   * @param url 请求地址
   * @param formData 表单数据，默认为undefined，支持 ReadableStream、Blob | BufferSource | FormData | URLSearchParams | string。这里只需要 FormData
   * @param headers
   */
  private async telegraphFormFetch(url: string, formData: FormData, headers: Record<any, any> = {}) {
    const apiUrl = `${this.cfg.apiUrl}${url}`

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: formData,
    }

    this.logger.debug("向 Telegraph 发送表单数据，apiUrl =>", apiUrl)
    this.logger.debug("向 Telegraph 发送表单数据，options =>", options)

    const resJson = await this.apiFormFetch(apiUrl, [headers], formData, true)
    if (resJson.error) {
      throw new Error(
        "telegra.ph 发布错误，注意：切换设备（包括从PC到浏览器环境）需要重新验证，并且获取新token。详细错误 =>" +
          resJson.error
      )
    }
    this.logger.debug("向 Telegraph 发送表单数据，resJson =>", resJson)

    return resJson
  }
}

export { TelegraphApiAdaptor }
