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
import { JsonUtil, StrUtil } from "zhi-common"
import { ElMessage } from "element-plus"
import { fileToBuffer } from "~/src/utils/polyfillUtils.ts"

/**
 * 简书网页授权适配器
 *
 * @see [wechatsync jianshu adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/jianshu.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class JianshuWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.webProxyFetch("https://www.jianshu.com/settings/basic.json")
    const avatar = res.data.avatar
    const uid = avatar.substring(avatar.lastIndexOf("/") + 1, avatar.lastIndexOf("."))
    const flag = !!uid
    this.logger.info(`get jianshu metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: uid,
      title: res.data.nickname,
      avatar: avatar,
      type: "jianshu",
      displayName: "简书",
      supportTypes: ["html"],
      home: "https://www.jianshu.com/settings/basic",
      icon: "https://www.jianshu.com/favicon.ico",
    }
  }

  public async getUsersBlogs(): Promise<Array<UserBlog>> {
    const result: UserBlog[] = []
    const header = {
      accept: "application/json",
    }
    const notebooks = await this.webProxyFetch("https://www.jianshu.com/author/notebooks", [header])
    this.logger.info(`get jianshu notebooks`, notebooks)

    if (notebooks && notebooks.length > 0) {
      notebooks.forEach((item: any) => {
        const useBlog = new UserBlog()

        useBlog.blogid = item.id
        useBlog.blogName = item.name
        result.push(useBlog)
      })
    }

    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const header = {
      accept: "application/json",
    }
    const notebooks = await this.webProxyFetch("https://www.jianshu.com/author/notebooks", [header])
    this.logger.info(`get jianshu notebooks`, notebooks)

    if (notebooks && notebooks.length > 0) {
      notebooks.forEach((item: any) => {
        const cat = new CategoryInfo()
        cat.categoryId = item.id
        cat.categoryName = item.name
        cats.push(cat)
      })
    }

    return cats
  }

  public async addPost(post: Post) {
    this.logger.debug("start add post =>", { post })
    // 1 初始化文章，返回文章ID
    // 如果没传递过来就用默认的父页面
    const notebookId = post.cate_slugs?.[0]?.toString() ?? this.cfg.blogid.toString()
    const initHeader = {
      accept: "application/json",
    }
    const initParams = {
      notebook_id: notebookId,
      title: post.title,
      at_bottom: false,
    }
    const initRes = await this.webProxyFetch("https://www.jianshu.com/author/notes", [initHeader], initParams, "POST")
    this.logger.debug("jianshu addPost initRes =>", initRes)
    const pageId = initRes.id
    const endUrl = initRes.slug

    // 文章更新并发布
    await this.updateJianshuArticle(pageId, post.title, post.description, 1)
    this.logger.info(`文章发布成功，开始组装简书的ID组合,pageId=${pageId},notebookId=${notebookId},endUrl=${endUrl}`)
    const postid = [pageId, notebookId, endUrl].join("_")
    return {
      status: "success",
      post_id: postid,
    }
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const purl = this.cfg.previewUrl ?? ""
    const jianshuPostKey = this.getJianshuPostidKey(postid)
    // const pageId = jianshuPostKey.pageId
    const endUrl = jianshuPostKey.endUrl
    const postUrl = purl.replace("[postid]", endUrl)
    return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async deletePost(postid: string): Promise<boolean> {
    const jianshuPostKey = this.getJianshuPostidKey(postid)
    const pageId = jianshuPostKey.pageId

    const header = {
      accept: "application/json",
    }
    const res = await this.webProxyFetch(
      `https://www.jianshu.com/author/notes/${pageId}/soft_destroy`,
      [header],
      undefined,
      "POST"
    )
    this.logger.debug("jianshu delete post res =>", res)

    return true
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    let flag = false
    try {
      const jianshuPostKey = this.getJianshuPostidKey(postid)
      const pageId = jianshuPostKey.pageId

      // 查询历史版本
      const header = {
        accept: "application/json",
      }
      const res = await this.webProxyFetch(`https://www.jianshu.com/author/notes/${pageId}/note_logs`, [header])
      this.logger.debug("jianshu get post version res =>", res)

      // 文章更新并发布
      const newVersion = res.length + 1
      this.logger.debug("jianshu update post with new version =>", newVersion)
      await this.updateJianshuArticle(pageId, post.title, post.description, newVersion)
      flag = true
    } catch (e) {
      this.logger.error("简书文章更新失败", e)
    }

    return flag
  }

  public async uploadFile(file: File | Blob, filename?: string): Promise<any> {
    this.logger.debug(`jianshu start uploadFile ${filename}=>`, file)
    if (file instanceof Blob) {
      // import
      const win = this.appInstance.win
      if (!win.require) {
        throw new Error("非常抱歉，目前仅思源笔记PC客户端支持上传图片")
      }
      const { FormData, Blob } = win.require(`${this.appInstance.moduleBase}libs/node-fetch-cjs/dist/index.js`)

      // uploadUrl
      const uploadUrl = "https://upload.qiniup.com/"

      // 获取图片二进制数据
      const bits = await fileToBuffer(file)
      const blob = new Blob([bits], { type: file.type })

      // formData
      const tokenReq = await this.webProxyFetch("https://www.jianshu.com/upload_images/token.json?filename=" + filename)
      this.logger.debug("jianshu get picture token res =>", tokenReq)
      const formData = new FormData()
      formData.append("token", tokenReq.token)
      formData.append("key", tokenReq.key)
      formData.append("x:protocol", "https")
      formData.append("file", blob, filename)

      // 发送请求
      const resJson = await this.jianshuFormFetch(uploadUrl, formData)
      this.logger.debug("jianshu upload success, resJson =>", resJson)
      if (!resJson.url) {
        throw new Error("简书图片上传失败 =>" + filename)
      }

      const url = resJson.url
      return {
        id: tokenReq.key,
        object_key: tokenReq.key,
        url: url,
      }
    }

    return {}
  }

  // ================
  // private methods
  // ================
  /**
   * 获取封装的postid
   *
   * @param postid
   * @private postid
   */
  private getJianshuPostidKey(postid: string): any {
    let pageId: string
    let notebookId: string
    let endUrl: string
    if (postid.indexOf("_") > 0) {
      const idArr = postid.split("_")
      pageId = idArr[0]
      notebookId = idArr[1]
      endUrl = idArr[2]
    } else {
      pageId = postid
    }

    return {
      pageId: pageId,
      notebookId: notebookId,
      endUrl: endUrl,
    }
  }

  /**
   *
   * @param pageId - 文章ID
   * @param title - 标题
   * @param conetnt -正文
   * @param autosave_control 版本号码，更新必须增加
   * @private
   */
  private async updateJianshuArticle(pageId: string, title: string, conetnt: string, autosave_control: number = 1) {
    // 1 实时保存文章
    const saveHeader = {
      accept: "application/json",
    }
    const saveParams = {
      id: pageId,
      autosave_control: autosave_control,
      title: title,
      content: conetnt,
    }
    const saveRes = await this.webProxyFetch(
      `https://www.jianshu.com/author/notes/${pageId}`,
      [saveHeader],
      saveParams,
      "PUT"
    )
    this.logger.debug("jianshu savePost saveRes =>", saveRes)

    // 2 文章发布
    try {
      const publishHeader = {
        accept: "application/json",
      }
      const pubRes = await this.webProxyFetch(
        `https://www.jianshu.com/author/notes/${pageId}/publicize`,
        [publishHeader],
        {},
        "POST"
      )
      this.logger.debug("jianshu publishPost pubRes =>", pubRes)
    } catch (e) {
      ElMessage.warning("简书文章发布失败，内容已存入草稿 =>" + e)
      this.logger.error("简书文章发布失败", e)
    }
  }

  private async jianshuFormFetch(url: string, formData: FormData) {
    // header
    const header = {}

    const resJson = await this.webFormFetch(url, [header], formData)
    return resJson
  }
}

export { JianshuWebAdaptor }
