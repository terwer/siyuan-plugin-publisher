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
import { Attachment, ElectronCookie, MediaObject, Post, WebApi, WebConfig } from "zhi-blog-api"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useProxy } from "~/src/composables/useProxy.ts"

/**
 * 网页授权统一封装基类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class BaseWebApi extends WebApi {
  protected logger: ILogger
  protected cfg: WebConfig
  protected readonly proxyFetch: any

  /**
   * 初始化网页授权 API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: AppInstance, cfg: WebConfig) {
    super()

    this.cfg = cfg
    this.logger = createAppLogger("base-web-api")

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

  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    this.logger.info("未处理，原样返回。如需处理，请在子类重写")
    return post
  }

  // 兼容的方法
  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const res = await this.addPost(post)
    if (res.status !== "success") {
      throw new Error("网页授权发布文章异常")
    }
    return res.post_id
  }

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    const bits = mediaObject.bits
    const blob = new Blob([bits], { type: mediaObject.type })
    const res = await this.uploadFile(blob as File)
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
}

export { BaseWebApi }
