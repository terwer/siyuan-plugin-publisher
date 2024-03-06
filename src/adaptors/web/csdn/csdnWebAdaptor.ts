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
import { BlogConfig, CategoryInfo, PageTypeEnum, Post, UserBlog } from "zhi-blog-api"
import { JsonUtil } from "zhi-common"
import WebUtils from "~/src/adaptors/web/base/webUtils.ts"
import _ from "lodash-es"

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
        userblog.blogName = item.edit_title
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
        cat.categoryName = item.edit_title
        cat.description = item.column_url
        cat.categoryDescription = item.desc
        cats.push(cat)
      })
    }

    return cats
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // CSDN自定义的处理
    const cfg: BlogConfig = publishCfg?.cfg
    const updatedPost = _.cloneDeep(doc) as Post
    const html = updatedPost.html
    this.logger.info("准备处理CSDN正文")
    this.logger.debug("html =>", { html: html })
    let updatedHtml = html

    // 处理数学公式
    updatedHtml = CsdnUtils.processCsdnMath(updatedHtml)

    // 处理完毕
    updatedPost.html = updatedHtml
    this.logger.info("CSDN正文处理完毕")
    this.logger.debug("updatedHtml =>", { updatedHtml: updatedHtml })

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      updatedPost.description = updatedPost.markdown
    } else {
      updatedPost.description = updatedPost.html
    }

    return updatedPost
  }

  public async addPost(post: Post) {
    // 仅支持MD
    const params = JSON.stringify({
      title: post.title,
      markdowncontent: post.markdown,
      content: post.html,
      readType: "public",
      level: 0,
      tags: post.mt_keywords,
      status: 0,
      categories: post.categories.join(","),
      type: "original",
      original_link: "",
      authorized_status: false,
      Description: post.shortDesc,
      not_auto_saved: "1",
      source: "pc_mdeditor",
      cover_images: [],
      cover_type: 1,
      is_new: 1,
      vote_id: 0,
      resource_id: "",
      pubStatus: "publish",
    })

    const res = await this.csdnFetch(
      "https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle",
      [],
      params,
      "POST"
    )
    this.logger.debug("save csdn post res=>", res)

    if (res?.code !== 200) {
      throw new Error("CSDN文章发布失败，可能是等级不够导致，如过等级不够，请去掉文章标签")
    }

    const postid = res.data.id.toString()

    return {
      status: "success",
      post_id: postid,
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    // 仅支持MD
    const params = JSON.stringify({
      id: postid,
      title: post.title,
      markdowncontent: post.markdown,
      content: post.html,
      readType: "public",
      level: "1",
      tags: post.mt_keywords,
      status: 0,
      categories: post.categories.join(","),
      type: "original",
      original_link: "",
      authorized_status: false,
      Description: post.shortDesc,
      resource_url: "",
      not_auto_saved: "1",
      source: "pc_mdeditor",
      cover_images: [],
      cover_type: 1,
      is_new: 1,
      vote_id: 0,
      resource_id: "",
      pubStatus: "publish",
    })

    const res = await this.csdnFetch(
      "https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle",
      [],
      params,
      "POST"
    )
    this.logger.debug("save csdn post res=>", res)

    if (res?.code !== 200) {
      throw new Error("CSDN文章更新失败，可能是等级不够导致，如果等级不够，请去掉文章标签")
    }

    this.logger.debug("edit csdn post res=>", res)
    return true
  }

  public async getPost(postid: string): Promise<Post> {
    const res = await this.csdnFetch(`https://bizapi.csdn.net/blog-console-api/v3/editor/getArticle?id=${postid}`)
    this.logger.debug("get csdn post =>", res)

    const post = new Post()
    if (res?.code === 200) {
      const csdnPost = res?.data
      post.postid = csdnPost.article_id
      post.title = csdnPost.title
      post.mt_keywords = csdnPost?.tags ?? ""
      post.categories = csdnPost?.categories.split(",") ?? []
    }
    return post
  }

  public async deletePost(postid: string): Promise<boolean> {
    let flag = false
    try {
      const params = JSON.stringify({
        articleId: postid,
        // 永久删除，默认只删除到回收站
        deep: false,
      })
      const res = await this.csdnFetch(
        "https://bizapi.csdn.net/blog/phoenix/console/v1/article/del",
        [],
        params,
        "POST"
      )
      this.logger.debug("delete csdn article res=>", res)

      if (res?.code !== 200) {
        throw new Error(res?.message)
      }

      flag = true
    } catch (e) {
      this.logger.error("CSDN文章删除失败", e)
      throw e
    }

    return flag
  }

  public async uploadFile(file: File | Blob, filename?: string): Promise<any> {
    this.logger.debug(`csdn start uploadFile ${filename}=>`, file)
    if (file instanceof Blob) {
      const uploadData = await this.requestUpload(filename)
      this.logger.debug("csdn image uploadData =>", uploadData)
      if (!uploadData) {
        throw new Error("CSDN图片信息获取失败 =>" + filename)
      }

      const uploadUrl = uploadData.host
      const formData = new FormData()
      formData.append("key", uploadData.filePath)
      formData.append("policy", uploadData.policy)
      formData.append("OSSAccessKeyId", uploadData.accessId)
      formData.append("success_action_status", "200")
      formData.append("signature", uploadData.signature)
      formData.append("callback", uploadData.callbackUrl)
      formData.append("file", file)

      this.logger.debug("csdn image upload strat...")
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })
      const resText = await response.text()
      this.logger.debug("csdn image upload success, resText=>", resText)
      const resJson = JsonUtil.safeParse<any>(resText, {} as any)
      if (resJson.code !== 200) {
        throw new Error("CSDN图片上传失败 =>" + filename)
      }
      return {
        id: resJson.data.targetObjectKey,
        object_key: resJson.data.targetObjectKeyy,
        url: resJson.data.imageUrl,
      }

      // 其他方式，待研究。上面的仅PC客户端可用
      // var res = await this.csdnFetch(uploadUrl, [], params, "POST", "multipart/form-data")
      // this.logger.debug("csdn image upload success, res=>", res)
    }

    return {}
  }

  // ================
  // private methods
  // ================
  private async requestUpload(filename: string) {
    const api = "https://imgservice.csdn.net/direct/v1.0/image/upload?watermark=&type=blog&rtype=markdown"
    const fileExt = filename.split(".").pop()
    if (!this.validateFileExt(fileExt)) {
      return null
    }

    var res = await this.csdnFetch(api, {
      "x-image-app": "direct_blog",
      "x-image-suffix": fileExt,
      "x-image-dir": "direct",
    })
    if (res.code !== 200) {
      this.logger.error("图片可能已经上传，信息如下", res)
      return null
    }
    return res.data
  }

  private validateFileExt(ext: string): boolean {
    switch (ext.toLowerCase()) {
      case "jpg":
      case "png":
      case "jpeg":
      case "gif":
        return true
      default:
        return false
    }
  }

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
    return res
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const token = this.cfg.password
    const userid = WebUtils.readCookie("UserName", token)
    const previewUrl = this.cfg.previewUrl.replace(/\[userid\]/g, userid).replace(/\[postid\]/g, postid)
    return previewUrl
    // return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
  }
}

export { CsdnWebAdaptor }
