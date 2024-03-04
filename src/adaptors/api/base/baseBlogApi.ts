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

import { BlogApi, BlogConfig, CategoryInfo, Post, TagInfo, YamlConvertAdaptor } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useProxy } from "~/src/composables/useProxy.ts"
import { BaseExtendApi } from "~/src/adaptors/base/baseExtendApi.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"

/**
 * API授权统一封装基类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export class BaseBlogApi extends BlogApi {
  protected appInstance: PublisherAppInstance
  protected logger: ILogger
  protected cfg: BlogConfig
  protected readonly baseExtendApi: BaseExtendApi
  private readonly proxyFetch: any
  private readonly corsFetch: any

  /**
   * 初始化API授权适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: BlogConfig) {
    super()

    this.appInstance = appInstance
    this.cfg = cfg
    this.logger = createAppLogger("base-blog-api")
    this.baseExtendApi = new BaseExtendApi(this, cfg)

    const { proxyFetch, corsFetch } = useProxy(cfg.middlewareUrl, cfg.corsAnywhereUrl)
    this.proxyFetch = proxyFetch
    this.corsFetch = corsFetch
  }

  public async checkAuth(): Promise<boolean> {
    return true
  }

  public getYamlAdaptor(): YamlConvertAdaptor {
    return null
  }

  public getPostPreviewUrl(postid: string): Promise<string> {
    return this.getPreviewUrl(postid)
  }

  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    return await this.baseExtendApi.preEditPost(post, id, publishCfg)
  }

  public async getCategories(keyword?: string): Promise<CategoryInfo[]> {
    return this.baseExtendApi.getCategories(keyword)
  }

  public async getTags(): Promise<TagInfo[]> {
    return this.baseExtendApi.getTags()
  }

  // ===================================================================================================================
  /**
   * API 代理请求
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息，默认为空数组
   * @param params - 请求的参数，默认为 undefined
   * @param method - 请求的 HTTP 方法，默认为 GET
   * @param contentType - 请求的内容类型，默认为 application/json
   * @param forceProxy - 是否强制使用代理，默认为 false
   */
  public async apiProxyFetch(
    url: string,
    headers: any[] = [],
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json",
    forceProxy: boolean = false
  ) {
    const isCorsProxyAvailable = !StrUtil.isEmptyString(this.cfg.corsAnywhereUrl)
    // 如果没有可用的 CORS 代理或者没有强制使用代理，使用默认的自动检测机制
    if (!isCorsProxyAvailable || !forceProxy) {
      this.logger.info("Using legency api fetch")
      //  const proxyFetch = async (
      //     url: string,
      //     headers: any[] = [],
      //     params: any = {},
      //     method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
      //     contentType: string = "application/json",
      //     forceProxy: boolean = false
      //   ) => {
      this.logger.info("Using legency api fetch")
      return this.proxyFetch(url, headers, params, method, contentType, forceProxy)
    } else {
      //   const corsFetch = async (
      //     url: string,
      //     headers: any[] = [],
      //     params: BodyInit = undefined,
      //     method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
      //   )
      this.logger.info("Using cors api fetch")
      return this.corsFetch(url, headers, params, method)
    }
  }

  /**
   * API 表单请求
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息，默认为空数组
   * @param formData - 表单数据
   * @param forceProxy - 是否强制使用代理，默认为 false
   */
  public async apiFormFetch(url: string, headers: any[], formData: FormData, forceProxy: boolean = false) {
    const isCorsProxyAvailable = !StrUtil.isEmptyString(this.cfg.corsAnywhereUrl)
    // 如果没有可用的 CORS 代理或者没有强制使用代理，使用默认的自动检测机制
    if (!isCorsProxyAvailable || !forceProxy) {
      this.logger.info("Using legency api formFetch")
      const { isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()
      if (!isInSiyuanOrSiyuanNewWin()) {
        throw new Error(
          "检测到当前为非 electron 环境并且未设置 cors 代理，此功能将不可用！请设置 cors 代理或者使用PC 客户端"
        )
      }
      const win = this.appInstance.win
      const doFetch = win.require(`${this.appInstance.moduleBase}libs/zhi-formdata-fetch/index.cjs`)

      // headers
      const header = headers.length > 0 ? headers[0] : {}
      this.logger.debug("before zhi-formdata-fetch, headers =>", headers)
      this.logger.debug("before zhi-formdata-fetch, url =>", url)

      const resText = await doFetch(this.appInstance.moduleBase, url, header, formData)
      this.logger.debug("apiForm doFetch success, resText =>", resText)
      const resJson = JsonUtil.safeParse<any>(resText, {} as any)
      this.logger.debug("apiForm doFetch success, resJson=>", resJson)

      return resJson
    } else {
      this.logger.info("Using cors-anywhere api formFetch")
      return this.corsFetch(url, headers, formData, "POST")
    }
  }

  // ================
  // private methods
  // ================
}
