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

import { Attachment, CategoryInfo, MediaObject, Post, PostStatusEnum, UserBlog } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"
import { StrUtil } from "zhi-common"
import { BrowserUtil } from "zhi-device"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { useProxy } from "~/src/composables/useProxy.ts"

/**
 * MetaweblogBlogApi 类继承自 BaseBlogApi 类，并为 Metaweblog API 提供了额外的功能
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class MetaweblogBlogApiAdaptor extends BaseBlogApi {
  private readonly proxyXmlrpc: any

  /**
   * 初始化 metaweblog API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: any, cfg: MetaweblogConfig) {
    super(appInstance, cfg)

    this.cfg.blogid = "metaweblog"
    this.logger = createAppLogger("metaweblog-api-adaptor")
    const { proxyXmlrpc } = useProxy(cfg.middlewareUrl)
    this.proxyXmlrpc = proxyXmlrpc
  }

  public override async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []
    result = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_USERS_BLOGS, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
    ])
    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  /**
   * Not supported
   *
   * @param keyword
   */
  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return 0
  }

  public async getRecentPosts(numOfPosts: number): Promise<Post[]> {
    const result: Post[] = []
    const blogPosts = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_RECENT_POSTS, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
      numOfPosts,
    ])

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

  public async getPost(postid: string): Promise<Post> {
    const data = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_POST, [
      postid,
      this.cfg.username,
      this.cfg.password,
    ])
    return data
  }

  /**
   * 新建文章
   *
   * @param post - 文章
   * @param publish - 可选，不传递默认是发布，传递false才是草稿
   */
  public async newPost(post: Post, publish?: boolean): Promise<string> {
    publish = publish ?? true

    // 不传递默认是发布，传递false才是草稿
    post.post_status = publish === false ? PostStatusEnum.PostStatusEnum_Draft : PostStatusEnum.PostStatusEnum_Publish

    const postStruct = this.createPostStruct(post)
    this.logger.debug("postStruct=>", postStruct)
    let ret = await this.metaweblogCall(MetaweblogConstants.METHOD_NEW_POST, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
      postStruct,
      publish,
    ])
    ret = ret + ""
    ret = ret.replace(/"/g, "")
    this.logger.debug("ret=>", ret)

    return ret
  }

  /**
   * 编辑文章
   *
   * @param postid - 文章ID
   * @param post - 文章
   * @param publish - 可选，不传递默认是发布，传递false才是草稿
   */
  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    publish = publish ?? true

    // 不传递默认是发布，传递false才是草稿
    post.post_status = publish === false ? PostStatusEnum.PostStatusEnum_Draft : PostStatusEnum.PostStatusEnum_Publish

    const postStruct = this.createPostStruct(post)
    this.logger.debug("postStruct=>", postStruct)
    const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_EDIT_POST, [
      postid,
      this.cfg.username,
      this.cfg.password,
      postStruct,
      publish,
    ])
    this.logger.debug("ret=>", ret)
    return ret
  }

  public async deletePost(postid: string): Promise<boolean> {
    const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_DELETE_POST, [
      this.cfg.blogid,
      postid,
      this.cfg.username,
      this.cfg.password,
      false,
    ])
    this.logger.debug("ret=>", ret)

    return ret
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const previewUrl = this.cfg.previewUrl.replace(/\[postid\]/g, postid)
    return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const result = [] as CategoryInfo[]

    try {
      const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_CATEGORIES, [
        this.cfg.blogid,
        this.cfg.username,
        this.cfg.password,
      ])
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

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    let ret: Attachment
    try {
      ret = await this.metaweblogCall(MetaweblogConstants.METHOD_NEW_MEDIA_OBJECT, [
        this.cfg.blogid,
        this.cfg.username,
        this.cfg.password,
        mediaObject,
      ])
      this.logger.debug("上传媒体完成, ret =>", ret)
    } catch (e) {
      this.logger.error("媒体上传失败", e)
    }

    return ret
  }

  protected async metaweblogCall(method: string, params: any[]) {
    return await this.proxyXmlrpc(this.cfg.apiUrl, method, params)
  }

  /**
   * 适配文章字段
   * @param post 原始文章
   * @private
   */
  private createPostStruct(post: Post): object {
    const postObj = {}

    if (!StrUtil.isEmptyString(post.title)) {
      Object.assign(postObj, {
        title: post.title,
      })
    }

    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      Object.assign(postObj, {
        mt_keywords: post.mt_keywords,
      })
    }

    if (!StrUtil.isEmptyString(post.description)) {
      Object.assign(postObj, {
        description: post.description,
      })
    }

    if (!StrUtil.isEmptyString(post.wp_slug)) {
      Object.assign(postObj, {
        wp_slug: post.wp_slug,
      })
    }

    // 浏览器端的date转换有问题
    if (!BrowserUtil.isInBrowser) {
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
      post_status: post.post_status ?? PostStatusEnum.PostStatusEnum_Publish,
    })

    if (!StrUtil.isEmptyString(post.wp_password)) {
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
}

export { MetaweblogBlogApiAdaptor }
