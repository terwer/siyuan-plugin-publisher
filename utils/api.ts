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

import { UserBlog } from "~/utils/models/userBlog"
import { Post } from "~/utils/models/post"
import { CategoryInfo } from "~/utils/models/categoryInfo"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { SiYuanApiAdaptor } from "~/utils/platform/siyuan/siYuanApiAdaptor"
import { PlatformType } from "~/utils/platform/dynamicConfig"
import { GithubApiAdaptor } from "~/utils/platform/github/githubApiAdaptor"
import { MetaWeblogApiAdaptor } from "~/utils/platform/metaweblog/metaWeblogApiAdaptor"
import { VuepressApiAdaptor } from "~/utils/platform/github/vuepress/vuepressApiAdaptor"
import { HugoApiAdaptor } from "~/utils/platform/github/hugo/hugoApiAdaptor"
import { HexoApiAdaptor } from "~/utils/platform/github/hexo/hexoApiAdaptor"
import { JekyllApiAdaptor } from "~/utils/platform/github/jekyll/jekyllApiAdaptor"
import { JVueApiAdaptor } from "~/utils/platform/metaweblog/jvue/jvueApiAdaptor"
import { ConfApiAdaptor } from "~/utils/platform/metaweblog/conf/confApiAdaptor"
import { CnblogsApiAdaptor } from "~/utils/platform/metaweblog/cnblogs/cnblogsApiAdaptor"
import { WordpressApiAdaptor } from "~/utils/platform/wordpress/wordpressApiAdaptor"
import { LiandiApiAdaptor } from "~/utils/platform/commonblog/liandi/liandiApiAdaptor"
import { YuqueApiAdaptor } from "~/utils/platform/commonblog/yuque/yuqueApiAdaptor"
import { KmsApiAdaptor } from "~/utils/platform/commonblog/kms/kmsApiAdaptor"

/**
 * @description 所有平台统一API接口
 * @author terwer
 * @version 0.1.0
 * @since 0.0.1
 */
export interface IApi {
  /**
   * @description 获取博客配置列表
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getUsersBlogs getUsersBlogs}
   * @returns {Promise<Array<UserBlog>>}
   */
  getUsersBlogs: () => Promise<UserBlog[]>

  /**
   * @description 最新文章数目
   * @param keyword 关键字（可选，部分平台不支持搜索）
   * @returns {Promise<number>}
   */
  getRecentPostsCount: (keyword?: string) => Promise<number>

  /**
   * @description 最新文章
   * @param numOfPosts 文章数目
   * @param page 页码（可选，部分平台不支持分页）
   * @param keyword 关键字（可选，部分平台不支持搜索）
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts getRecentPosts}
   * @returns {Promise<Array<Post>>}
   */
  getRecentPosts: (numOfPosts: number, page?: number, keyword?: string) => Promise<Post[]>

  /**
   * @description 文章详情
   * @param postid 文章ID
   * @param useSlug 是否使用的是别名（可选，部分平台不支持）
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getPost getPost}
   * @returns {Promise<Post>}
   */
  getPost: (postid: string, useSlug?: boolean) => Promise<Post>

  /**
   * @description 发布文章
   * @param post 文章
   * @param publish 可选，是否发布
   *
   * ```ts
   *    const post = {
   *         description: "自动发布的测试内容",
   *         title: "自动发布的测试标题",
   *         categories: ["标签1","标签2"],
   *         // dateCreated: new Date(),
   *         // link: "",
   *         // permalink: "",
   *         // postid: "",
   *         // source: {
   *         //  name: "",
   *         //  url: ""
   *         // };
   *         // userid: ""
   *    }
   *
   *    const result = newPost(post, false)
   * ```
   * @see {@link  https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost newPost}
   * @returns {Promise<string>}
   */
  newPost: (post: Post, publish?: boolean) => Promise<string>

  /**
   * @description 更新文章
   * @param postid 文章id
   * @param post 文章
   * @param publish 可选，是否发布
   *
   * ```ts
   *     // wordpress
   *     // const postid = 4115
   *     // conf
   *     // const postid = 1540103
   *     const postid = "2490384_1"
   *     const post = {
   *         description: "修改过的自动发布的测试内容2",
   *         title: "修改过的自动发布的测试标题2",
   *         categories: ["标签1", "标签2"],
   *         // dateCreated: new Date(),
   *         // link: "",
   *         // permalink: "",
   *         // postid: postid,
   *         // source: {
   *         //  name: "",
   *         //  url: ""
   *         // };
   *         // userid: ""
   *     }
   *
   *     const result = editPost(postid, post, false)
   * ```
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.editPost editPost}
   * @returns {Promise<boolean>}
   */
  editPost: (postid: string, post: Post, publish?: boolean) => Promise<boolean>

  /**
   * @description 删除文章
   * @param postid 文章ID
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.deletePost deletePost}
   * @returns {Promise<boolean>}
   */
  deletePost: (postid: string) => Promise<boolean>

  /**
   * @description 获取分类列表
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getCategories getCategories}
   * @returns {Promise<CategoryInfo[]>}
   */
  getCategories: () => Promise<CategoryInfo[]>

  /**
   * @description 获取预览链接
   * @param postid 文章ID
   * @returns {Promise<string>}
   */
  getPreviewUrl: (postid: string) => Promise<string>
}

/**
 * @description 统一API入口具体实现
 * @author terwer
 * @version 0.1.0
 * @since 0.0.1
 */
export class API implements IApi {
  private readonly type: string
  private readonly apiAdaptor: IApi

  constructor(type: string) {
    this.type = type

    // 动态平台key的规则是-分割第一部分是平台类型
    if (type.includes("-")) {
      const typeArr = type.split("-")
      if (typeArr.length > 0) {
        const ptype = typeArr[0].toLowerCase()
        if (ptype.includes(PlatformType.Github.toLowerCase())) {
          // Github
          this.apiAdaptor = new GithubApiAdaptor(type)
          return
        } else if (ptype === PlatformType.Metaweblog.toLowerCase()) {
          // Metaweblog
          this.apiAdaptor = new MetaWeblogApiAdaptor(type)
          return
        } else if (ptype === PlatformType.Wordpress.toLowerCase()) {
          // WordPress
          this.apiAdaptor = new MetaWeblogApiAdaptor(type)
          return
        }
      }
    }

    // 下面是固定平台
    switch (this.type) {
      case API_TYPE_CONSTANTS.API_TYPE_SIYUAN:
        this.apiAdaptor = new SiYuanApiAdaptor()
        break

      // Github
      case API_TYPE_CONSTANTS.API_TYPE_VUEPRESS:
        this.apiAdaptor = new VuepressApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_HUGO:
        this.apiAdaptor = new HugoApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_HEXO:
        this.apiAdaptor = new HexoApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_JEKYLL:
        this.apiAdaptor = new JekyllApiAdaptor()
        break

      // Metaweblog API
      case API_TYPE_CONSTANTS.API_TYPE_JVUE:
        this.apiAdaptor = new JVueApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE:
        this.apiAdaptor = new ConfApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_CNBLOGS:
        this.apiAdaptor = new CnblogsApiAdaptor()
        break

      // Wordpress
      case API_TYPE_CONSTANTS.API_TYPE_WORDPRESS:
        this.apiAdaptor = new WordpressApiAdaptor()
        break

      // Common
      case API_TYPE_CONSTANTS.API_TYPE_LIANDI:
        this.apiAdaptor = new LiandiApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_YUQUE:
        this.apiAdaptor = new YuqueApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_KMS:
        this.apiAdaptor = new KmsApiAdaptor()
        break
      default:
        throw new Error("未找到接口适配器，请检查参数")
    }
  }

  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return await this.apiAdaptor.getRecentPostsCount(keyword)
  }

  public async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Post[]> {
    return await this.apiAdaptor.getRecentPosts(numOfPosts, page, keyword)
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    return await this.apiAdaptor.getUsersBlogs()
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    return await this.apiAdaptor.getPost(postid, useSlug)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    return await this.apiAdaptor.editPost(postid, post, publish)
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    return await this.apiAdaptor.newPost(post, publish)
  }

  public async deletePost(postid: string): Promise<boolean> {
    return await this.apiAdaptor.deletePost(postid)
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    return await this.apiAdaptor.getCategories()
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    return await this.apiAdaptor.getPreviewUrl(postid)
  }
}
