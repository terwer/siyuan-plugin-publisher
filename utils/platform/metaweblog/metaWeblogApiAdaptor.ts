/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import { IApi } from "~/utils/api"
import { IMetaweblogCfg } from "~/utils/platform/metaweblog/IMetaweblogCfg"
import { MetaWeblogApi } from "~/utils/platform/metaweblog/metaWeblogApi"
import { getJSONConf } from "~/utils/configUtil"
import { UserBlog } from "~/utils/models/userBlog"
import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import { Post } from "~/utils/models/post"
import { CategoryInfo } from "~/utils/models/categoryInfo"
import { pathJoin } from "~/utils/util"

/**
 * 支持Metaweblog的通用API适配器
 */
export class MetaWeblogApiAdaptor implements IApi {
  protected metaWeblogApi: MetaWeblogApi
  protected username: string
  private readonly logger: Logger
  private readonly cfg: IMetaweblogCfg
  protected password: string
  protected appkey: string

  constructor(apiType: string) {
    this.logger = LogFactory.getLogger(
      "utils/platform/metaweblog/metaWeblogApiAdaptor.ts"
    )
    this.cfg = getJSONConf<IMetaweblogCfg>(apiType)

    this.metaWeblogApi = new MetaWeblogApi(apiType)
    this.username = this.cfg.username
    this.password = this.cfg.password
    this.appkey = apiType
  }

  /**
   * getUsersBlogs
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getUsersBlogs
   */
  public async getUsersBlogs(): Promise<UserBlog[]> {
    let result: UserBlog[] = []
    result = await this.metaWeblogApi.getUsersBlogs(
      this.appkey,
      this.username,
      this.password
    )

    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  /**
   * Not supported
   * @param keyword
   */
  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return await Promise.resolve(0)
  }

  /**
   * getRecentPosts
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts
   * @param numOfPosts
   */
  public async getRecentPosts(numOfPosts: number): Promise<Post[]> {
    const result: Post[] = []
    let blogPosts
    blogPosts = await this.metaWeblogApi.getRecentPosts(
      this.appkey,
      this.username,
      this.password,
      numOfPosts
    )

    for (let i = 0; i < blogPosts.length; i++) {
      const blogPost = blogPosts[i]

      // 适配公共属性
      const commonPost = new Post()
      commonPost.postid = blogPost.postid
      commonPost.title = blogPost.title
      commonPost.mt_keywords = blogPost.mt_keywords
      commonPost.permalink = blogPost.permalink
      commonPost.description = blogPost.description
      commonPost.wp_slug = blogPost.wp_slug
      commonPost.dateCreated = blogPost.dateCreated
      commonPost.categories = blogPost.categories
      result.push(commonPost)
    }

    return result
  }

  /**
   * getPost
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getPost
   *
   */
  public async getPost(postid: string): Promise<Post> {
    let data
    data = await this.metaWeblogApi.getPost(
      postid,
      this.username,
      this.password
    )

    return data
  }

  /**
   * editPost
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.editPost
   */
  public async editPost(
    postid: string,
    post: Post,
    publish?: boolean
  ): Promise<boolean> {
    let data
    data = await this.metaWeblogApi.editPost(
      postid,
      this.username,
      this.password,
      post,
      publish ?? true
    )

    return data
  }

  /**
   * newPost
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
   */
  public async newPost(post: Post, publish?: boolean): Promise<string> {
    let data
    data = await this.metaWeblogApi.newPost(
      this.appkey,
      this.username,
      this.password,
      post,
      publish ?? true
    )
    return data
  }

  /**
   * deletePost
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.deletePost
   */
  public async deletePost(postid: string): Promise<boolean> {
    let data
    data = await this.metaWeblogApi.deletePost(
      this.appkey,
      postid,
      this.username,
      this.password,
      true
    )
    return data
  }

  /**
   * getCategories
   * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getCategories
   *
   * @returns {Promise<CategoryInfo[]>}
   */
  public async getCategories(): Promise<CategoryInfo[]> {
    let cats
    cats = await this.metaWeblogApi.getCategories(
      this.appkey,
      this.username,
      this.password
    )
    this.logger.debug("获取分类列表=>", cats)
    return cats
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const postUrl = this.cfg.previewUrl.replace("[postid]", postid)
    const previewUrl = pathJoin(this.cfg.home ?? "", postUrl)
    this.logger.debug("previewUrl", previewUrl)
    return previewUrl
  }
}
