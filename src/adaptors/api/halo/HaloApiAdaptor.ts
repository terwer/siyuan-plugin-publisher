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
import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import { AliasTranslator, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Base64 } from "js-base64"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"
import {
  Category,
  CategoryList,
  ListedPost,
  ListedPostList,
  Policy,
  PostRequest,
  Tag,
  TagList,
} from "@halo-dev/api-client"
import { HaloPostMeta } from "~/src/adaptors/api/halo/HaloPostMeta.ts"
import HaloUtils from "~/src/adaptors/api/halo/haloUtils.ts"

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
    if (post.categories && post.categories.length > 0) {
      const categoryNames = await this.getCategoryNames(post.categories)
      params.post.spec.categories = categoryNames
    }
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      const tags = post.mt_keywords.split(",")
      const tagNames = await this.getTagNames(tags)
      params.post.spec.tags = tagNames
    }

    // 草稿
    const res = await this.haloRequest("/apis/api.console.halo.run/v1alpha1/posts", params, "POST")
    this.logger.debug("halo newPost res =>", res)
    if (!res?.metadata?.name) {
      throw new Error("Halo 文章发布失败")
    }
    this.logger.debug("halo 文章草稿完成")

    // 发布
    await this.haloRequest(`/apis/api.console.halo.run/v1alpha1/posts/${params.post.metadata.name}/publish`, {}, "PUT")
    this.logger.debug("halo 文章发布完成")

    // 生成文章ID
    const postidMeta = new HaloPostMeta(res.spec.slug, res.metadata.name, post.dateCreated)
    this.logger.debug("postidMeta =>", postidMeta)
    return JSON.stringify(postidMeta)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    let flag = false
    try {
      const haloPostKey = this.getHaloPostidKey(postid)
      const name = haloPostKey.name
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

      await this.haloRequest(`/apis/content.halo.run/v1alpha1/posts/${name}`, params.post, "PUT")
      await this.haloRequest(`/apis/api.console.halo.run/v1alpha1/posts/${name}/content`, params.content, "PUT")
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
    return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async deletePost(postid: string): Promise<boolean> {
    const haloPostKey = this.getHaloPostidKey(postid)
    // const unPublishUrl = `/apis/api.console.halo.run/v1alpha1/posts/${haloPostKey.name}/unpublish`
    const recycleUrl = `/apis/api.console.halo.run/v1alpha1/posts/${haloPostKey.name}/recycle`
    const res = await this.haloRequest(recycleUrl, {}, "PUT")
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

  public async getCategoryNames(displayNames: string[]): Promise<string[]> {
    const allCategories = await this.getHaloCategories()

    const notExistDisplayNames = displayNames.filter(
      (name) => !allCategories.find((item) => item.spec.displayName === name)
    )

    const promises = notExistDisplayNames.map(async (name, index) => {
      const slug = await AliasTranslator.getPageSlug(name, true)
      return this.haloRequest(
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
    })

    const newCategories = await Promise.all(promises)

    const existNames = displayNames
      .map((name) => {
        const found = allCategories.find((item) => item.spec.displayName === name)
        return found ? found.metadata.name : undefined
      })
      .filter(Boolean) as string[]

    return [...existNames, ...newCategories.map((item) => item.data.metadata.name)]
  }

  private async getHaloCategories() {
    const categories = await this.haloRequest("/apis/content.halo.run/v1alpha1/categories", {}, "GET")
    return Promise.resolve(categories.items)
  }

  public async getTagNames(displayNames: string[]): Promise<string[]> {
    const allTags = await this.getHaloTags()

    const notExistDisplayNames = displayNames.filter((name) => !allTags.find((item) => item.spec.displayName === name))

    const promises = notExistDisplayNames.map(async (name) => {
      const slug = await AliasTranslator.getPageSlug(name, true)
      return this.haloRequest(
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
    })

    const newTags = await Promise.all(promises)

    const existNames = displayNames
      .map((name) => {
        const found = allTags.find((item) => item.spec.displayName === name)
        return found ? found.metadata.name : undefined
      })
      .filter(Boolean) as string[]

    return [...existNames, ...newTags.map((item) => item.data.metadata.name)]
  }

  private async getHaloTags() {
    const categories = await this.haloRequest("/apis/content.halo.run/v1alpha1/tags", {}, "GET")
    return Promise.resolve(categories.items)
  }

  /**
   * 向 Halo 请求数据
   *
   * @param url 请求地址
   * @param params 数据
   * @param method 请求方法 GET | POST | PUT | DELETE
   * @private
   */
  private async haloRequest(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST"
  ): Promise<any> {
    const contentType = "application/json"
    const basicAuth = "Basic " + Base64.btoa(this.cfg.username + ":" + this.cfg.password)
    const headers = {
      "Content-Type": contentType,
      Authorization: basicAuth,
    }

    // 打印日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向 Halo 请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向 Halo 请求数据，params =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? "" : JSON.stringify(params)
    const resJson = await this.proxyFetch(apiUrl, [headers], body, method, contentType)
    this.logger.debug("向 Halo 请求数据，resJson =>", resJson)

    return resJson ?? null
  }
}

export { HaloApiAdaptor }
