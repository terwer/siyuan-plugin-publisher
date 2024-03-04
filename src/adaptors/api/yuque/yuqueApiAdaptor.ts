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

import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { ObjectUtil, StrUtil } from "zhi-common"

/**
 * Yuque API 适配器
 * @see [Yuque API](https://www.yuque.com/yuque/developer)
 */
class YuqueApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: YuqueConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("yuque-api-adaptor")
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const repos = await this.getRepos()
    // 数据适配
    repos.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.namespace
      userblog.blogName = item.name
      userblog.url = item.namespace
      result.push(userblog)
    })

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    // 确保最新的文章ID都包含了笔记本信息，防止以后文章出错
    const repo = post.cate_slugs?.[0] ?? this.cfg.blogid
    return await this.addDoc(post.title, post.wp_slug, post.description, repo)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const yuquePostidKey = this.getYuquePostidKey(postid)
    return await this.updateDoc(
      yuquePostidKey.docId,
      post.title,
      post.wp_slug,
      post.description,
      yuquePostidKey.docRepo
    )
  }

  public async deletePost(postid: string): Promise<boolean> {
    const yuquePostidKey = this.getYuquePostidKey(postid)
    return await this.delDoc(yuquePostidKey.docId, yuquePostidKey.docRepo)
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const yuquePostidKey = this.getYuquePostidKey(postid)

    const yuqueDoc = await this.getDoc(yuquePostidKey.docId, yuquePostidKey.docRepo)
    this.logger.debug("yuqueDoc=>", yuqueDoc)

    const commonPost = new Post()
    commonPost.title = yuqueDoc.title
    commonPost.description = yuqueDoc.body

    // 语雀知识库
    const book = yuqueDoc.book
    const catSlugs = []
    catSlugs.push(book.namespace)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const repos: any[] = await this.getRepos()
    if (repos && repos.length > 0) {
      repos.forEach((repo) => {
        // 只获取文档库
        if (repo.type === "Book") {
          const cat = new CategoryInfo()
          cat.categoryId = `${this.cfg.username}/${repo.slug}`
          cat.categoryName = repo.name
          cat.description = repo.name
          cat.categoryDescription = repo.name
          cats.push(cat)
        }
      })
    }

    return cats
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    // 替换文章链接
    const purl = this.cfg.previewUrl ?? ""
    const yuquePostidKey = this.getYuquePostidKey(postid)
    const docId = yuquePostidKey.docId
    const repo = yuquePostidKey.docRepo ?? this.cfg.blogid ?? ""
    const postUrl = purl.replace("[postid]", docId).replace("[notebook]", repo)
    return postUrl
  }

  // ================
  // private methods
  // ================
  /**
   * 语雀知识库列表
   */
  private async getRepos() {
    const url = "/users/" + this.cfg.username + "/repos"
    const repos = await this.yuqueRequest(url, {}, "GET")
    this.logger.debug("yuque repos=>", repos)
    return repos
  }

  /**
   * 向默认知识库添加文档
   *
   * @param title 标题
   * @param slug 别名
   * @param content 内容
   * @param repo 知识库（可选）
   */
  private async addDoc(title: string, slug: string, content: string, repo?: string): Promise<string> {
    let url = "/repos/" + this.cfg.blogid + "/docs"
    if (repo) {
      url = "/repos/" + repo + "/docs"
      this.logger.warn("yuque addDoc with repo", repo)
    }
    const params = {
      title,
      slug,
      format: "markdown",
      body: content,
    }
    const result = await this.yuqueRequest(url, params, "POST")
    this.logger.debug("yuqueRequest addDoc=>", result)
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    // 包含了笔记本需要返回标识笔记本的ID，否则更新可能报错
    if (repo) {
      return `${result.id}_${repo}`
    } else {
      return `${result.id}`
    }
  }

  /**
   * 更新语雀文档
   *
   * @param docId 文档ID
   * @param title 标题
   * @param slug 别名
   * @param content 内容
   * @param repo 知识库（可选）
   */
  private async updateDoc(
    docId: string,
    title: string,
    slug: string,
    content: string,
    repo?: string
  ): Promise<boolean> {
    let url = "/repos/" + this.cfg.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      this.logger.warn("yuque updateDoc with repo", repo)
    }
    const params = {
      title,
      slug,
      body: content,
      _force_asl: 1,
    }
    const result = await this.yuqueRequest(url, params, "PUT")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return true
  }

  /**
   * 获取封装的postid
   *
   * @param postid
   * @private postid
   */
  private getYuquePostidKey(postid: string): any {
    let docId: string
    let docRepo: string
    if (postid.indexOf("_") > 0) {
      const idArr = postid.split("_")
      docId = idArr[0]
      docRepo = idArr[1]
      // docRepo就是book.namespace
    } else {
      docId = postid
    }

    return {
      docId,
      docRepo,
    }
  }

  /**
   * 删除 yuque 文档
   *
   * @param docId 文档ID
   * @param repo 知识库（可选）
   */
  private async delDoc(docId: string, repo?: string): Promise<boolean> {
    let url = "/repos/" + this.cfg.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      this.logger.warn("yuque delDoc with repo", repo)
    }
    const result = await this.yuqueRequest(url, {}, "DELETE")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return true
  }

  /**
   * 获取 yuque 文档
   *
   * @param docId 文档ID
   * @param repo 知识库（可选）
   */
  public async getDoc(docId: string, repo?: string): Promise<any> {
    let url = "/repos/" + this.cfg.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      this.logger.warn("yuque getDoc with repo", repo)
    }
    const result = await this.yuqueRequest(url, {}, "GET")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return result
  }

  /**
   * 向语雀请求数据
   *
   * @param url 请求地址
   * @param params 数据
   * @param method 请求方法 GET | POST | PUT | DELETE
   * @private
   */
  private async yuqueRequest(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST"
  ): Promise<any> {
    const contentType = "application/json"
    const headers = {
      "Content-Type": contentType,
      "X-Auth-Token": this.cfg.password,
    }

    // 打印日志
    const apiUrl = `${this.cfg.apiUrl}${url}`
    this.logger.debug("向语雀请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向语雀请求数据，params =>", params)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const body = ObjectUtil.isEmptyObject(params) ? "" : JSON.stringify(params)
    const resJson = await this.apiProxyFetch(apiUrl, [headers], body, method, contentType)
    this.logger.debug("向语雀请求数据，resJson =>", resJson)

    if (resJson?.status === 401) {
      throw new Error(resJson?.message)
    }

    return resJson.data ? resJson.data : null
  }
}

export { YuqueApiAdaptor }
