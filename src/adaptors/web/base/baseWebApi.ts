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
import { Attachment, ElectronCookie, MediaObject, Post, WebApi, WebConfig, YamlConvertAdaptor } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useProxy } from "~/src/composables/useProxy.ts"
import { BaseExtendApi } from "~/src/adaptors/base/baseExtendApi.ts"
import { JsonUtil } from "zhi-common"

/**
 * 网页授权统一封装基类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class BaseWebApi extends WebApi {
  protected appInstance: PublisherAppInstance
  protected logger: ILogger
  protected cfg: WebConfig
  protected readonly baseExtendApi: BaseExtendApi
  public readonly proxyFetch: any

  /**
   * 初始化网页授权 API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: WebConfig) {
    super()

    this.appInstance = appInstance
    this.cfg = cfg
    this.logger = createAppLogger("base-web-api")
    this.baseExtendApi = new BaseExtendApi(this)

    const { proxyFetch } = useProxy(cfg.middlewareUrl)
    this.proxyFetch = proxyFetch
  }

  // web 适配器专有

  public updateCfg(cfg: WebConfig) {
    this.cfg = cfg
  }

  public async buildCookie(cookies: ElectronCookie[]): Promise<string> {
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";")
  }

  public getYamlAdaptor(): YamlConvertAdaptor {
    return null
  }

  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    return await this.baseExtendApi.preEditPost(post, id, publishCfg)
  }

  // 兼容的方法
  public async newPost(post: Post, publish?: boolean): Promise<string> {
    try {
      const res = await this.addPost(post)
      if (res.status !== "success") {
        throw new Error("网页授权发布文章异常")
      }
      return res.post_id
    } catch (e) {
      throw e
    }
  }

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    const bits = mediaObject.bits
    this.logger.debug("newMediaObject on baseWebApi =>", mediaObject)
    const blob = new Blob([bits], { type: mediaObject.type })
    const res = await this.uploadFile(blob as File, mediaObject.name)
    return {
      attachment_id: res?.id,
      date_created_gmt: new Date(),
      parent: 0,
      link: res?.url,
      title: mediaObject.name,
      caption: "",
      description: "",
      metadata: {
        width: 0,
        height: 0,
        file: "",
        filesize: 0,
        sizes: [],
      },
      type: mediaObject.type,
      thumbnail: "",
      id: res?.article_id,
      file: mediaObject.name,
      url: res.url,
    }
  }

  // ================
  // private methods
  // ================
  /**
   * 默认添加 Cookie 的网页授权代理
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息
   * @param params - 请求的参数
   * @param method - 请求的 HTTP 方法
   * @param contentType - 请求的内容类型
   * @returns 返回一个 Promise，解析为响应结果
   */
  public async webProxyFetch(
    url: string,
    headers: any[] = [],
    params: any = {},
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ) {
    const header = headers.length > 0 ? headers[0] : {}
    const webHeaders = [
      {
        ...header,
        Cookie: this.cfg.password,
      },
    ]
    return await this.proxyFetch(url, webHeaders, params, method, contentType)
  }

  public async webFormFetch(url: string, headers: any[], formData: FormData) {
    const win = this.appInstance.win
    const doFetch = win.require(`${this.appInstance.moduleBase}libs/zhi-formdata-fetch/index.cjs`)

    // headers
    const header = headers.length > 0 ? headers[0] : {}
    this.logger.debug("before zhi-formdata-fetch, headers =>", headers)
    this.logger.debug("before zhi-formdata-fetch, url =>", url)

    const resText = await doFetch(this.appInstance.moduleBase, url, header, formData)
    this.logger.debug("webForm doFetch success, resText =>", resText)
    const resJson = JsonUtil.safeParse<any>(resText, {} as any)
    this.logger.debug("webForm doFetch success, resJson=>", resJson)

    return resJson
  }
}

export { BaseWebApi }
