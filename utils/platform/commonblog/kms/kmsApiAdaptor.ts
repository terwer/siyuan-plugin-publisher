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
import { CommonblogApiAdaptor } from "../commonblogApiAdaptor"
import { Base64 } from "js-base64"
import { KmsApi } from "./kmsApi"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { UserBlog } from "~/utils/models/userBlog"
import { Post } from "~/utils/models/post"
import { pathJoin } from "~/utils/util"

/**
 * 知识仓库的API适配器
 */
export class KmsApiAdaptor extends CommonblogApiAdaptor implements IApi {
  private readonly kmsApi: KmsApi

  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_KMS)

    const kmsUsername = this.cfg.username ?? ""
    const kmsPassword = this.cfg.password ?? ""
    const basicToken = Base64.toBase64(`${kmsUsername}:${kmsPassword}`)

    this.kmsApi = new KmsApi(this.cfg.apiUrl, basicToken)
  }

  async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const userblog: UserBlog = new UserBlog()
    userblog.blogid = this.apiType
    userblog.blogName = "KMS"
    userblog.url = this.cfg.apiUrl
    result.push(userblog)

    return result
  }

  async deletePost(postid: string): Promise<boolean> {
    return await this.kmsApi.delDoc(postid)
  }

  async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    return await this.kmsApi.updateDoc(postid, post.title, post.description)
  }

  async newPost(post: Post, publish?: boolean): Promise<string> {
    return await this.kmsApi.addDoc(post.title, post.description)
  }

  async getPreviewUrl(postid: string): Promise<string> {
    // 替换文章链接
    const purl = this.cfg.previewUrl ?? ""
    const postUrl = purl.replace("[postid]", postid)
    // 路径组合
    return pathJoin(this.cfg.home ?? "", postUrl)
  }
}
