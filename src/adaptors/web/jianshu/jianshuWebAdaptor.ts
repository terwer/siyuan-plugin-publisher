/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { CategoryInfo, MediaObject, Post, UserBlog } from "zhi-blog-api"
import { ElMessage } from "element-plus"
import { fileToBuffer } from "~/src/utils/polyfillUtils.ts"
import FormDataUtils from "~/src/utils/FormDataUtils.ts"

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
    const res = await this.jianshuFetch("https://www.jianshu.com/settings/basic.json")
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
    const notebooks = await this.jianshuFetch("https://www.jianshu.com/author/notebooks", undefined, "GET", header)
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
    const notebooks = await this.jianshuFetch("https://www.jianshu.com/author/notebooks", undefined, "GET", header)
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
    const initParams = JSON.stringify({
      notebook_id: notebookId,
      title: post.title,
      at_bottom: false,
    })
    const initRes = await this.jianshuFetch("https://www.jianshu.com/author/notes", initParams, "POST", initHeader)
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
    return postUrl
    // return StrUtil.pathJoin(this.cfg.home ?? "", postUrl)
  }

  public async deletePost(postid: string): Promise<boolean> {
    const jianshuPostKey = this.getJianshuPostidKey(postid)
    const pageId = jianshuPostKey.pageId

    const header = {
      accept: "application/json",
    }
    const res = await this.jianshuFetch(
      `https://www.jianshu.com/author/notes/${pageId}/soft_destroy`,
      JSON.stringify({}),
      "POST",
      header
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
      const res = await this.jianshuFetch(
        `https://www.jianshu.com/author/notes/${pageId}/note_logs`,
        undefined,
        "GET",
        header
      )
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

  public async uploadFile(mediaObject: MediaObject): Promise<any> {
    const file = new Blob([mediaObject.bits], { type: mediaObject.type })
    const filename = mediaObject.name

    this.logger.debug(`jianshu start uploadFile ${filename}=>`, file)
    if (file instanceof Blob) {
      // uploadUrl
      const uploadUrl = "https://upload.qiniup.com/"

      // 获取图片二进制数据
      const bits = await fileToBuffer(file)
      const blob = new Blob([bits], { type: file.type })

      // formData
      const tokenReq = await this.jianshuFetch("https://www.jianshu.com/upload_images/token.json?filename=" + filename)
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
    const saveParams = JSON.stringify({
      id: pageId,
      autosave_control: autosave_control,
      title: title,
      content: conetnt,
    })
    const saveRes = await this.jianshuFetch(
      `https://www.jianshu.com/author/notes/${pageId}`,
      saveParams,
      "PUT",
      saveHeader
    )
    this.logger.debug("jianshu savePost saveRes =>", saveRes)

    // 2 文章发布
    try {
      const publishHeader = {
        accept: "application/json",
      }
      const publishParams = JSON.stringify({})
      const pubRes = await this.jianshuFetch(
        `https://www.jianshu.com/author/notes/${pageId}/publicize`,
        publishParams,
        "POST",
        publishHeader
      )
      this.logger.debug("jianshu publishPost pubRes =>", pubRes)
    } catch (e) {
      ElMessage.warning("简书文章发布失败，内容已存入草稿 =>" + e)
      this.logger.error("简书文章发布失败", e)
    }
  }

  // ================
  // private methods
  // ================
  /**
   * 向简书网站请求数据
   */
  private async jianshuFetch(
    url: string,
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    headers: Record<any, any> = {},
    contentType: string = "application/json"
  ) {
    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    const body = params

    // 输出日志
    const apiUrl = url
    this.logger.debug("向简书网站请求数据，apiUrl =>", apiUrl)
    this.logger.debug("向简书网站请求数据，headers =>", headers)
    this.logger.debug("向简书网站请求数据，body =>", body)

    const resJson = await this.webFetch(apiUrl, [mergedHeaders], body, method, contentType, true, "base64")
    this.logger.debug("向简书网站请求数据，resJson =>", resJson)

    return resJson ?? null
  }

  private async jianshuFormFetch(url: string, formData: FormData) {
    // header
    const header = {}

    const resJson = await this.webFormFetch(url, [header], formData, true)
    return resJson
  }
}

export { JianshuWebAdaptor }
