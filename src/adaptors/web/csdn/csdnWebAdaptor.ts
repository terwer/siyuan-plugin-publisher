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
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"
import { CategoryInfo, UserBlog } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import WebUtils from "~/src/adaptors/web/base/webUtils.ts"

/**
 * CSDN网页授权适配器
 *
 * @see [wechatsync csdn adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/CSDN.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CsdnWebAdaptor extends BaseWebApi {
  // /**
  //  * 初始化CSDN API 适配器
  //  *
  //  * @param appInstance 应用实例
  //  * @param cfg 配置项
  //  */
  // constructor(appInstance: PublisherAppInstance, cfg: CsdnConfig) {
  //   super(appInstance, cfg)
  //   this.cfg = cfg
  //
  //   this.logger = createAppLogger("csdn-web-adaptor")
  // }

  public async getMetaData(): Promise<any> {
    const res = await this.csdnFetch("https://bizapi.csdn.net/blog-console-api/v1/user/info")
    const flag = !!res.data.username
    this.logger.info(`get csdn metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.data.username,
      title: res.data.username,
      avatar: res.data.avatar,
      type: "csdn",
      displayName: "CSDN",
      supportTypes: ["markdown", "html"],
      home: "https://mp.csdn.net/",
      icon: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    }
  }

  public async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []

    const res = await this.csdnFetch("https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all")
    this.logger.debug("get csdn columns =>", res)
    if (res?.code === 200) {
      const columnList = res?.data?.list
      const column = columnList?.column ?? []
      const payCcolumn = columnList?.pay_column ?? []

      // 普通专栏
      column.forEach((item: any) => {
        const userblog: UserBlog = new UserBlog()
        userblog.blogid = item.id
        userblog.blogName = item.edit_title
        userblog.url = item.column_url
        // userblog.imgUrl = item.img_url
        result.push(userblog)
      })

      // 付费专栏
      payCcolumn.forEach((item: any) => {
        const userblog: UserBlog = new UserBlog()
        userblog.blogid = item.id
        userblog.blogName = `[付费]${item.edit_title}`
        userblog.url = item.column_url
        // userblog.imgUrl = item.img_url
        result.push(userblog)
      })
    }

    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const res = await this.csdnFetch("https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all")
    this.logger.debug("get csdn columns =>", res)
    if (res?.code === 200) {
      const columnList = res?.data?.list
      const column = columnList?.column ?? []
      const payCcolumn = columnList?.pay_column ?? []

      // 普通专栏
      column.forEach((item: any) => {
        const cat = new CategoryInfo()

        cat.categoryId = item.id
        cat.categoryName = item.edit_title
        cat.description = item.column_url
        cat.categoryDescription = item.desc
        cats.push(cat)
      })

      // 付费专栏
      payCcolumn.forEach((item: any) => {
        const cat = new CategoryInfo()

        cat.categoryId = item.id
        cat.categoryName = `[付费]${item.edit_title}`
        cat.description = item.column_url
        cat.categoryDescription = item.desc
        cats.push(cat)
      })
    }

    return cats
  }

  // ================
  // private methods
  // ================
  private async csdnFetch(
    url: string,
    headers: any = {},
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ) {
    // 设置请求头
    const accept = "*/*"
    const xcakey = CsdnUtils.X_CA_KEY
    const xCaNonce = CsdnUtils.generateXCaNonce()
    const xCaSignature = CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("accept", accept)
    reqHeaderMap.set("content-type", contentType)
    reqHeaderMap.set("x-ca-key", xcakey)
    reqHeaderMap.set("x-ca-nonce", xCaNonce)
    reqHeaderMap.set("x-ca-signature", xCaSignature)
    reqHeaderMap.set("x-ca-signature-headers", "x-ca-key,x-ca-nonce")

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    // 构建请求选项
    const requestOptions: RequestInit = {
      method: method,
      headers: mergedHeaders,
      body: params,
    }

    // 发送请求并返回响应
    this.logger.debug("csdn url =>", url)
    this.logger.debug("csdn requestOptions =>", requestOptions)
    const res = await this.webProxyFetch(url, [mergedHeaders], params, method, contentType)
    if (res?.code !== 200) {
      throw new Error(res?.body?.message)
    }
    return res
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const token = this.cfg.password
    const userid = WebUtils.readCookie("UserName", token)
    const previewUrl = this.cfg.previewUrl.replace(/\[userid\]/g, userid).replace(/\[postid\]/g, postid)
    return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
  }
}

export { CsdnWebAdaptor }
