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

import { IMetaweblogCfg } from "~/utils/platform/metaweblog/IMetaweblogCfg"
import { getJSONConf } from "~/utils/configUtil"
import { UserBlog } from "~/utils/models/userBlog"
import { METAWEBLOG_METHOD_CONSTANTS } from "~/utils/constants/metaweblogMethodConstants"
import { LogFactory } from "~/utils/logUtil"
import { Logger } from "loglevel"
import { Post } from "~/utils/models/post"
import { POST_STATUS_CONSTANTS } from "~/utils/constants/postStatusConstants"
import { isEmptyString } from "~/utils/util"
import { isBrowser } from "~/utils/browserUtil"
import { CategoryInfo } from "~/utils/models/categoryInfo"
import { CommonXmlrpcClient } from "~/utils/xmlrpc/commonXmlrpcClient"

/**
 * Metaweblog API的具体实现
 */
export class MetaWeblogApi {
  private readonly logger: Logger
  private readonly apiType: string
  private readonly cfg: IMetaweblogCfg
  private readonly commonXmlrpcClient: CommonXmlrpcClient

  constructor(apiType: string) {
    this.logger = LogFactory.getLogger(
      "utils/platform/metaweblog/metaWeblogApi.ts"
    )
    this.apiType = apiType
    this.cfg = getJSONConf<IMetaweblogCfg>(apiType)
    this.commonXmlrpcClient = new CommonXmlrpcClient(
      this.apiType,
      this.cfg.apiUrl,
      this.cfg.username,
      this.cfg.password
    )
  }

  public async getUsersBlogs(
    appkey: string,
    username: string,
    password: string
  ): Promise<UserBlog[]> {
    const usersBlogs: UserBlog[] = []

    const ret = await this.commonXmlrpcClient.methodCall(
      METAWEBLOG_METHOD_CONSTANTS.GET_USERS_BLOGS,
      [this.apiType, username, password]
    )
    this.logger.debug("ret=>", ret)

    const dataArr = ret
    for (let i = 0; i < dataArr.length; i++) {
      const userBlog = new UserBlog()
      const item = dataArr[i]

      userBlog.blogid = item.blogid || ""
      userBlog.url = item.url
      userBlog.blogName = item.blogName

      usersBlogs.push(userBlog)
    }

    return usersBlogs
  }

  public async getRecentPosts(
    appkey: string,
    username: string,
    password: string,
    numOfPosts: number
  ): Promise<Post[]> {
    return []
  }

  public async getPost(
    postid: string,
    username: string,
    password: string
  ): Promise<Post> {
    const result: Post = new Post()

    try {
      const ret = await this.commonXmlrpcClient.methodCall(
        METAWEBLOG_METHOD_CONSTANTS.GET_POST,
        [postid, username, password]
      )
      const dataObj = ret
      this.logger.debug("获取的文章信息，dataObj=>", dataObj)

      // 暂时只用到了分类，其他属性先不适配
      result.categories = dataObj.categories
    } catch (e) {
      this.logger.error("文章信息获取失败", e)
    }

    return result
  }

  /**
   * 新建文章
   * @param blogid
   * @param username
   * @param password
   * @param post
   * @param publish
   */
  public async newPost(
    blogid: string,
    username: string,
    password: string,
    post: Post,
    publish: boolean
  ): Promise<string> {
    // 草稿
    if (!publish) {
      post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
    }

    const postStruct = this.createPostStruct(post)
    this.logger.debug("postStruct=>", postStruct)
    let ret = await this.commonXmlrpcClient.methodCall(
      METAWEBLOG_METHOD_CONSTANTS.NEW_POST,
      [this.apiType, username, password, postStruct, publish]
    )
    ret = ret + ""
    ret = ret.replace(/"/g, "")
    this.logger.debug("ret=>", ret)

    return ret
  }

  public async editPost(
    postid: string,
    username: string,
    password: string,
    post: Post,
    publish: boolean
  ): Promise<boolean> {
    // 草稿
    if (!publish) {
      post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
    }

    const postStruct = this.createPostStruct(post)
    this.logger.debug("postStruct=>", postStruct)
    const ret = await this.commonXmlrpcClient.methodCall(
      METAWEBLOG_METHOD_CONSTANTS.EDIT_POST,
      [postid, username, password, postStruct, publish]
    )
    this.logger.debug("ret=>", ret)

    return ret
  }

  public async deletePost(
    appKey: string,
    postid: string,
    username: string,
    password: string,
    publish: boolean
  ): Promise<boolean> {
    const ret = await this.commonXmlrpcClient.methodCall(
      METAWEBLOG_METHOD_CONSTANTS.DELETE_POST,
      [appKey, postid, username, password, publish]
    )
    this.logger.debug("ret=>", ret)

    return ret
  }

  /**
   * 适配文章字段
   * @param post 原始文章
   * @private
   */
  private createPostStruct(post: Post): object {
    const postObj = {}

    if (!isEmptyString(post.title)) {
      Object.assign(postObj, {
        title: post.title,
      })
    }

    if (!isEmptyString(post.mt_keywords)) {
      Object.assign(postObj, {
        mt_keywords: post.mt_keywords,
      })
    }

    if (!isEmptyString(post.description)) {
      Object.assign(postObj, {
        description: post.description,
      })
    }

    if (!isEmptyString(post.wp_slug)) {
      Object.assign(postObj, {
        wp_slug: post.wp_slug,
      })
    }

    // 浏览器端的date转换有问题
    if (!isBrowser()) {
      Object.assign(postObj, {
        // 这里要注意时间格式
        // http://www.ab-weblog.com/en/create-new-posts-with-publishing-date-in-wordpress-using-xml-rpc-and-php/
        // dateCreated: post.dateCreated.toISOString() || new Date().toISOString()
        dateCreated: post.dateCreated || new Date(),
      })
    }

    Object.assign(postObj, {
      categories: post.categories || [],
    })

    Object.assign(postObj, {
      post_status:
        post.post_status ?? POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH,
    })

    if (!isEmptyString(post.wp_password)) {
      Object.assign(postObj, {
        wp_password: post.wp_password,
      })
    }

    return postObj
    // return {
    //     title: post.title || '',
    //     mt_keywords: post.mt_keywords || '',
    //     description: post.description || '',
    //     wp_slug: post.wp_slug || '',
    //     dateCreated: post.dateCreated.toISOString() || new Date().toISOString(),
    //     categories: post.categories || [],
    //     post_status: post.post_status || POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH,
    //     wp_password: post.wp_password || ''
    // }
  }

  public async getCategories(
    blogid: string,
    username: string,
    password: string
  ): Promise<CategoryInfo[]> {
    const result = [] as CategoryInfo[]

    try {
      const ret = await this.commonXmlrpcClient.methodCall(
        METAWEBLOG_METHOD_CONSTANTS.GET_CATEGORIES,
        [this.apiType, username, password]
      )
      const dataArr = ret
      this.logger.debug("获取的分类信息，dataArr=>", dataArr)

      dataArr.forEach((item: any) => {
        const cat = new CategoryInfo()
        cat.description = item.description
        cat.categoryId = item.categoryId
        result.push(cat)
      })
    } catch (e) {
      this.logger.error("分类获取失败", e)
    }

    return result
  }
}
