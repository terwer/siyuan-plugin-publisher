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
import { Attachment, CategoryInfo, MediaObject, Post, TagInfo, UserBlog } from "zhi-blog-api"
import { AliasTranslator, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { HalowebPostMeta } from "~/src/adaptors/web/haloweb/HalowebPostMeta.ts"
import sypIdUtil from "~/src/utils/sypIdUtil"
import FormDataUtils from "~/src/utils/FormDataUtils.ts"

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

    const cates = await this.getHaloCategories()
    // 数据适配
    cates.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.spec.slug
      userblog.blogName = item.spec.displayName
      userblog.url = item.status.permalink
      result.push(userblog)
    })
    this.logger.debug("get halo categories =>", result)

    return result
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const haloPostKey = this.getHaloPostidKey(postid)
    const name = haloPostKey.name

    // 加载最新
    const haloPost = await this.getHaloPost(name)
    this.logger.debug("getPost haloPost =>", { name: name, haloPost: haloPost })

    const commonPost = new Post()
    commonPost.title = haloPost.post.spec.title
    commonPost.wp_slug = haloPost.post.spec.slug
    commonPost.shortDesc = haloPost.post.spec.excerpt.raw

    commonPost.tags_slugs = haloPost.post.spec.tags.join(",")
    commonPost.cate_slugs = haloPost.post.spec.categories

    return commonPost
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const params: any = {
      post: {
        spec: {
          title: "",
          slug: "",
          template: "",
          cover: "",
          deleted: false,
          publish: false,
          publishTime: undefined,
          pinned: false,
          allowComment: true,
          visible: "PUBLIC",
          priority: 0,
          excerpt: {
            autoGenerate: true,
            raw: "",
          },
          categories: [],
          tags: [],
          htmlMetas: [],
        },
        apiVersion: "content.halo.run/v1alpha1",
        kind: "Post",
        metadata: {
          name: "",
          annotations: {},
        },
      },
      content: {
        raw: "",
        content: "",
        rawType: this.cfg.pageType,
      },
    }

    // 根据发布类型确定 raw 的数据
    if (this.cfg.pageType === "markdown") {
      params.content.raw = post.markdown
    } else {
      params.content.raw = post.html
    }
    params.content.content = post.html

    if (StrUtil.isEmptyString(post.shortDesc)) {
      params.post.spec.excerpt.autoGenerate = true
    } else {
      params.post.spec.excerpt.autoGenerate = false
      params.post.spec.excerpt.raw = post.shortDesc
    }

    params.post.metadata.name = sypIdUtil.randomUuid()
    params.post.spec.title = post.title
    params.post.spec.slug = post.wp_slug

    // 标签和分类
    try {
      if (post.categories && post.categories.length > 0) {
        const categoryNames = await this.getCategoryNames(post.categories)
        params.post.spec.categories = categoryNames
      }
      if (!StrUtil.isEmptyString(post.mt_keywords)) {
        const tags = post.mt_keywords.split(",")
        const tagNames = await this.getTagNames(tags)
        params.post.spec.tags = tagNames
      }
    } catch (e) {
      throw e
    }

    // 发布时间
    params.post.spec.publishTime = post.dateCreated.toISOString()

    // 草稿
    const res = await this.halowebFetch("/apis/api.console.halo.run/v1alpha1/posts", params, "POST")
    this.logger.debug("halo newPost res =>", res)
    if (!res?.metadata?.name) {
      throw new Error("Halo 文章发布失败")
    }
    this.logger.debug("halo 文章草稿完成")

    // 发布
    await this.halowebFetch(`/apis/api.console.halo.run/v1alpha1/posts/${params.post.metadata.name}/publish`, {}, "PUT")
    this.logger.debug("halo 文章发布完成")

    // 生成文章ID
    const postidMeta = new HalowebPostMeta(res.spec.slug, res.metadata.name, post.dateCreated)
    this.logger.debug("postidMeta =>", postidMeta)

    // 需要更新一次，否则

    return JSON.stringify(postidMeta)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    let flag = false
    try {
      const haloPostKey = this.getHaloPostidKey(postid)
      const name = haloPostKey.name

      // 加载最新
      let params = await this.getHaloPost(name)
      this.logger.debug("get latest halo post =>", { name: name, haloPost: params })

      if (!params.post) {
        throw new Error("获取文章信息失败，如果文章删除，请强制删除解除关联")
      }

      // 根据已发布类型确定 raw 的数据
      if (params.content.rawType === "markdown") {
        params.content.raw = post.markdown
      } else {
        params.content.raw = post.html
      }
      params.content.content = post.html

      if (StrUtil.isEmptyString(post.shortDesc)) {
        params.post.spec.excerpt.autoGenerate = true
      } else {
        params.post.spec.excerpt.autoGenerate = false
        params.post.spec.excerpt.raw = post.shortDesc
      }

      params.post.metadata.name = name
      params.post.spec.title = post.title
      params.post.spec.slug = post.wp_slug

      // 标签和分类
      if (post.categories && post.categories.length > 0) {
        const categoryNames = await this.getCategoryNames(post.categories)
        params.post.spec.categories = categoryNames
      }
      if (!StrUtil.isEmptyString(post.mt_keywords)) {
        const tags = post.mt_keywords.split(",")
        const tagNames = await this.getTagNames(tags)
        params.post.spec.tags = tagNames
      }

      // 发布时间
      params.post.spec.publishTime = post.dateCreated.toISOString()

      // 更新文章信息
      await this.halowebFetch(`/apis/content.halo.run/v1alpha1/posts/${name}`, params.post, "PUT")
      await this.halowebFetch(`/apis/api.console.halo.run/v1alpha1/posts/${name}/content`, params.content, "PUT")

      // 重新发布
      await this.halowebFetch(
        `/apis/api.console.halo.run/v1alpha1/posts/${params.post.metadata.name}/publish`,
        {},
        "PUT"
      )
      this.logger.debug("halo 文章发布完成")
    } catch (e) {
      this.logger.error("Halo文章更新失败", e)
    }

    return flag
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const haloPostKey = this.getHaloPostidKey(postid)
    const postUrl = this.cfg.previewUrl
      .replace("{slug}", haloPostKey.slug)
      .replace("{name}", haloPostKey.name)
      .replace("{year}", haloPostKey.year)
      .replace("{month}", haloPostKey.month)
      .replace("{day}", haloPostKey.day)
    return postUrl
    // return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async deletePost(postid: string): Promise<boolean> {
    const haloPostKey = this.getHaloPostidKey(postid)
    // const unPublishUrl = `/apis/api.console.halo.run/v1alpha1/posts/${haloPostKey.name}/unpublish`
    const recycleUrl = `/apis/api.console.halo.run/v1alpha1/posts/${haloPostKey.name}/recycle`
    const res = await this.halowebFetch(recycleUrl, {}, "PUT")
    this.logger.debug("halo deletePost res =>", res)

    if (!res?.metadata?.name) {
      throw new Error("Halo 文章删除失败")
    }
    return true
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const allCates = await this.getHaloCategories()

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
    const allTags = await this.getHaloTags()
    return allTags.map((tag: any) => {
      const tagInfo = new TagInfo()
      tagInfo.tagId = tag.spec.slug
      tagInfo.tagName = tag.spec.displayName
      tagInfo.description = tag.spec.displayName
      return tagInfo
    })
  }

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    let res: any
    try {
      const bits = mediaObject.bits
      this.logger.debug("newMediaObject on halo =>", mediaObject)

      // get formData and Blob
      const { FormData, Blob } = FormDataUtils.getFormData(this.appInstance)

      // uploadUrl
      const uploadUrl = `/apis/api.console.halo.run/v1alpha1/attachments/upload`

      // formData
      const blob = new Blob([bits], { type: mediaObject.type })
      const formData = new FormData()
      formData.append("file", blob, mediaObject.name)
      formData.append("policyName", "default-policy")
      formData.append("groupName", "")
      formData.append("file", blob, mediaObject.name)

      // 发送请求
      res = await this.halowebFormFetch(uploadUrl, formData)

      this.logger.debug("halo upload success, res =>", res)
      if (!res.metadata) {
        throw new Error("Halo图片上传失败 =>" + mediaObject.name)
      }
    } catch (e) {
      this.logger.error("Error uploading image to halo:", e)
      throw new Error("Error uploading image to halo:" + e.toString())
    }

    const siteImgId = res?.spec?.displayName
    const siteArticleId = res?.metadata?.name
    const siteImgUrl = this.cfg.home + (res?.metadata?.annotations["storage.halo.run/uri"] ?? "")
    return {
      attachment_id: siteImgId,
      date_created_gmt: new Date(),
      parent: 0,
      link: siteImgUrl,
      title: mediaObject.name,
      caption: "",
      description: "",
      metadata: {
        width: 0,
        height: 0,
        file: "",
        filesize: 0,
        sizes: [],
      },
      type: mediaObject.type,
      thumbnail: "",
      id: siteArticleId,
      file: mediaObject.name,
      url: siteImgUrl,
    }
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

  public async getCategoryNames(displayNames: string[]): Promise<string[]> {
    const allCategories = await this.getHaloCategories()

    const notExistDisplayNames = displayNames.filter(
      (name) => !allCategories.find((item) => item.spec.displayName === name)
    )

    const newCategories = await Promise.all(
      notExistDisplayNames.map(async (name, index) => {
        const slug = await AliasTranslator.getPageSlug(name, true)
        const category = await this.halowebFetch(
          "/apis/content.halo.run/v1alpha1/categories",
          {
            spec: {
              displayName: name,
              slug: slug,
              description: "",
              cover: "",
              template: "",
              priority: allCategories.length + index,
              children: [],
            },
            apiVersion: "content.halo.run/v1alpha1",
            kind: "Category",
            metadata: { name: "", generateName: "category-" },
          },
          "POST"
        )
        return category
      })
    )

    const existNames = displayNames
      .map((name) => {
        const found = allCategories.find((item) => item.spec.displayName === name)
        return found ? found.metadata.name : undefined
      })
      .filter(Boolean) as string[]

    this.logger.debug("newCategories =>", newCategories)
    return [...existNames, ...newCategories.map((item) => item.metadata.name)]
  }

  public async getTagNames(displayNames: string[]): Promise<string[]> {
    const allTags = await this.getHaloTags()

    const notExistDisplayNames = displayNames.filter((name) => !allTags.find((item) => item.spec.displayName === name))

    const newTags = await Promise.all(
      notExistDisplayNames.map(async (name) => {
        const slug = await AliasTranslator.getPageSlug(name, true)
        const tag = await this.halowebFetch(
          "/apis/content.halo.run/v1alpha1/tags",
          {
            spec: {
              displayName: name,
              slug: slug,
              color: "#ffffff",
              cover: "",
            },
            apiVersion: "content.halo.run/v1alpha1",
            kind: "Tag",
            metadata: { name: "", generateName: "tag-" },
          },
          "POST"
        )
        return tag
      })
    )

    const existNames = displayNames
      .map((name) => {
        const found = allTags.find((item) => item.spec.displayName === name)
        return found ? found.metadata.name : undefined
      })
      .filter(Boolean) as string[]

    this.logger.debug("newTags =>", newTags)
    return [...existNames, ...newTags.map((item) => item.metadata.name)]
  }

  private async getHaloCategories(): Promise<any[]> {
    const hcs = await this.halowebFetch("/apis/content.halo.run/v1alpha1/categories", {}, "GET")
    return hcs.items
  }

  private async getHaloPost(name: string): Promise<any> {
    try {
      const post = await this.halowebFetch(`/apis/content.halo.run/v1alpha1/posts/${name}`, {}, "GET")

      const content = await this.halowebFetch(
        `/apis/api.console.halo.run/v1alpha1/posts/${name}/head-content`,
        {},
        "GET"
      )

      return Promise.resolve({
        post: post,
        content: content,
      })
    } catch (error) {
      return Promise.resolve(undefined)
    }
  }

  private async getHaloTags() {
    const tags = await this.halowebFetch("/apis/content.halo.run/v1alpha1/tags", {}, "GET")
    const allTags = tags.items
    return allTags
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

    // 打印日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Halo 请求数据，apiUrl =>", apiUrl)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? "" : JSON.stringify(params)
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
    const apiUrl = `${this.cfg.apiUrl}${url}`

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

    const resJson = await this.webFormFetch(apiUrl, [mergedHeaders], formData)
    if (resJson.error) {
      throw new Error("Halo网页版表单提交错误。详细错误 =>" + resJson.error)
    }
    this.logger.debug("向Halo网页版发送表单数据，resJson =>", resJson)

    return resJson
  }
}

export { HalowebWebAdaptor }
