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

import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Attachment, CategoryInfo, MediaObject, Post, UserBlog } from "zhi-blog-api"
import { AliasTranslator, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Base64 } from "js-base64"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"
import { PostRequest } from "@halo-dev/api-client"
import { HaloPostMeta } from "~/src/adaptors/api/halo/HaloPostMeta.ts"

/**
 * Halo API 适配器
 * @see [Halo API](https://github.com/halo-sigs/vscode-extension-halo/blob/main/src/service/index.ts)
 * @see [Halo docs](https://docs.halo.run/getting-started/install/docker-compose/)
 */
class HaloApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: HaloConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("halo-api-adaptor")
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

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const params: PostRequest = {
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
        rawType: "HTML",
      },
    }

    params.content.raw = post.html
    params.content.content = post.description

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
    const res = await this.haloFetch("/apis/api.console.halo.run/v1alpha1/posts", params, "POST")
    this.logger.debug("halo newPost res =>", res)
    if (!res?.metadata?.name) {
      throw new Error("Halo 文章发布失败")
    }
    this.logger.debug("halo 文章草稿完成")

    // 发布
    await this.haloFetch(`/apis/api.console.halo.run/v1alpha1/posts/${params.post.metadata.name}/publish`, {}, "PUT")
    this.logger.debug("halo 文章发布完成")

    // 生成文章ID
    const postidMeta = new HaloPostMeta(res.spec.slug, res.metadata.name, post.dateCreated)
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
      let params: PostRequest = await this.getHaloPost(name)
      this.logger.debug("get latest halo post =>", { name: name, haloPost: params })

      if (!params.post) {
        throw new Error("获取文章信息失败，如果文章删除，请强制删除解除关联")
      }

      params.content.raw = post.html
      params.content.content = post.description

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
      await this.haloFetch(`/apis/content.halo.run/v1alpha1/posts/${name}`, params.post, "PUT")
      await this.haloFetch(`/apis/api.console.halo.run/v1alpha1/posts/${name}/content`, params.content, "PUT")

      // 重新发布
      await this.haloFetch(
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
    const res = await this.haloFetch(recycleUrl, {}, "PUT")
    this.logger.debug("halo deletePost res =>", res)

    if (!res?.metadata?.name) {
      throw new Error("Halo 文章删除失败")
    }
    return true
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const hcs: any[] = await this.getHaloCategories()
    if (hcs && hcs.length > 0) {
      // 数据适配
      hcs.forEach((item: any) => {
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

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    let res: any
    try {
      const bits = mediaObject.bits
      this.logger.debug("newMediaObject on halo =>", mediaObject)

      // import
      const win = this.appInstance.win
      if (!win.require) {
        throw new Error("非常抱歉，目前仅思源笔记PC客户端支持上传图片")
      }
      const { FormData, Blob } = win.require(`${this.appInstance.moduleBase}libs/node-fetch-cjs/dist/index.js`)
      const blob = new Blob([bits], { type: mediaObject.type })

      // uploadUrl
      const uploadUrl = `${this.cfg.apiUrl}/apis/api.console.halo.run/v1alpha1/attachments/upload`

      // formData
      const formData = new FormData()
      formData.append("file", blob, mediaObject.name)
      formData.append("policyName", "default-policy")
      formData.append("groupName", "")
      formData.append("file", blob, mediaObject.name)

      // 发送请求
      res = await this.haloFormFetch(uploadUrl, formData)
      this.logger.debug("halo upload success, res =>", res)
      if (!res.metadata) {
        throw new Error("Halo图片上传失败 =>" + mediaObject.name)
      }
    } catch (e) {
      this.logger.error("Error uploading image to halo:", e)
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
  private getHaloPostidKey(postid: string): HaloPostMeta {
    const postidJson = JsonUtil.safeParse<HaloPostMeta>(postid, {} as HaloPostMeta)
    return postidJson
  }

  private async getHaloPost(name: string): Promise<PostRequest | undefined> {
    try {
      const post = await this.haloFetch(`/apis/content.halo.run/v1alpha1/posts/${name}`, {}, "GET")

      const content = await this.haloFetch(
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

  public async getCategoryNames(displayNames: string[]): Promise<string[]> {
    const allCategories = await this.getHaloCategories()

    const notExistDisplayNames = displayNames.filter(
      (name) => !allCategories.find((item) => item.spec.displayName === name)
    )

    const newCategories = await Promise.all(
      notExistDisplayNames.map(async (name, index) => {
        const slug = await AliasTranslator.getPageSlug(name, true)
        const category = await this.haloFetch(
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

  private async getHaloCategories() {
    const categories = await this.haloFetch("/apis/content.halo.run/v1alpha1/categories", {}, "GET")
    return Promise.resolve(categories.items)
  }

  public async getTagNames(displayNames: string[]): Promise<string[]> {
    const allTags = await this.getHaloTags()

    const notExistDisplayNames = displayNames.filter((name) => !allTags.find((item) => item.spec.displayName === name))

    const newTags = await Promise.all(
      notExistDisplayNames.map(async (name) => {
        const slug = await AliasTranslator.getPageSlug(name, true)
        const tag = await this.haloFetch(
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

  private async getHaloTags() {
    const categories = await this.haloFetch("/apis/content.halo.run/v1alpha1/tags", {}, "GET")
    return Promise.resolve(categories.items)
  }

  /**
   * 向 Halo 请求数据
   *
   * @param url 请求地址
   * @param params 数据
   * @param method 请求方法 GET | POST | PUT | DELETE
   * @param header 请求头
   * @private
   */
  private async haloFetch(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    header: Record<any, any> = {}
  ): Promise<any> {
    const contentType = "application/json"
    const basicAuth = "Basic " + Base64.btoa(this.cfg.username + ":" + this.cfg.password)
    const headers = {
      "Content-Type": contentType,
      Authorization: basicAuth,
      ...header,
    }

    // 打印日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Halo 请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向 Halo 请求数据，params =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? "" : JSON.stringify(params)
    const resJson = await this.apiProxyFetch(apiUrl, [headers], body, method, contentType)
    this.logger.debug("向 Halo 请求数据，resJson =>", resJson)

    return resJson ?? null
  }

  /**
   * 向 Halo 发送表单数据
   *
   * @param url 请求地址
   * @param formData 表单数据
   * @private
   */
  private async haloFormFetch(url: string, formData: FormData) {
    const basicAuth = "Basic " + Base64.btoa(this.cfg.username + ":" + this.cfg.password)
    const header = {
      Authorization: basicAuth,
    }

    const resJson = await this.apiFormFetch(url, [header], formData)
    return resJson
  }
}

export { HaloApiAdaptor }
