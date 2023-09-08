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

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { CategoryInfo, Post, TagInfo, UserBlog } from "zhi-blog-api"
import { StrUtil } from "zhi-common"

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
    const res = await this.webProxyFetch("https://api.juejin.cn/user_api/v1/user/get")
    const flag = !!res.data.user_id
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
    const res = await this.webProxyFetch("https://api.juejin.cn/tag_api/v1/query_category_list", [header], {}, "POST")
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

    // 保存草稿
    const draftUrl = "https://api.juejin.cn/content_api/v1/article_draft/create"
    const draftParams = {
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
    }
    const draftRes = await this.webProxyFetch(draftUrl, [], draftParams, "POST")
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
    const cate_slug = post.cate_slugs?.[0] ?? this.cfg.blogid
    if (StrUtil.isEmptyString(cate_slug)) {
      throw new Error("掘金平台必须选择一个分类")
    }

    const tag_slug = post.tags_slugs ?? ""
    if (StrUtil.isEmptyString(tag_slug)) {
      throw new Error("掘金平台必须选择一个标签")
    }

    const juejinPostKey = this.getJuejinPostidKey(postid)
    // const pageId = juejinPostKey.pageId
    const draftId = juejinPostKey.draftId

    // 更新文章
    const draftUpdateUrl = "https://api.juejin.cn/content_api/v1/article_draft/update"
    const draftParams = {
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
    }
    // 更新草稿
    const draftRes = await this.webProxyFetch(draftUpdateUrl, [], draftParams, "POST")
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
    return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async deletePost(postid: string): Promise<boolean> {
    const url = "https://api.juejin.cn/content_api/v1/article/delete"
    const params = {
      article_id: postid,
    }
    const res = await this.webProxyFetch(url, [], params, "POST")
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
    const params = {
      article_id: pageId,
    }
    const res = await this.webProxyFetch(url, [], params, "POST")
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
    const res = await this.webProxyFetch("https://api.juejin.cn/tag_api/v1/query_category_list", [header], {}, "POST")
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
    const params = {
      cursor: "0",
      key_word: "",
      limit: 10,
      sort_type: 1,
    }
    const res = await this.webProxyFetch("https://api.juejin.cn/tag_api/v1/query_tag_list", [header], params, "POST")
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
    const params = {
      draft_id: draftId,
      sync_to_org: false,
      column_ids: [],
      theme_ids: [],
    }
    const res = await this.webProxyFetch(url, [], params, "POST")
    this.logger.debug("juejin publish post res =>", res)
    if (res.err_no !== 0) {
      throw new Error("掘金文章发布失败 =>" + res?.err_msg ?? res)
    }

    return res.data.article_id.toString()
  }
}

export { JuejinWebAdaptor }
