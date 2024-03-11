/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { Post, UserBlog } from "zhi-blog-api"
import { TelegraphConfig } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import CookieUtils from "~/src/utils/cookieUtils.ts"
import md from "telegraph.md"

/**
 * Telegraph API 适配器
 *
 * @see https://telegra.ph/ telegra.ph
 */
class TelegraphApiAdaptor extends BaseBlogApi {
  private TPH_UUID_KEY = "tph_uuid"

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const checkJson = await this.telegraphFetch("/check", "page_id=0", "POST")
    if (checkJson.error) {
      throw new Error("telegra.ph request error =>" + checkJson.error)
    }
    const corsHeaders = JsonUtil.safeParse<any>(checkJson["cors-received-headers"], {})
    const cookies = corsHeaders["Set-Cookie-Array"]
    this.logger.debug("checkJson =>", checkJson)

    // 数据适配
    const userblog: UserBlog = new UserBlog()
    const cfg = this.cfg as TelegraphConfig
    userblog.blogid = checkJson.save_hash
    userblog.blogName = "telegra.ph"
    userblog.url = cfg.apiUrl
    // 元数据映射
    // @since 1.20.0
    userblog.metadataMap = {
      password: checkJson.save_hash,
      corsCookieArray: CookieUtils.addCookieArray(this.cfg?.corsCookieArray ?? [], cookies),
    }
    result.push(userblog)
    this.logger.debug("get telegraph cfg =>", result)

    return result
  }

  public async newPost(post: Post, _publish?: boolean): Promise<string> {
    const formData = new FormData()
    const content = md(post.description)
    const blobData = new Blob([JSON.stringify(content)], { type: "text/plain" })
    formData.append("Data", blobData, "content.html")
    formData.append("title", post.title)
    formData.append("author", this.cfg.username)
    formData.append("save_hash", this.cfg.password)
    formData.append("page_id", "0")

    const res = await this.telegraphFormFetch("/save", formData)
    if (res.error) {
      throw new Error(
        "telegra.ph 发布错误，注意：切换设备（包括从PC到浏览器环境）需要重新验证，并且获取新token。详细错误 =>" +
          res.error
      )
    }
    this.logger.debug("telegraph newPost resJson =>", res)

    const postMeta = {
      page_id: res.page_id,
      path: res.path,
    }
    const postid = JSON.stringify(postMeta)
    return postid
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const postMeta = JsonUtil.safeParse<any>(postid, {})

    const formData = new FormData()
    const content = md(post.description)
    const blobData = new Blob([JSON.stringify(content)], { type: "text/plain" })
    formData.append("Data", blobData, "content.html")
    formData.append("title", post.title)
    formData.append("author", this.cfg.username)
    formData.append("save_hash", this.cfg.password)
    formData.append("page_id", postMeta.page_id)

    const res = await this.telegraphFormFetch("/save", formData)
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

  public async getPreviewUrl(postid: string): Promise<string> {
    const postMeta = JsonUtil.safeParse<any>(postid, {})
    const purl = this.cfg.previewUrl ?? ""
    const postUrl = purl.replace("[postid]", postMeta?.path ?? "")
    const useProxyPreview = true
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
    header: Record<any, any> = {}
  ) {
    const contentType = "text/plain"
    const tphUuidObj = CookieUtils.getCookieObject(this.cfg.corsCookieArray, this.TPH_UUID_KEY)
    if (!StrUtil.isEmptyString(tphUuidObj[this.TPH_UUID_KEY])) {
      header["Cookie"] = `${this.TPH_UUID_KEY}=${tphUuidObj[this.TPH_UUID_KEY]}`
    }
    const headers = {
      "Content-Type": contentType,
      origin: "https://telegra.ph",
      referer: "https://telegra.ph/",
      ...header,
    }
    const body = params

    // 输出日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Telegraph 请求数据，apiUrl =>", apiUrl)
    // 使用兼容的fetch调用并返回统一的JSON数据
    this.logger.debug("向 Telegraph 请求数据，headers =>", headers)
    this.logger.debug("向 Telegraph 请求数据，body =>", body)

    const resJson = await this.apiProxyFetch(apiUrl, [headers], body, method, contentType, true)
    this.logger.debug("向 Telegraph 请求数据，resJson =>", resJson)

    return resJson ?? null
  }

  /**
   * 向 Telegraph 发送表单数据
   *
   * @param url 请求地址
   * @param formData 表单数据，默认为undefined，支持 ReadableStream、Blob | BufferSource | FormData | URLSearchParams | string。这里只需要 FormData
   */
  private async telegraphFormFetch(url: string, formData: FormData) {
    const apiUrl = `${this.cfg.apiUrl}${url}`
    let xCorsHeaders: Record<any, any> = {}

    // header

    // x-cors-headers
    const tphUuidObj = CookieUtils.getCookieObject(this.cfg.corsCookieArray, this.TPH_UUID_KEY)
    if (!StrUtil.isEmptyString(tphUuidObj[this.TPH_UUID_KEY])) {
      xCorsHeaders["Cookie"] = `${this.TPH_UUID_KEY}=${tphUuidObj[this.TPH_UUID_KEY]}`
    }
    xCorsHeaders["origin"] = "https://telegra.ph"
    xCorsHeaders["referer"] = "https://telegra.ph/"

    const headers = {
      "x-cors-headers": JSON.stringify(xCorsHeaders),
    }
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
