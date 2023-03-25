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

import { CommonblogApi } from "~/utils/platform/commonblog/commonblogApi"
import { LogFactory } from "~/utils/logUtil"
import { appendStr } from "~/utils/strUtil"
import { isEmptyObject } from "~/utils/util"

/**
 * 语雀API
 *
 * https://www.yuque.com/yuque/developer
 */
export class YuqueApi extends CommonblogApi {
  private readonly baseUrl: string
  private readonly blogid: string
  private readonly username: string
  private readonly token: string

  constructor(baseUrl: string, blogid: string, username: string, token: string) {
    super()
    this.logger = LogFactory.getLogger("utils/platform/commonblog/yuque/yuqueApi.ts")
    this.baseUrl = baseUrl
    this.blogid = blogid
    this.username = username
    this.token = token
  }

  /**
   * 语雀知识库列表
   */
  public async repos(): Promise<any> {
    const url = "/users/" + this.username + "/repos"
    const data = {}
    return await this.yuqueRequest(url, data, "GET")
  }

  /**
   * 向默认知识库添加文档
   * @param title 标题
   * @param slug 别名
   * @param content 内容
   * @param repo 知识库（可选）
   */
  public async addDoc(title: string, slug: string, content: string, repo?: string): Promise<string> {
    let url = "/repos/" + this.blogid + "/docs"
    if (repo) {
      url = "/repos/" + repo + "/docs"
      this.logger.warn("yuque addDoc with repo", repo)
    }
    const data = {
      title,
      slug,
      format: "markdown",
      body: content,
    }
    const result = await this.yuqueRequest(url, data, "POST")
    this.logger.debug("yuqueRequest addDoc=>", result)
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return appendStr(result.id, "")
  }

  /**
   * 更新语雀文档
   * @param docId 文档ID
   * @param title 标题
   * @param slug 别名
   * @param content 内容
   * @param repo 知识库（可选）
   */
  public async updateDoc(docId: string, title: string, slug: string, content: string, repo?: string): Promise<boolean> {
    let url = "/repos/" + this.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      this.logger.warn("yuque updateDoc with repo", repo)
    }
    const data = {
      title,
      slug,
      body: content,
      _force_asl: 1,
    }
    const result = await this.yuqueRequest(url, data, "PUT")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return true
  }

  /**
   * 删除yuque文档
   * @param docId 文档ID
   * @param repo 知识库（可选）
   */
  public async delDoc(docId: string, repo?: string): Promise<boolean> {
    let url = "/repos/" + this.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      this.logger.warn("yuque delDoc with repo", repo)
    }
    const data = {}
    const result = await this.yuqueRequest(url, data, "DELETE")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return true
  }

  /**
   * 获取yuque文档
   * @param docId 文档ID
   * @param repo 知识库（可选）
   */
  public async getDoc(docId: string, repo?: string): Promise<any> {
    let url = "/repos/" + this.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      this.logger.warn("yuque getDoc with repo", repo)
    }
    const data = {}
    const result = await this.yuqueRequest(url, data, "GET")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return result
  }

  // ==========================================================================
  // ==========================================================================
  /**
   * 向语雀请求数据
   * @param url 请求地址
   * @param data 数据
   * @param method 请求方法 GET | POST
   * @private
   */
  private async yuqueRequest(url: string, data?: any, method?: string): Promise<any> {
    // 设置请求参数
    const apiUrl = this.baseUrl + url

    let m = "POST"
    if (method) {
      m = method
    }

    const fetchOps = {
      method: m,
    }

    // 数据不为空才传递
    if (!isEmptyObject(data)) {
      Object.assign(fetchOps, {
        body: JSON.stringify(data),
      })
    }

    Object.assign(fetchOps, {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.token,
        "User-Agent": "Terwer/0.1.0",
      },
    })

    // 发送请求
    this.logger.debug("向语雀请求数据，apiUrl=>", apiUrl)
    this.logger.debug("向语雀请求数据，fetchOps=>", fetchOps)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const resJson = await this.doFetch(apiUrl, fetchOps)

    this.logger.debug("向语雀请求数据，resJson=>", resJson)
    return resJson.data ? resJson.data : null
  }
}
