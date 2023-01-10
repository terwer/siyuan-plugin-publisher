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
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { GithubApi } from "~/utils/platform/github/githubApi"
import { getJSONConf } from "~/utils/configUtil"
import { UserBlog } from "~/utils/models/userBlog"
import { pathJoin } from "~/utils/util"
import { Post } from "~/utils/models/post"
import { Base64 } from "js-base64"
import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import { CategoryInfo } from "~/utils/models/categoryInfo"

/**
 * Github平台适配器
 */
export class GithubApiAdaptor implements IApi {
  private readonly logger: Logger
  protected readonly apiType: string
  protected readonly cfg: IGithubCfg
  protected readonly githubApi: GithubApi

  constructor(apiType: string) {
    this.logger = LogFactory.getLogger(
      "utils/platform/github/githubApiAdaptor.ts"
    )
    this.apiType = apiType
    const cfg = getJSONConf<IGithubCfg>(apiType)
    this.cfg = cfg
    this.githubApi = new GithubApi(cfg)
  }

  async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const userblog: UserBlog = new UserBlog()
    userblog.blogid = this.apiType
    userblog.blogName = pathJoin(this.cfg.githubUser, "/" + this.cfg.githubRepo)
    userblog.url = pathJoin(
      "https://github.com/" + this.cfg.githubUser,
      "/" + this.cfg.githubRepo
    )
    result.push(userblog)

    return result
  }

  async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const commonPost = new Post()

    const page = await this.githubApi.getPageData(postid)
    commonPost.postid = page.path
    commonPost.title = page.path
    commonPost.description = Base64.fromBase64(page.content)
    commonPost.link = page.path
    commonPost.permalink = page.html_url
    this.logger.debug("page=>", page)

    return commonPost
  }

  async newPost(post: Post, publish?: boolean): Promise<string> {
    const res = await this.githubApi.publishGithubPage(
      post.postid,
      post.description
    )

    if (!res?.content?.path) {
      throw new Error(this.apiType + "调用API异常")
    }
    return res.content.path
  }

  async editPost(
    postid: string,
    post: Post,
    publish?: boolean
  ): Promise<boolean> {
    const res = await this.githubApi.updateGithubPage(
      post.postid,
      post.description
    )
    if (!res?.content?.path) {
      throw new Error("Hugo调用API异常")
    }
    return true
  }

  async deletePost(postid: string): Promise<boolean> {
    const res = await this.githubApi.deleteGithubPage(postid)
    if (!res?.commit?.sha) {
      throw new Error("Hugo调用API异常")
    }
    return true
  }

  async getCategories(): Promise<CategoryInfo[]> {
    return await Promise.resolve([])
  }

  async getPreviewUrl(postid: string): Promise<string> {
    let previewUrl
    const newPostid = postid
      .substring(postid.lastIndexOf("/") + 1)
      .replace(".md", "")
    previewUrl = this.cfg.previewUrl.replace("[postid]", newPostid)
    // 路径组合
    previewUrl = pathJoin(this.cfg.home ?? "", previewUrl)

    return previewUrl
  }

  async getRecentPosts(
    numOfPosts: number,
    page?: number,
    keyword?: string
  ): Promise<Post[]> {
    return []
  }

  async getRecentPostsCount(keyword?: string): Promise<number> {
    return 0
  }
}
