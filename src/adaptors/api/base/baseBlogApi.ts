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
import { BlogApi, BlogConfig } from "zhi-blog-api"
import { SiyuanKernelApi } from "zhi-siyuan-api"
import { CommonFetchClient } from "zhi-fetch-middleware"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { JsonUtil } from "zhi-common"

/**
 * API授权统一封装基类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export class BaseBlogApi extends BlogApi {
  protected logger
  protected cfg: BlogConfig
  private readonly kernelApi: SiyuanKernelApi
  private readonly commonFetchClient: CommonFetchClient
  private isInChromeExtension
  private isInSiyuanWidget
  private isStorageViaSiyuanApi

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
    const { kernelApi, isStorageViaSiyuanApi } = useSiyuanApi()
    const { isInChromeExtension, isInSiyuanWidget } = useSiyuanDevice()
    this.kernelApi = kernelApi
    this.commonFetchClient = new CommonFetchClient(appInstance)
    this.isInChromeExtension = isInChromeExtension()
    this.isInSiyuanWidget = isInSiyuanWidget()
    this.isStorageViaSiyuanApi = isStorageViaSiyuanApi()
  }

  // ================
  // private methods
  // ================
  /**
   * 网页授权通用的请求代理
   *
   * @param url - url
   * @param headers - headers
   * @param params - 参数
   * @param method - method
   @param contentType -
   * @param contentType - 
   */
  protected async proxyFetch(
    url: string,
    headers: any[],
    params: any = {},
    method: "GET" | "POST" = "GET",
    contentType: string = "application/json"
  ): Promise<any> {
    if (this.isInChromeExtension) {
      this.logger.info("using chrome background")
      const fetchOptions = {
        method: method,
        headers: headers,
        body: params,
      }
      this.logger.info("commonFetchClient from proxyFetch url =>", url)
      this.logger.info("commonFetchClient from proxyFetch fetchOptions =>", fetchOptions)
      const res = await this.commonFetchClient.fetchCall(url, fetchOptions)
      this.logger.debug("commonFetchClient res from proxyFetch =>", res)
      return res
    } else if (this.isInSiyuanWidget) {
      this.logger.info("using siyuan electron api")
      const apiUrl = `${this.cfg.apiUrl}${url}`
      let header = {}
      if (headers.length > 0) {
        header = headers[0]
      }
      const fetchOptions = {
        method: method,
        headers: header,
        body: params,
      }
      this.logger.info("commonFetchClient from electron url =>", apiUrl)
      this.logger.info("commonFetchClient from electron fetchOptions =>", fetchOptions)
      const res = await this.commonFetchClient.fetchCall(apiUrl, fetchOptions)
      this.logger.debug("commonFetchClient res from electron =>", res)
      return res
    } else if (this.isStorageViaSiyuanApi) {
      this.logger.info("using siyuan forwardProxy")
      const apiUrl = `${this.cfg.apiUrl}${url}`
      this.logger.info("commonFetchClient from forwardProxy url =>", apiUrl)
      this.logger.info("commonFetchClient from forwardProxy fetchOptions =>", {
        headers,
        params,
        method,
        contentType,
      })
      const fetchResult = await this.kernelApi.forwardProxy(apiUrl, headers, params, method, contentType, 7000)
      this.logger.debug("proxyFetch result=>", fetchResult)
      const resText = fetchResult?.body
      const res = JsonUtil.safeParse<any>(resText, {} as any)
      return res
    } else {
      this.logger.info("using middleware proxy")
      const fetchOptions = {
        method: method,
        headers: headers,
        body: params,
      }
      this.logger.info("commonFetchClient from proxyFetch url =>", url)
      this.logger.info("commonFetchClient from proxyFetch fetchOptions =>", fetchOptions)
      const res = await this.commonFetchClient.fetchCall(url, fetchOptions, this.cfg.middlewareUrl)
      this.logger.debug("commonFetchClient res from proxyFetch =>", res)
      return res
    }
  }
}
