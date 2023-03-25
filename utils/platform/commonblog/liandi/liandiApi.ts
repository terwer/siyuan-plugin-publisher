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
import { isEmptyObject, isEmptyString } from "~/utils/util"

/**
 * 链滴API
 *
 * @author terwer
 * @date 2022-08-02 23:17
 *
 * https://ld246.com/article/1488603534762
 */
export class LiandiApi extends CommonblogApi {
  // private readonly rewardContent = "如果您觉得此文章不错，请随意打赏哦~"
  // private readonly rewardCount = 5;

  private readonly baseUrl: string
  private readonly username: string
  private readonly token: string

  /**
   * 初始化链滴API
   * @param baseUrl
   * @param username
   * @param token
   */
  constructor(baseUrl: string, username: string, token: string) {
    super()
    this.logger = LogFactory.getLogger("utils/platform/commonblog/liandi/liandiApi.ts")
    this.baseUrl = baseUrl
    this.username = username
    this.token = token
  }

  /**
   * 获取当前登录用户信息
   */
  public async getUser(): Promise<any> {
    const url = "/user"
    const data = {}
    return await this.liandiRequest(url, data, "GET", true)
    // 示例：https://ld246.com/api/v2/user
  }

  /**
   * 发布帖子
   */
  public async addArticle(title: string, content: string, tags: string): Promise<string> {
    const url = "/article"
    const data = {
      articleTitle: title,
      articleTags: tags, // 用英文逗号分隔
      articleContent: content,
      // "articleRewardContent": this.rewardContent, // 打赏区内容
      // "articleRewardPoint": this.rewardCount // 打赏积分
    }

    await this.liandiRequest(url, data, "POST", true)
    const postid = await this.getFirstArticleId()
    this.logger.debug("liandi addArticle postid=>", postid)

    return postid
  }

  /**
   * 由于发帖子的接口不支持返回ID，我们自己查最新的ID
   */
  private async getFirstArticleId(): Promise<any> {
    const url = "/user/" + this.username + "/articles?p=1"
    const data = {}
    const result = await this.liandiRequest(url, data, "GET", true)
    const articles = result.articles
    if (articles.length === 0) {
      throw new Error("未获取到帖子")
    }
    return articles[0].oId
  }

  /**
   * 发布帖子
   */
  public async updateArticle(articleId: string, title: string, content: string, tags: string): Promise<boolean> {
    const url = "/article/" + articleId
    const data = {
      articleTitle: title,
      articleTags: tags, // 用英文逗号分隔
      articleContent: content,
      // "articleRewardContent": this.rewardContent, // 打赏区内容
      // "articleRewardPoint": this.rewardCount // 打赏积分
    }

    await this.liandiRequest(url, data, "PUT", true)
    return true
  }

  // ==========================================================================
  // ==========================================================================
  /**
   * 向链滴请求数据
   * @param url url
   * @param data 数据
   * @param method 请求方法 GET | POST
   * @param useToken 是否使用权限TOKEN
   * @private
   */
  private async liandiRequest(url: string, data?: any, method?: string, useToken?: boolean): Promise<any> {
    // 设置请求参数
    const apiUrl = this.baseUrl + url

    let m = "POST"
    if (method != null) {
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

    if (useToken) {
      Object.assign(fetchOps, {
        headers: {
          Authorization: `token ${this.token}`,
          "User-Agent": "Terwer/0.1.0",
        },
      })
    }

    // 发送请求
    this.logger.debug("向链滴请求数据，apiUrl=>", apiUrl)
    this.logger.debug("向链滴请求数据，fetchOps=>", fetchOps)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const resJson = await this.doFetch(apiUrl, fetchOps)

    this.logger.debug("向链滴请求数据，resJson=>", resJson)
    if (resJson.code === 0) {
      return resJson.data
    } else if (resJson.code === -1) {
      throw new Error(resJson.msg)
    } else {
      const msg = resJson.msg
      if (!isEmptyString(msg)) {
        throw new Error(msg)
      }

      throw new Error("发布帖子受限或者系统异常")
    }
  }
}
