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
import { ElectronCookie, WebApi, WebConfig } from "zhi-blog-api"
import { SiyuanKernelApi } from "zhi-siyuan-api"
import { CommonFetchClient } from "zhi-fetch-middleware"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { JsonUtil } from "zhi-common"
import {isDev} from "~/src/utils/constants.ts";

/**
 * 网页授权统一封装基类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class BaseWebApi extends WebApi {
  protected logger
  protected cfg: WebConfig
  private readonly kernelApi: SiyuanKernelApi
  private readonly commonFetchClient: CommonFetchClient
  private isInSiyuanWidget
  private isInChromeExtension

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
    const { kernelApi } = useSiyuanApi()
    const { isInSiyuanWidget, isInChromeExtension } = useSiyuanDevice()
    this.kernelApi = kernelApi
    this.commonFetchClient = new CommonFetchClient(appInstance, cfg.apiUrl, cfg.middlewareUrl, isDev)
    this.isInSiyuanWidget = isInSiyuanWidget()
    this.isInChromeExtension = isInChromeExtension()
  }

  public updateCfg(cfg: WebConfig) {
    this.cfg = cfg
  }

  public async buildCookie(cookies: ElectronCookie[]): Promise<string> {
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";")
  }

  // ================
  // private methods
  // ================
  /**
   * 网页授权通用的请求代理
   *
   * @param url - url
   * @param params - 参数
   */
  protected async proxyFetch(url: string, params: any = {}): Promise<any> {
    if (this.isInSiyuanWidget) {
      this.logger.info("using siyuan forwardProxy")
      const fetchResult = await this.kernelApi.forwardProxy(
        url,
        [
          {
            Cookie: this.cfg.password,
          },
        ],
        params,
        "GET",
        "application/json",
        7000
      )
      this.logger.debug("proxyFetch result=>", fetchResult)
      const resText = fetchResult?.body
      const res = JsonUtil.safeParse<any>(resText, {} as any)
      return res
    } else if (this.isInChromeExtension) {
      this.logger.info("using chrome background")
      const fetchOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: this.cfg.password,
        },
      }
      this.logger.info("commonFetchClient from proxyFetch url =>", url)
      this.logger.info("commonFetchClient from proxyFetch fetchOptions =>", fetchOptions)
      const res = await this.commonFetchClient.fetchCall(url, fetchOptions)
      this.logger.debug("commonFetchClient res from proxyFetch =>", res)
      return res
    } else {
      this.logger.info("using middleware proxy")
      const fetchOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: this.cfg.password,
        },
      }
      this.logger.info("commonFetchClient from proxyFetch url =>", url)
      this.logger.info("commonFetchClient from proxyFetch fetchOptions =>", fetchOptions)
      const res = await this.commonFetchClient.fetchCall(url, fetchOptions)
      this.logger.debug("commonFetchClient res from proxyFetch =>", res)
      return res
    }
  }
}

export { BaseWebApi }
