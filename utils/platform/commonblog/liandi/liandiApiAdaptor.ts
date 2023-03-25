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

import { CommonblogApiAdaptor } from "~/utils/platform/commonblog/commonblogApiAdaptor"
import { IApi } from "~/utils/api"
import { LiandiApi } from "~/utils/platform/commonblog/liandi/liandiApi"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { UserBlog } from "~/utils/models/userBlog"
import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import { Post } from "~/utils/models/post"
import { pathJoin } from "~/utils/util"

/**
 * 链滴的API适配器
 */
export class LiandiApiAdaptor extends CommonblogApiAdaptor implements IApi {
  private readonly logger: Logger
  private readonly liandiApi: LiandiApi

  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_LIANDI)
    this.logger = LogFactory.getLogger("utils/platform/commonblog/liandi/liandiApiAdaptor.ts")
    this.liandiApi = new LiandiApi(this.cfg.apiUrl, this.cfg.username ?? "", this.cfg.token ?? "")
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const user = await this.liandiApi.getUser()
    this.logger.debug("user=>", user)

    // 数据适配
    const userblog: UserBlog = new UserBlog()
    userblog.blogid = this.apiType
    userblog.blogName = user.user.userName ?? this.cfg.blogName ?? "链滴"
    userblog.url = this.cfg.apiUrl
    result.push(userblog)

    return result
  }

  /**
   * Not supported
   * @param keyword
   */
  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return 0
  }

  async deletePost(postid: string): Promise<boolean> {
    throw new Error("链滴社区API不支持删除帖子")
  }

  async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const result = await this.liandiApi.updateArticle(postid, post.title, post.description, post.mt_keywords)
    this.logger.debug("liandi newPost=>", result)
    return result
  }

  async newPost(post: Post, publish?: boolean): Promise<string> {
    // 错误已经抛过了，这里不在重复
    const result = await this.liandiApi.addArticle(post.title, post.description, post.mt_keywords)
    this.logger.warn("liandi newPost=>", result)

    return result ?? ""
  }

  async getPreviewUrl(postid: string): Promise<string> {
    // 替换文章链接
    const purl = this.cfg.previewUrl ?? ""
    const postUrl = purl.replace("[postid]", postid)
    // 路径组合
    return pathJoin(this.cfg.home ?? "", postUrl)
  }
}
