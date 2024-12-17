/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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
import { Post } from "zhi-blog-api"
import { BrowserUtil } from "zhi-device"
import CookieUtils from "~/src/utils/cookieUtils.ts"
import { BilibiliUtils } from "~/src/adaptors/web/bilibili/bilibiliUtils.ts"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { MockBrowser } from "~/src/utils/MockBrowser.ts"
import WebUtils from "~/src/adaptors/web/base/webUtils.ts"

class BilibiliWebAdaptor extends BaseWebApi {
  private bilibiliMetaDataCfg = {} as any

  public async getMetaData(): Promise<any> {
    const res = await this.bilibiliFetch("https://member.bilibili.com/x/web/elec/user")
    const flag = res.code === 0
    this.logger.info(`get bilibili metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.data.mid,
      title: res.data.mid,
      avatar: "",
      type: "bilibili",
      displayName: "哔哩哔哩",
      supportTypes: ["markdown", "html"],
      home: "https://member.bilibili.com/platform/home",
      icon: "https://static.hdslb.com/images/favicon.ico",
    }
  }

  // 发布预处理，可以在这里预设一些参数。会在实际新增和更新之前调用
  public async preEditPost(post: Post, id?: string, publishCfg?: IPublishCfg): Promise<Post> {
    const newPost = await super.preEditPost(post, id, publishCfg)
    const dynCfg = publishCfg.dynCfg
    const bilibiliMetaDataCfg = publishCfg.setting[dynCfg.platformKey]
    this.logger.debug("preEditPost bilibiliMetaDataCfg =>", bilibiliMetaDataCfg)
    this.bilibiliMetaDataCfg = bilibiliMetaDataCfg
    return newPost
  }

  public async addPost(post: Post) {
    const userId = this.bilibiliMetaDataCfg.metadata.uid
    this.logger.debug("get userId from preEditPost=>", userId)
    const upload_id = BilibiliUtils.genUploadId(userId)
    // 适配 B 站专门格式
    this.logger.debug("bilibili before parse, md=>", post.markdown)
    const parsedBilibiliContent = BilibiliUtils.parseMd(post.markdown)
    this.logger.debug("bilibili add post blibiliDatas=>", parsedBilibiliContent)
    const params = JSON.stringify({
      raw_content: JSON.stringify(parsedBilibiliContent.ops),
      opus_req: {
        // upload_id: "19450592_1734338507_5421",
        upload_id: upload_id,
        opus: {
          opus_source: 2,
          title: post.title,
          content: parsedBilibiliContent.content,
          article: {
            category_id: 15,
            list_id: 0,
            originality: 0,
            reproduced: 0,
            biz_tags: [],
          },
          pub_info: {},
        },
        scene: 12,
        meta: {
          app_meta: {
            from: "create.article.web",
            mobi_app: "web",
          },
        },
        option: {
          private_pub: 2,
        },
      },
    })
    // const params = JSON.stringify({
    //   raw_content: '{"ops":[{"insert":"测试5"},{"attributes":{"header":1},"insert":"\\n"}]}',
    //   opus_req: {
    //     upload_id: "19450592_1734423520_2057",
    //     opus: {
    //       opus_source: 2,
    //       title: "测试文章5",
    //       content: {
    //         paragraphs: [
    //           {
    //             para_type: 1,
    //             text: {
    //               nodes: [
    //                 {
    //                   node_type: 1,
    //                   word: { words: "测试5", font_size: 24, font_level: "xxLarge", style: { bold: true } },
    //                 },
    //               ],
    //             },
    //           },
    //         ],
    //       },
    //       article: { category_id: 15, list_id: 0, originality: 0, reproduced: 0, biz_tags: [] },
    //       pub_info: {},
    //     },
    //     scene: 12,
    //     meta: { app_meta: { from: "create.article.web", mobi_app: "web" } },
    //     option: { private_pub: 2 },
    //   },
    // })
    // const params = JSON.stringify({
    //   raw_content: '{"ops":[{"insert":"标题1"},{"attributes":{"header":2},"insert":"\\n"}]}',
    //   opus_req: {
    //     upload_id: "19450592_1734413984_9734",
    //     opus: {
    //       opus_source: 2,
    //       title: "测试1",
    //       content: {
    //         paragraphs: [
    //           {
    //             para_type: 1,
    //             text: {
    //               nodes: [
    //                 {
    //                   node_type: 1,
    //                   word: {
    //                     words: "标题1",
    //                     font_size: 22,
    //                     font_level: "xLarge",
    //                     style: { bold: true },
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //         ],
    //       },
    //       article: { category_id: 15, list_id: 0, originality: 0, reproduced: 0, biz_tags: [] },
    //       pub_info: {},
    //     },
    //     scene: 12,
    //     meta: { app_meta: { from: "create.article.web", mobi_app: "web" } },
    //     option: { private_pub: 2 },
    //   },
    //   draft_id_str: "337255",
    // })
    this.logger.debug("bilibili after parse, params=>", params)
    const res = await this.bilibiliFetch(
      "/x/dynamic/feed/create/opus",
      {},
      params,
      "POST",
      "application/json",
      false,
      true
    )
    // res =>
    // {
    //   code: 0,
    //   message: "0",
    //   ttl: 1,
    //   data: { dyn_id_str: "1011828307105153060", dyn_type: 64, dyn_rid: 40119259, art_editor_jump_feed: 1 },
    // }
    this.logger.debug("bilibili add post res=>", res)
    if (res?.code !== 0) {
      throw new Error(`哔哩哔哩文章发布失败，可能原因：${res?.code} ${res?.message}`)
    }
    const postid = JSON.stringify(res.data)
    return {
      status: "success",
      post_id: postid,
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const userId = this.bilibiliMetaDataCfg.metadata.uid
    const upload_id = BilibiliUtils.genUploadId(userId)
    // 适配 B 站专门格式
    this.logger.debug("bilibili before parse, md=>", post.markdown)
    const parsedBilibiliContent = BilibiliUtils.parseMd(post.markdown)
    this.logger.debug("bilibili add post blibiliDatas=>", parsedBilibiliContent)
    const params = JSON.stringify({
      raw_content: JSON.stringify({
        ops: parsedBilibiliContent.ops,
      }),
      opus_req: {
        upload_id: upload_id,
        opus: {
          opus_source: 2,
          title: post.title,
          content: parsedBilibiliContent.content,
          article: {
            category_id: 15,
            list_id: 0,
            originality: 0,
            reproduced: 0,
            biz_tags: [],
          },
          pub_info: {},
        },
        scene: 12,
        meta: { app_meta: { from: "create.article.web", mobi_app: "web" } },
        option: {},
      },
      dyn_id_str: this.getDynId(postid),
    })
    this.logger.debug("bilibili after parse, params=>", params)
    const res = await this.bilibiliFetch(
      "/x/dynamic/feed/edit/opus",
      {},
      params,
      "POST",
      "application/json",
      false,
      true
    )
    this.logger.debug("bilibili edit post res=>", res)
    if (res?.code !== 0) {
      throw new Error(`哔哩哔哩文章更新失败，可能原因：${res?.code} ${res?.message}`)
    }
    return true
  }

  public async deletePost(postid: string): Promise<boolean> {
    const postMeta = this.getPostMeta(postid)
    const params = JSON.stringify({
      dyn_id_str: postMeta.dyn_id_str,
      dyn_type: postMeta.dyn_type,
      rid_str: postMeta.dyn_rid.toString(),
    })
    const res = await this.bilibiliFetch(
      "/x/dynamic/feed/operate/remove",
      {},
      params,
      "POST",
      "application/json",
      false,
      true
    )
    this.logger.debug("bilibili delete post res=>", res)
    if (res?.code !== 0) {
      throw new Error(`哔哩哔哩文章删除失败，可能原因：${res?.code} ${res?.message}`)
    }
    return true
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const dynId = this.getDynId(postid)
    const previewUrl = this.cfg.previewUrl.replace(/\[postid]/g, dynId)
    return previewUrl
  }

  // ================
  // private methods
  // ================
  private getDynId(postid: string) {
    const postMeta = this.getPostMeta(postid)
    return postMeta?.dyn_id_str
  }

  private getPostMeta(postid: string) {
    return JsonUtil.safeParse<any>(postid, {} as any)
  }

  private async bilibiliFetch(
    url: string,
    headers: any = {},
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json",
    isAbsolute: boolean = true,
    isCsrf: boolean = false
  ) {
    const csrf = CookieUtils.getCookieFromString("bili_jct", this.cfg.password)
    const fullUrl = isAbsolute ? url : StrUtil.pathJoin(this.cfg.apiUrl, url)
    const apiUrl = isCsrf ? BrowserUtil.setUrlParameter(fullUrl, "csrf", csrf) : fullUrl
    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      "User-Agent": MockBrowser.HEADERS.MACOS_CHROME["User-Agent"],
      ...headers,
    }

    const body = params

    // 构建请求选项
    const requestOptions: RequestInit = {
      method: method,
      headers: mergedHeaders,
      body: params,
    }

    // 发送请求并返回响应
    this.logger.debug("bilibili url =>", apiUrl)
    this.logger.debug("bilibili requestOptions =>", requestOptions)
    const res = await this.webFetch(apiUrl, [mergedHeaders], body, method, contentType, true, "base64", "text")
    return res
  }
}

export { BilibiliWebAdaptor }
