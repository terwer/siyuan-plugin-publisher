import { createAppLogger } from "@utils/appLogger.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { useSiyuanSettingStore } from "@stores/useSiyuanSettingStore.ts"

/**
 * 使用 siyuan-note 代理 fetch 请求
 *
 * @author terwer
 * @version 2.0.0
 * @since 0.0.1
 */
export const useProxyFetch = () => {
  const logger = createAppLogger("use-proxy-fetch")
  const { readonlySiyuanCfg } = useSiyuanSettingStore()
  const kernelApi = new SiyuanKernelApi(readonlySiyuanCfg as SiyuanConfig)

  // MDN 标准 fetch 结构
  const proxyFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      // 将 input 转换为 URL 字符串
      const url = input instanceof URL ? input.toString() : input.toString()

      // 处理 headers
      const headers = new Headers(init?.headers)
      const contentType = headers.get("content-type") || "application/json"

      // 处理 body
      let payload: any
      if (init?.body) {
        if (typeof init.body === "string") {
          payload = init.body
        } else if (init.body instanceof FormData) {
          payload = init.body
          headers.set("content-type", "multipart/form-data")
        } else if (init.body instanceof URLSearchParams) {
          payload = init.body.toString()
          headers.set("content-type", "application/x-www-form-urlencoded")
        } else if (init.body instanceof Blob) {
          payload = await init.body.arrayBuffer()
        } else if (init.body instanceof ArrayBuffer) {
          payload = init.body
        } else {
          payload = JSON.stringify(init.body)
        }
      }

      // 构建 siyuanProxyFetch 的 options
      let siyuanResponseEncoding = "text"
      // 图片、视频要使用 base64，用 content-type 判断
      if (contentType.includes("image/") || contentType.includes("video/")) {
        siyuanResponseEncoding = "base64"
      }
      const options: Parameters<typeof siyuanProxyFetch>[1] = {
        headers: Array.from(headers.entries()).map(([key, value]) => ({ [key]: value })),
        params: payload,
        method: (init?.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH") ?? "GET",
        contentType,
        payloadEncoding: "base64",
        responseEncoding: siyuanResponseEncoding as any,
      }

      // 调用 siyuanProxyFetch
      const rawResponse = await siyuanProxyFetch(url, options)

      // 构建标准 Response 对象
      const responseHeaders = new Headers()
      if (rawResponse?.headers) {
        Object.entries(rawResponse.headers).forEach(([key, value]) => {
          if (value) {
            responseHeaders.append(key, value as string)
          }
        })
      }

      // 处理响应体
      let responseBody: BodyInit
      if (rawResponse?.body) {
        if (typeof rawResponse.body === "string") {
          responseBody = rawResponse.body
        } else if (rawResponse.body instanceof ArrayBuffer) {
          responseBody = rawResponse.body
        } else {
          responseBody = JSON.stringify(rawResponse.body)
        }
      } else {
        responseBody = ""
      }
      logger.debug("proxy fetch final body =>", { body: responseBody })

      return new Response(responseBody, {
        status: rawResponse?.statusCode || 200,
        statusText: rawResponse?.statusText || "OK",
        headers: responseHeaders,
      })
    } catch (error) {
      logger.error("Proxy fetch error:", error)
      throw error
    }
  }

  /**
   * 使用 siyuan-note 代理 fetch 请求
   *
   * @param url - 请求的 URL
   * @param options - 请求配置项
   * @param options.headers - 请求的头部信息
   * @param options.params - 请求的参数
   * @param options.method - 请求的 HTTP 方法，默认 GET
   * @param options.contentType - 请求的内容类型，默认 application/json
   * @param options.payloadEncoding - 请求体的编码方式，默认 text
   * @param options.responseEncoding - 响应体的编码方式，默认 text
   */
  const siyuanProxyFetch = async (
    url: string,
    options?: {
      headers?: any[]
      params?: any
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
      contentType?: string
      payloadEncoding?: "text" | "base64" | "base64-std" | "base64-url" | "base32" | "base32-std" | "base32-hex" | "hex"
      responseEncoding?:
        | "text"
        | "base64"
        | "base64-std"
        | "base64-url"
        | "base32"
        | "base32-std"
        | "base32-hex"
        | "hex"
    },
  ): Promise<any> => {
    // 解构参数并设置默认值
    const {
      headers = [],
      params,
      method = "GET",
      contentType = "application/json",
      payloadEncoding = "text",
      responseEncoding = "text",
    } = options || {}

    const body = params
    const reqUrl = url
    const reqHeaders = headers

    // contentType
    let proxyContentType = contentType

    // payload
    let payload: any
    let payloadBuf = new ArrayBuffer(0)
    // GET or HEAD cannot have request body
    if (method !== "GET") {
      const myRequest = new Request("", { method: method, body: body })
      logger.debug("generate temp myRequest =>", myRequest)
      payloadBuf = await myRequest.arrayBuffer()

      // contentType 需要自动设置
      const myContentType = myRequest.headers.get("Content-Type") ?? contentType
      if (myContentType.includes("multipart/form-data")) {
        proxyContentType = myRequest.headers.get("Content-Type") ?? contentType
      }
    }
    // encode
    if (payloadEncoding === "text") {
      const buffer = Buffer.from(payloadBuf)
      payload = buffer.toString("utf8")
    } else if (payloadEncoding === "base64") {
      const buffer = Buffer.from(payloadBuf)
      payload = buffer.toString("base64")
    } else if (payloadEncoding === "hex") {
      const buffer = Buffer.from(payloadBuf)
      payload = buffer.toString("hex")
    } else {
      payload = payloadBuf
    }

    const proxyHeaders = reqHeaders
    logger.debug("siyuan forwardProxy url =>", reqUrl)
    logger.debug("siyuan forwardProxy fetchOptions =>", {
      headers,
      payload,
      method,
      contentType,
    })
    const siyuanFetchResult = await kernelApi.forwardProxy(
      reqUrl,
      proxyHeaders,
      payload,
      method,
      proxyContentType,
      payloadEncoding,
      responseEncoding,
      30000,
    )
    logger.debug("proxyFetch result =>", siyuanFetchResult)
    return siyuanFetchResult
  }

  return {
    proxyFetch,
    siyuanProxyFetch,
  }
}
