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
import { ICommonblogCfg } from "~/utils/platform/commonblog/commonblogCfg"
import { getJSONConf } from "~/utils/configUtil"
import { Post } from "~/utils/models/post"
import { UserBlog } from "~/utils/models/userBlog"
import { CategoryInfo } from "~/utils/models/categoryInfo"

/**
 * 通用平台接口适配器
 */
export class CommonblogApiAdaptor implements IApi {
  protected readonly apiType: string
  protected readonly cfg: ICommonblogCfg

  constructor(apiType: string) {
    this.apiType = apiType
    this.cfg = getJSONConf<ICommonblogCfg>(apiType)
  }

  public async deletePost(postid: string): Promise<boolean> {
    throw new Error("该功能未实现，请在子类重写该方法")
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    throw new Error("该功能未实现，请在子类重写该方法")
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    throw new Error("该功能未实现，请在子类重写该方法")
  }

  public async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Post[]> {
    throw new Error("该功能未实现，请在子类重写该方法")
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    throw new Error("该功能未实现，请在子类重写该方法")
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    throw new Error("该功能未实现，请在子类重写该方法")
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    return []
  }

  /**
   * Not supported
   * @param keyword
   */
  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return 0
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    return ""
  }
}
