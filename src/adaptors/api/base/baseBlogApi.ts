/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogApi, BlogConfig, CategoryInfo, Post, TagInfo, YamlConvertAdaptor } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useProxy } from "~/src/composables/useProxy.ts"
import { BaseExtendApi } from "~/src/adaptors/base/baseExtendApi.ts"
import { JsonUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { Base64 } from "js-base64"
import { createFormUploadClient } from "~/src/utils/formUploadClient.ts"
import { createJsonFetchClient } from "~/src/utils/jsonFetchClient.ts"

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
  private readonly isUseSiyuanProxy: boolean
  private readonly proxyFetch: any
  private readonly corsFetch: any
  private readonly formUploadClient: ReturnType<typeof createFormUploadClient>
  private readonly jsonFetchClient: ReturnType<typeof createJsonFetchClient>

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

    const { isUseSiyuanProxy, proxyFetch, corsFetch } = useProxy(cfg.middlewareUrl, cfg.corsAnywhereUrl, cfg.isCorsProxy)
    this.isUseSiyuanProxy = isUseSiyuanProxy
    this.proxyFetch = proxyFetch
    this.corsFetch = corsFetch
    const { isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()
    this.formUploadClient = createFormUploadClient({
      appInstance: this.appInstance,
      logger: this.logger,
      isUseSiyuanProxy: this.isUseSiyuanProxy,
      isInSiyuanOrSiyuanNewWin,
      forwardProxyFormPost: async (reqUrl, reqHeaders, body, fp) => {
        const fetchResult = await this.proxyFetch(
          reqUrl,
          reqHeaders,
          body,
          "POST",
          undefined,
          fp,
          "base64",
          "base64"
        )
        return { body: Base64.fromBase64(fetchResult.body) }
      },
      middlewareFormPost: (reqUrl, reqHeaders, body) => this.corsFetch(reqUrl, reqHeaders, body, "POST"),
      isCorsProxy: cfg.isCorsProxy,
    })
    this.jsonFetchClient = createJsonFetchClient({
      appInstance: this.appInstance,
      isUseSiyuanProxy: this.isUseSiyuanProxy,
      isInSiyuanOrSiyuanNewWin,
      siyuanForwardProxyFetch: (reqUrl, reqHeaders, params, method, contentType, fp, pe, re) =>
        this.proxyFetch(reqUrl, reqHeaders, params, method, contentType, fp, pe, re),
      middlewareFetch: (reqUrl, reqHeaders, params, method) =>
        this.corsFetch(reqUrl, reqHeaders, params, method),
      isCorsProxy: cfg.isCorsProxy,
    })
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
   * @param payloadEncoding - 请求体的编码方式，默认为 text
   * @param responseEncoding - 响应体的编码方式，默认为 text
   */
  public async apiFetch(
    url: string,
    headers: any[] = [],
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json",
    forceProxy: boolean = false,
    payloadEncoding:
      | "text"
      | "base64"
      | "base64-std"
      | "base64-url"
      | "base32"
      | "base32-std"
      | "base32-hex"
      | "hex" = "text",
    responseEncoding:
      | "text"
      | "base64"
      | "base64-std"
      | "base64-url"
      | "base32"
      | "base32-std"
      | "base32-hex"
      | "hex" = "text"
  ) {
    const header = headers.length > 0 ? headers[0] : {}
    delete header["x-cors-headers"]
    return await this.jsonFetchClient.fetch({
      url,
      headers: [{ ...header }],
      params,
      method,
      contentType,
      forceProxy,
      payloadEncoding,
      responseEncoding,
    })
  }

  /**
   * API 表单请求
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息，默认为空数组
   * @param formData - 表单数据
   * @param forceProxy - 是否强制使用代理，默认为 false
   */
  public async apiFormFetch(url: string, headers: any[], formData: BodyInit, forceProxy: boolean = false) {
    const json = await this.formUploadClient.postJson({ url, headers, formData, forceProxy })
    this.logger.debug("apiFormFetch success, resJson=>", json)
    return json as any
  }

  // ================
  // private methods
  // ================
}
