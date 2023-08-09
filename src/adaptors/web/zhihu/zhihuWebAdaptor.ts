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

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { Post, UserBlog } from "zhi-blog-api"
import { types } from "sass"
import Error = types.Error

/**
 * 知乎网页授权适配器
 *
 * @see [wechatsync zhihu adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/%40wechatsync/drivers/src/zhihu.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class ZhihuWebAdaptor extends BaseWebApi {
  // /**
  //  * 初始化知乎 API 适配器
  //  *
  //  * @param appInstance 应用实例
  //  * @param cfg 配置项
  //  */
  // constructor(appInstance: AppInstance, cfg: ZhihuConfig) {
  //   super(appInstance, cfg)
  //
  //   this.cfg = cfg
  //   this.logger = createAppLogger("zhihu-web-adaptor")
  // }

  public async getMetaData(): Promise<any> {
    const res = await this.proxyFetch(
      "https://www.zhihu.com/api/v4/me?include=account_status%2Cis_bind_phone%2Cis_force_renamed%2Cemail%2Crenamed_fullname"
    )
    const flag = !!res.uid
    this.logger.info(`get zhihu metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.uid,
      title: res.name,
      avatar: res.avatar_url,
      supportTypes: ["markdown"],
      type: "zhihu",
      displayName: "知乎",
      home: "https://www.zhihu.com/settings/account",
      icon: "https://static.zhihu.com/static/favicon.ico",
    }
  }

  public async addPost(post: Post) {
    const params = JSON.stringify({
      title: post.title,
      content: post.description,
    })
    const res = await this.proxyFetch("https://zhuanlan.zhihu.com/api/articles/drafts", [], params, "POST")
    this.logger.debug("save zhihu draft res=>", res)

    if (!res.id) {
      throw new Error("知乎文章发布失败")
    }

    // 目前是存草稿，现在需要把它设置为发布
    const pubParams = JSON.stringify({
      column: null,
      commentPermission: "anyone",
      disclaimer_type: "none",
      disclaimer_status: "close",
      table_of_contents_enabled: false,
      commercial_report_info: { commercial_types: [] },
      commercial_zhitask_bind_info: null,
    })
    const pubRes = await this.proxyFetch(
      `https://zhuanlan.zhihu.com/api/articles/${res.id}/publish`,
      [],
      pubParams,
      "PUT"
    )
    this.logger.debug("publish zhihu article pubRes=>", pubRes)

    return {
      status: "success",
      post_id: res.id.toString(),
    }
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    return `https://zhuanlan.zhihu.com/p/${postid}`
  }

  public async deletePost(postid: string): Promise<boolean> {
    let flag = false
    try {
      const res = await this.proxyFetch(`https://www.zhihu.com/api/v4/articles/${postid}`, [], {}, "DELETE")
      this.logger.debug("delete zhihu article res=>", res)
      if (res.success) {
        flag = true
      } else {
        throw new Error(res.error.message)
      }
    } catch (e) {
      this.logger.error("知乎文章删除失败", e)
      throw e
    }

    return flag
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    // 先更新草稿
    const params = JSON.stringify({
      title: post.title,
      content: post.description,
      table_of_contents: false,
      delta_time: 10,
    })

    try {
      await this.proxyFetch(`https://zhuanlan.zhihu.com/api/articles/${postid}/draft`, [], params, "PATCH")
      this.logger.debug("updated zhihu draft")
    } catch (e) {
      throw new Error("知乎文章更新失败")
    }

    // 目前是存草稿，现在需要把它设置为发布
    const pubParams = JSON.stringify({
      disclaimer_type: "none",
      disclaimer_status: "close",
      table_of_contents_enabled: false,
      commercial_report_info: { commercial_types: [] },
      commercial_zhitask_bind_info: null,
    })
    const pubRes = await this.proxyFetch(
      `https://zhuanlan.zhihu.com/api/articles/${postid}/publish`,
      [],
      pubParams,
      "PUT"
    )
    this.logger.debug("edit zhihu pubRes=>", pubRes)
    return true
  }
}

export { ZhihuWebAdaptor }
