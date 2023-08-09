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
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { isDev } from "~/src/utils/constants.ts"

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
  private readonly kernelApi: SiyuanKernelApi
  private readonly commonFetchClient: CommonFetchClient
  private readonly useSiyuanProxy: boolean

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
    this.commonFetchClient = new CommonFetchClient(appInstance, cfg.apiUrl, cfg.middlewareUrl, isDev)

    const { kernelApi, isUseSiyuanProxy } = useSiyuanApi()
    this.kernelApi = kernelApi
    this.useSiyuanProxy = isUseSiyuanProxy()
  }

  // ================
  // private methods
  // ================
  /**
   * 网页授权通用的请求代理
   *
   * @param url - url
   * @param headers - headers，默认是[]
   * @param params - 参数，默认是 {}
   * @param method - 方法，默认是GET
   * @param contentType - 类型，默认是 application/json
   */
  protected async proxyFetch(
    url: string,
    headers: any[] = [],
    params: any = {},
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ): Promise<any> {
    let body: any
    if (typeof params === "string" && !StrUtil.isEmptyString(params)) {
      body = params
    } else if (typeof params === "object" && !ObjectUtil.isEmptyObject(params)) {
      body = params
    }

    if (this.useSiyuanProxy) {
      this.logger.info("using siyuan forwardProxy")
      const apiUrl = `${this.cfg.apiUrl}${url}`
      this.logger.info("siyuan forwardProxy url =>", apiUrl)
      this.logger.info("siyuan forwardProxy fetchOptions =>", {
        headers,
        body,
        method,
        contentType,
      })
      const fetchResult = await this.kernelApi.forwardProxy(apiUrl, headers, body, method, contentType, 7000)
      this.logger.debug("siyuan forwardProxy result=>", fetchResult)
      const resText = fetchResult?.body
      const res = JsonUtil.safeParse<any>(resText, {} as any)
      return res
    } else {
      this.logger.info("using commonFetchClient")
      const header = headers.length > 0 ? headers[0] : {}
      let fetchOptions: any = {
        method,
        headers: {
          ...header,
        },
      }
      if (body) {
        fetchOptions.body = body
      }
      this.logger.info("commonFetchClient url =>", url)
      this.logger.info("commonFetchClient fetchOptions =>", fetchOptions)
      const res = await this.commonFetchClient.fetchCall(url, fetchOptions)
      this.logger.debug("commonFetchClient res =>", res)
      return res
    }
  }
}
