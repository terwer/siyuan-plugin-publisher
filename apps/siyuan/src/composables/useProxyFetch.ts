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
  ): Promise<Response> => {
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

    if (!(siyuanFetchResult.status >= 200 && siyuanFetchResult.status < 300)) {
      // 兼容 CSDN 错误提示
      const bodyJson = JsonUtil.safeParse<any>(siyuanFetchResult?.body, {})
      if (!StrUtil.isEmptyString(bodyJson?.msg)) {
        throw new Error(bodyJson?.msg)
      }
      throw new Error(
        StrUtil.decodeUnicodeToChinese(
          StrUtil.isEmptyString(siyuanFetchResult?.body)
            ? `Request error：${siyuanFetchResult.status}`
            : siyuanFetchResult?.body,
        ),
      )
    }

    if (responseEncoding === "text") {
      if (contentType === "application/json") {
        const resText = siyuanFetchResult?.body
        const resJson = JsonUtil.safeParse<any>(resText, {} as any)
        logger.info("SiYuan proxy response json for content type:", contentType)
        return new Response(JSON.stringify(resJson), {
          headers: {
            ...siyuanFetchResult.headers,
            "Content-Type": "application/json",
          },
          status: siyuanFetchResult.status,
          statusText: siyuanFetchResult.statusText,
        })
      } else if (contentType === "text/html" || contentType === "text/xml") {
        const resText = siyuanFetchResult?.body
        logger.info("SiYuan proxy response text for content type:", contentType)
        return new Response(resText, {
          headers: {
            ...siyuanFetchResult.headers,
            "Content-Type": contentType,
          },
          status: siyuanFetchResult.status,
          statusText: siyuanFetchResult.statusText,
        })
      } else {
        logger.info("SiYuan proxy directly response for content type:", contentType)
        return siyuanFetchResult
      }
    } else {
      return siyuanFetchResult
    }
  }

  return {
    proxyFetch: siyuanProxyFetch,
  }
}
