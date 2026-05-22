/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */
import {
  Attachment,
  CategoryInfo,
  ElectronCookie,
  MediaObject,
  Post,
  TagInfo,
  WebApi,
  WebConfig,
  YamlConvertAdaptor,
} from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { useProxy } from "~/src/composables/useProxy.ts"
import { BaseExtendApi } from "~/src/adaptors/base/baseExtendApi.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { Base64 } from "js-base64"
import { createFormUploadClient } from "~/src/utils/formUploadClient.ts"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"

interface WebRequestDiagnostic {
  stage: string
  transport?: string
  url?: string
  status?: number
  responseBodyPreview?: string
  errorName?: string
  errorMessage?: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

interface WebFormFetchOptions {
  diagnostic?: WebRequestDiagnostic
}

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
  private readonly isUseSiyuanProxy: boolean
  private readonly proxyFetch: any
  private readonly corsFetch: any
  private readonly formUploadClient: ReturnType<typeof createFormUploadClient>

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
    this.baseExtendApi = new BaseExtendApi(this, cfg)

    const { isUseSiyuanProxy, proxyFetch, corsFetch } = useProxy(cfg.middlewareUrl, cfg.corsAnywhereUrl)
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
        const fetchResult = await this.webFetch(reqUrl, reqHeaders, body, "POST", undefined, fp, "base64", "base64")
        return {
          status: Number(fetchResult?.status),
          body: Base64.fromBase64(fetchResult.body),
        }
      },
      middlewareFormPost: (reqUrl, reqHeaders, body) => this.corsFetch(reqUrl, reqHeaders, body, "POST"),
      buildDiagnosticPreview: (input) => this.buildDiagnosticPreview(input),
      attachDiagnosticError: (e, d) => this.attachDiagnosticError(e, d as WebRequestDiagnostic | undefined),
    })
  }

  public async checkAuth(): Promise<boolean> {
    return true
  }

  public getPostPreviewUrl(postid: string): Promise<string> {
    return this.getPreviewUrl(postid)
  }

  public async getCategories(keyword?: string): Promise<CategoryInfo[]> {
    return this.baseExtendApi.getCategories(keyword)
  }

  public async getTags(): Promise<TagInfo[]> {
    return this.baseExtendApi.getTags()
  }

  // web 适配器专有
  public updateCfg(cfg: WebConfig) {
    this.cfg = cfg
  }

  public async buildCookie(cookies: ElectronCookie[]): Promise<string> {
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";")
  }

  public async logoutWebAuth(): Promise<boolean> {
    return false
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
    this.logger.debug("newMediaObject on baseWebApi =>", mediaObject)
    const res = await this.uploadFile(mediaObject)
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

  // ===================================================================================================================
  /**
   * 默认添加 Cookie 的网页授权代理
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息
   * @param params - 请求的参数
   * @param method - 请求的 HTTP 方法
   * @param contentType - 请求的内容类型
   * @param forceProxy - 是否强制使用代理
   * @param payloadEncoding - 请求体的编码方式，默认为 text
   * @param responseEncoding - 响应体的编码方式，默认为 text
   */
  public async webFetch(
    url: string,
    headers: any[] = [],
    params: any = {},
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" = "GET",
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
    const body = method === "GET" || method === "HEAD" ? undefined : params
    // 如果没有可用的 CORS 代理或者没有强制使用代理，使用默认的自动检测机制
    if (this.isUseSiyuanProxy || (!this.isUseSiyuanProxy && forceProxy) || !forceProxy) {
      this.logger.info("Using legency web fetch")
      // remove cors fetch header
      delete header["x-cors-headers"]
      const webHeaders = [header]
      return await this.proxyFetch(
        url,
        webHeaders,
        body,
        method,
        contentType,
        forceProxy,
        payloadEncoding,
        responseEncoding
      )
    } else {
      this.logger.info("Using cors web fetch")
      const webHeaders = [header]
      return this.corsFetch(url, webHeaders, body, method)
    }
  }

  /**
   * 默认添加 Cookie 的网页授权代理
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息
   * @param formData - 表单数据
   * @param forceProxy - 是否强制使用代理
   * */
  public async webFormFetch(
    url: string,
    headers: any[],
    formData: BodyInit,
    forceProxy: boolean = false,
    options: WebFormFetchOptions = {}
  ) {
    const json = await this.formUploadClient.postJson({
      url,
      headers,
      formData,
      forceProxy,
      diagnostic: options.diagnostic,
    })
    this.logger.debug("webFormFetch success, resJson=>", sanitizeSensitiveForLog(json))
    return json as any
  }

  protected buildDiagnosticPreview(input: any, limit = 1000): string {
    const raw = typeof input === "string" ? input : JSON.stringify(input)
    const sanitized = sanitizeSensitiveForLog(raw ?? "")
    return String(sanitized).slice(0, limit)
  }

  protected formatDiagnosticMessage(diagnostic?: WebRequestDiagnostic): string {
    if (!diagnostic) {
      return ""
    }
    return JSON.stringify(sanitizeSensitiveForLog(diagnostic), null, 2)
  }

  private attachDiagnosticError(error: any, diagnostic?: WebRequestDiagnostic) {
    if (!error || typeof error !== "object" || !diagnostic) {
      return
    }
    const errorDiagnostic = {
      ...diagnostic,
      errorName: error?.name,
      errorMessage: sanitizeSensitiveForLog(error?.message || error?.toString?.() || ""),
    }
    ;(error as any).diagnostic = errorDiagnostic
    ;(error as any).diagnosticMessage = this.formatDiagnosticMessage(errorDiagnostic)
  }

  // ================
  // private methods
  // ================
}

export { BaseWebApi }
export type { WebFormFetchOptions, WebRequestDiagnostic }
