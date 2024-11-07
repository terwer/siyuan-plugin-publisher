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

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { CategoryInfo, TagInfo, UserBlog } from "zhi-blog-api"
import { JsonUtil } from "zhi-common"
import { HalowebPostMeta } from "~/src/adaptors/web/haloweb/HalowebPostMeta.ts"

/**
 * Halo 网页授权适配器
 */
class HalowebWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.halowebFetch("/actuator/globalinfo")
    const flag = !!res.externalUrl
    this.logger.info(`get haloweb metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: "",
      title: "",
      avatar: "",
      type: "haloweb",
      displayName: "Halo网页版",
      supportTypes: ["markdown", "html"],
      home: res.externalUrl,
      icon: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    }
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    return result
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const haloPostKey = this.getHaloPostidKey(postid)
    const postUrl = this.cfg.previewUrl
    //   .replace("{slug}", haloPostKey.slug)
    //   .replace("{name}", haloPostKey.name)
    //   .replace("{year}", haloPostKey.year)
    //   .replace("{month}", haloPostKey.month)
    //   .replace("{day}", haloPostKey.day)
    return postUrl
    // return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const hcs = await this.halowebFetch("/apis/content.halo.run/v1alpha1/categories", {}, "GET")
    const allCates = hcs.items
    if (allCates && allCates.length > 0) {
      // 数据适配
      allCates.forEach((item: any) => {
        const cat = new CategoryInfo()
        cat.categoryId = item.spec.slug
        cat.categoryName = item.spec.displayName
        cat.description = item.spec.displayName
        cat.categoryDescription = item.spec.description
        cats.push(cat)
      })
      this.logger.debug("get halo categories =>", cats)
    }

    return cats
  }

  public async getTags(): Promise<TagInfo[]> {
    const tags = await this.halowebFetch("/apis/content.halo.run/v1alpha1/tags", {}, "GET")
    const allTags = tags.items
    return allTags.map((tag: any) => {
      const tagInfo = new TagInfo()
      tagInfo.tagId = tag.spec.slug
      tagInfo.tagName = tag.spec.displayName
      tagInfo.description = tag.spec.displayName
      return tagInfo
    })
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
  private getHaloPostidKey(postid: string): HalowebPostMeta {
    const postidJson = JsonUtil.safeParse<HalowebPostMeta>(postid, {} as HalowebPostMeta)
    return postidJson
  }

  /**
   * 向Halo网页版请求数据
   */
  private async halowebFetch(
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
    const apiUrl = this.cfg.home + url
    this.logger.debug("向Halo网页版请求数据，apiUrl =>", apiUrl)
    // 使用兼容的fetch调用并返回统一的JSON数据
    this.logger.debug("向Halo网页版请求数据，headers =>", headers)
    this.logger.debug("向Halo网页版请求数据，body =>", body)

    const resJson = await this.webFetch(apiUrl, [mergedHeaders], body, method, contentType, true, "base64")
    this.logger.debug("向Halo网页版请求数据，resJson =>", resJson)

    return resJson ?? null
  }

  /**
   * 向Halo网页版发送表单数据
   *
   * @param url 请求地址
   * @param formData 表单数据，默认为undefined，支持 ReadableStream、Blob | BufferSource | FormData | URLSearchParams | string。这里只需要 FormData
   * @param headers 请求头
   */
  private async halowebFormFetch(url: string, formData: BodyInit, headers: Record<any, any> = {}) {
    const apiUrl = this.cfg.home + url

    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    const options: RequestInit = {
      method: "POST",
      headers: mergedHeaders,
      body: formData,
    }

    this.logger.debug("向Halo网页版发送表单数据，apiUrl =>", apiUrl)
    this.logger.debug("向Halo网页版发送表单数据，options =>", options)

    const resJson = await this.webFormFetch(apiUrl, [mergedHeaders], formData, true)
    if (resJson.error) {
      throw new Error("Halo网页版表单提交错误。详细错误 =>" + resJson.error)
    }
    this.logger.debug("向Halo网页版发送表单数据，resJson =>", resJson)

    return resJson
  }
}

export { HalowebWebAdaptor }
