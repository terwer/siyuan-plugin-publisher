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
import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import * as cheerio from "cheerio"
import { JsonUtil, StrUtil } from "zhi-common"
import CryptoJS from "crypto-js"
import { arrayToBuffer } from "~/src/utils/polyfillUtils.ts"
import { getAliOssClient } from "~/src/vendors/alioss/s3oss.ts"

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
  // constructor(appInstance: PublisherAppInstance, cfg: ZhihuConfig) {
  //   super(appInstance, cfg)
  //
  //   this.cfg = cfg
  //   this.logger = createAppLogger("zhihu-web-adaptor")
  // }

  public async getMetaData(): Promise<any> {
    const res = await this.webProxyFetch(
      "https://www.zhihu.com/api/v4/me?include=account_status%2Cis_bind_phone%2Cis_force_renamed%2Cemail%2Crenamed_fullname"
    )
    const flag = !!res.uid
    this.logger.info(`get zhihu metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.uid,
      title: res.name,
      avatar: res.avatar_url,
      supportTypes: ["html"],
      type: "zhihu",
      displayName: "知乎",
      home: "https://www.zhihu.com/settings/account",
      icon: "https://static.zhihu.com/static/favicon.ico",
    }
  }

  public async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []

    const url = `https://www.zhihu.com/people/${this.cfg.username}/columns`
    const res = await this.webProxyFetch(url, [], {}, "GET", "text/html")
    this.logger.debug("get zhihu columns dom =>", { res })
    const $ = cheerio.load(res)
    const scriptContent = $("#js-initialData").html()
    const initJson = JsonUtil.safeParse<any>(scriptContent, {})
    this.logger.debug("get column initJson=>", initJson)
    const columns = initJson?.initialState?.entities?.columns ?? {}
    this.logger.debug("get columns=>", columns)

    Object.keys(columns).map((key) => {
      const useBlog = new UserBlog()
      const item = columns[key]
      useBlog.blogid = item.id
      useBlog.blogName = item.title
      useBlog.url = item.url
      result.push(useBlog)
    })

    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  public async addPost(post: Post) {
    const params = JSON.stringify({
      title: post.title,
      content: post.description,
    })
    const res = await this.webProxyFetch("https://zhuanlan.zhihu.com/api/articles/drafts", [], params, "POST")
    this.logger.debug("save zhihu draft res=>", res)

    if (!res.id) {
      throw new Error("知乎文章发布失败")
    }
    const postid = res.id.toString()

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
    const pubRes = await this.webProxyFetch(
      `https://zhuanlan.zhihu.com/api/articles/${res.id}/publish`,
      [],
      pubParams,
      "PUT"
    )
    this.logger.debug("publish zhihu article pubRes=>", pubRes)

    // 收录文章到专栏
    const column = post.cate_slugs?.[0] ?? this.cfg.blogid
    await this.addPostToColumn(column, postid)

    return {
      status: "success",
      post_id: postid,
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    // 先更新草稿
    const params = JSON.stringify({
      title: post.title,
      content: post.description,
      table_of_contents: false,
      delta_time: 10,
    })

    const draftRes = await this.webProxyFetch(
      `https://zhuanlan.zhihu.com/api/articles/${postid}/draft`,
      [],
      params,
      "PATCH"
    )
    this.logger.debug("updated zhihu draft =>", draftRes)
    if (draftRes?.error?.message) {
      throw new Error(`知乎文章更新失败：[${draftRes.error.name}] ` + draftRes.error.message)
    }

    // 目前是存草稿，现在需要把它设置为发布
    const pubParams = JSON.stringify({
      disclaimer_type: "none",
      disclaimer_status: "close",
      table_of_contents_enabled: false,
      commercial_report_info: { commercial_types: [] },
      commercial_zhitask_bind_info: null,
    })
    const pubRes = await this.webProxyFetch(
      `https://zhuanlan.zhihu.com/api/articles/${postid}/publish`,
      [],
      pubParams,
      "PUT"
    )

    // 收录文章到专栏
    // const column = post.cate_slugs?.[0] ?? this.cfg.blogid
    // await this.addPostToColumn(column, postid)

    this.logger.debug("edit zhihu pubRes=>", pubRes)
    return true
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    return `https://zhuanlan.zhihu.com/p/${postid}`
  }

  public async deletePost(postid: string): Promise<boolean> {
    let flag = false
    try {
      const res = await this.webProxyFetch(`https://www.zhihu.com/api/v4/articles/${postid}`, [], {}, "DELETE")
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

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const url = `https://www.zhihu.com/people/${this.cfg.username}/columns`
    const res = await this.webProxyFetch(url, [], {}, "GET", "text/html")
    this.logger.debug("get zhihu columns dom =>", { res })
    const $ = cheerio.load(res)
    const scriptContent = $("#js-initialData").html()
    const initJson = JsonUtil.safeParse<any>(scriptContent, {})
    this.logger.debug("get column initJson=>", initJson)
    const columns = initJson?.initialState?.entities?.columns ?? {}
    this.logger.debug("get columns=>", columns)

    Object.keys(columns).map((key) => {
      const cat = new CategoryInfo()
      const item = columns[key]
      cat.categoryId = item.id
      cat.categoryName = item.title
      cat.description = item.url
      cat.categoryDescription = item.url
      cats.push(cat)
    })

    return cats
  }

  public async uploadFile(file: File | Blob, filename?: string): Promise<any> {
    this.logger.debug(`zhihu start uploadFile ${filename}=>`, file)
    if (file instanceof Blob) {
      // 1. 获取图片hash
      const ab = await file.arrayBuffer()
      const bits = arrayToBuffer(ab)
      const hash = CryptoJS.MD5(bits.toString("utf8")).toString()
      // const wordArray = CryptoJS.enc.Latin1.parse(bits.toString("latin1"))
      // const hash = CryptoJS.MD5(wordArray).toString()
      const params = JSON.stringify({
        image_hash: hash,
        source: "article",
      })
      this.logger.debug("zhihu uploadFile, params =>", params)
      const fileResp = await this.webProxyFetch("https://api.zhihu.com/images", [], params, "POST")
      this.logger.debug("zhihu uploadFile, fileResp =>", fileResp)

      // 2. 开始上传
      const upload_file = fileResp.upload_file
      if (fileResp.upload_file.state == 1) {
        const imgDetail = await this.untilImageDone(upload_file.image_id)
        this.logger.debug("imgDetail", imgDetail)
        upload_file.object_key = imgDetail.original_hash
      } else {
        const token = fileResp.upload_token
        try {
          const client = getAliOssClient("https://zhihu-pics-upload.zhimg.com", "zhihu-pics", token)
          const finalUrl = await client.put(upload_file.object_key, new Blob([bits]))
          this.logger.debug("zhihu uploadFile finished", { client, finalUrl })
        } catch (e) {
          this.logger.error("知乎图片上传失败 =>", e)
          throw new Error("知乎图片上传失败, 错误原因 =>" + e)
        }
      }

      if (file.type === "image/gif") {
        // add extension for gif
        upload_file.object_key = upload_file.object_key + ".gif"
      }
      return {
        id: upload_file.object_key,
        object_key: upload_file.object_key,
        // url: "https://pic1.zhimg.com/80/v2-af46e3b737c2d69b5f24420009f59455_1440w.jpeg",
        url: "https://pic4.zhimg.com/" + upload_file.object_key,
        // url: 'https://pic1.zhimg.com/80/' + upload_file.object_key + '_hd.png',
      }
    }

    return {}
  }

  // ================
  // private methods
  // ================
  /**
   * 收录文章到专栏
   *
   * @param columnId - 专栏ID
   * @param articleId - 文章ID
   * @private
   */
  private async addPostToColumn(columnId: string, articleId: string) {
    if (StrUtil.isEmptyString(columnId) || StrUtil.isEmptyString(articleId)) {
      this.logger.info("文章或者专栏为空，不收录")
      return
    }

    try {
      const params = { type: "article", id: articleId }
      await this.webProxyFetch(`https://www.zhihu.com/api/v4/columns/${columnId}/items`, [], params, "POST")
    } catch (e) {
      this.logger.error("文章收录到专栏失败", e)
    }
    this.logger.info("文章收录到专栏成功")
  }

  private async untilImageDone(image_id: string): Promise<any> {
    const that = this
    return new Promise(function (resolve, reject) {
      function waitToNext() {
        that.logger.debug("untilImageDone start processing...", image_id)
        ;(async () => {
          const imgDetail = await that.webProxyFetch(`https://api.zhihu.com/images/${image_id}`, [], {}, "GET")
          that.logger.debug("imgDetail", imgDetail)
          if (imgDetail.status != "processing") {
            that.logger.info("image upload all done")
            resolve(imgDetail)
          } else {
            that.logger.debug("go next", waitToNext)
            setTimeout(waitToNext, 300)
          }
        })()
      }
      waitToNext()
    })
  }
}

export { ZhihuWebAdaptor }
