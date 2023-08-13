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

import { BlogApi, BlogConfig, Post } from "zhi-blog-api"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useProxy } from "~/src/composables/useProxy.ts"

/**
 * API授权统一封装基类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export class BaseBlogApi extends BlogApi {
  protected logger: ILogger
  protected cfg: BlogConfig
  protected readonly proxyFetch: any

  /**
   * 初始化API授权适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: AppInstance, cfg: BlogConfig) {
    super()

    this.cfg = cfg
    this.logger = createAppLogger("base-blog-api")

    const { proxyFetch } = useProxy(cfg.middlewareUrl)
    this.proxyFetch = proxyFetch
  }

  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    this.logger.info("未处理，原样返回。如需处理，请在子类重写")
    return post
  }

  // ================
  // private methods
  // ================
  public async readFileToBlob(url: string) {
    const response = await this.proxyFetch(url, [], {}, "GET", "image/jpeg")
    const body = response.body
    const blobData = new Blob([body], { type: response.contentType })
    this.logger.debug("blobData =>", blobData)
    return blobData
  }
}
