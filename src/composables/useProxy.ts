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

import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { CommonFetchClient } from "zhi-fetch-middleware"
import { isDev, LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Deserializer, Serializer, XmlrpcUtil } from "simple-xmlrpc"

/**
 * 用于处理代理请求的自定义 hook
 *
 * @param middlewareUrl - 可选，如果使用 CommonFetchClient 需要传递，否则可留空
 * @param corsProxyUrl - 可选，可留空
 * @author terwer
 * @version 1.7.0
 * @since 1.7.0
 */
const useProxy = (middlewareUrl?: string, corsProxyUrl?: string) => {
  const logger = createAppLogger("use-proxy")
  const { kernelApi, isUseSiyuanProxy } = useSiyuanApi()

  /**
   * 创建应用程序实例和通用的 fetch 客户端实例
   */
  const appInstance = new PublisherAppInstance()
  const apiUrl = ""
  middlewareUrl = middlewareUrl ?? LEGENCY_SHARED_PROXT_MIDDLEWARE
  corsProxyUrl = corsProxyUrl ?? ""
  const commonFetchClient = new CommonFetchClient(appInstance, apiUrl, middlewareUrl, isDev)
  const serializer = new Serializer(appInstance)

  /**
   * 执行代理 fetch 请求
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
  const proxyFetch = async (
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
  ) => {
    if (isUseSiyuanProxy || (!isUseSiyuanProxy && forceProxy)) {
      logger.info("Using Siyuan forwardProxy")
      return await siyuanProxyFetch(url, headers, params, method, contentType, payloadEncoding, responseEncoding)
    } else {
      logger.info("Using middleware proxy fetch")
      const header = headers.length > 0 ? headers[0] : {}
      const fetchOptions = {
        method: method,
        headers: {
          ...header,
          "Content-Type": contentType,
        },
        body: params,
      }
      logger.info("commonFetchClient url in proxyFetch =>", url)
      logger.info("commonFetchClient fetchOptions in proxyFetch =>", fetchOptions)
      const res = await commonFetchClient.fetchCall(url, fetchOptions, forceProxy)
      logger.debug("Result of proxyFetch in commonFetchClient =>", res)
      return res
    }
  }

  /**
   * 通过代理调用 XML-RPC 方法
   *
   * @param url - xmlrpc 端点地址
   * @param reqMethod - 请求的方法名
   * @param reqParams - 请求的参数
   * @param forceProxy - 是否强制使用代理
   */
  const proxyXmlrpc = async (url: string, reqMethod: string, reqParams: any[], forceProxy: boolean = false) => {
    const body = serializer.serializeMethodCall(reqMethod, reqParams)
    let resText: string = await proxyFetch(url, [], body, "POST", "text/xml", forceProxy, "base64")
    resText = XmlrpcUtil.removeXmlHeader(resText)
    const deserializer = new Deserializer()
    const resJson = await deserializer.deserializeMethodResponse(resText)
    logger.debug("xmlrpc fetch result, resJson =>", resJson)
    return resJson
  }

  // ===================================================================================================================

  /**
   * 向 CORS 发送表单数据
   *
   * @param url 请求地址
   * @param headers 请求头，默认为{}
   * @param params 表单数据，默认为undefined，支持 ReadableStream、Blob | BufferSource | FormData | URLSearchParams | string
   * @param method 请求方法，默认为GET
   */
  const corsFetch = async (
    url: string,
    headers: any[] = [],
    params: BodyInit = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
  ) => {
    // 如果corsProxyUrl结尾有/，则直接使用，否则在url前加上/
    const apiUrl = `${corsProxyUrl.endsWith("/") ? corsProxyUrl : corsProxyUrl + "/"}${url}`
    const header = headers.length > 0 ? headers[0] : {}

    // 处理不安全的 header
    const UNSAFE_HEADERS = ["Origin", "Referer", "Cookie"]
    const xCorsHeaderString = ObjectUtil.getProperty(header, "x-cors-headers")
    let xCorsHeaders = JsonUtil.safeParse<any>(xCorsHeaderString, {})
    for (const [key, value] of Object.entries(header)) {
      const lowercaseKey = key.toLowerCase()
      if (UNSAFE_HEADERS.map((unsafeHeaderItem) => unsafeHeaderItem.toLowerCase()).includes(lowercaseKey)) {
        logger.warn(`corsFetch header ${key} is not allowed`)
        xCorsHeaders[key] = value
        delete header[key]
      }
    }
    header["x-cors-headers"] = JSON.stringify(xCorsHeaders)

    const options: RequestInit = {
      method: method,
      headers: header,
      body: params,
    }

    logger.debug("corsFetch url =>", apiUrl)
    logger.debug("corsFetch options =>", options)

    const res = await fetch(apiUrl, options)

    // 处理返回 header
    const corsRespHeaders = {} as any
    const respHeaderObj = JsonUtil.safeParse<any>(res.headers.get("cors-received-headers"), {})
    for (const [resp_key, resp_value] of Object.entries(respHeaderObj)) {
      if (resp_key === "cors-received-headers") {
        const corsRecv = respHeaderObj["cors-received-headers"]
        for (const [cors_key, cors_value] of Object.entries(corsRecv)) {
          corsRespHeaders[cors_key] = cors_value
        }
        delete respHeaderObj[resp_key]
      } else {
        corsRespHeaders[resp_key] = resp_value
      }
    }
    logger.debug("corsFetch corsRespHeaders =>", corsRespHeaders)

    const resText = await res.text()
    logger.debug("corsFetch resText =>", resText)

    const resJson = JsonUtil.safeParse<any>(resText, {})
    resJson["cors-received-headers"] = JSON.stringify(corsRespHeaders)
    logger.debug("corsFetch resJson =>", resJson)

    return resJson
  }

  // ===================================================================================================================

  /**
   * 执行代理 siyuan-note fetch 请求
   *
   * @param url - 请求的 URL
   * @param headers - 请求的头部信息
   * @param params - 请求的参数
   * @param method - 请求的 HTTP 方法
   * @param contentType - 请求的内容类型
   * @param payloadEncoding - 请求体的编码方式，默认为 text
   * @param responseEncoding - 响应体的编码方式，默认为 text
   */
  const siyuanProxyFetch = async (
    url: string,
    headers: any[] = [],
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json",
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
  ) => {
    let body = params
    const reqUrl = `${apiUrl}${url}`
    const header = headers.length > 0 ? headers[0] : {}

    // contentType
    let proxyContentType = contentType

    // payload
    let payload: any
    let payloadBuf = new ArrayBuffer(0)
    // GET or HEAD cannot have request body
    if (method !== "GET") {
      const myRequest = new Request("", { method: method, body: body })
      console.log("generate temp myRequest =>", myRequest)
      payloadBuf = await myRequest.arrayBuffer()

      // contentType 需要自动设置
      const myContentType = myRequest.headers.get("Content-Type") ?? contentType
      if (myContentType.includes("multipart/form-data")) {
        proxyContentType = myRequest.headers.get("Content-Type")
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

    const proxyHeaders = [header]
    logger.debug("siyuan forwardProxy url =>", reqUrl)
    logger.debug("siyuan forwardProxy fetchOptions =>", {
      headers,
      payload,
      method,
      contentType,
    })
    const fetchResult = await kernelApi.forwardProxy(
      reqUrl,
      proxyHeaders,
      payload,
      method,
      proxyContentType,
      payloadEncoding,
      responseEncoding,
      30000
    )
    logger.debug("proxyFetch result =>", fetchResult)

    if (!(fetchResult.status >= 200 && fetchResult.status < 300)) {
      // 兼容 CSDN 错误提示
      const bodyJson = JsonUtil.safeParse<any>(fetchResult?.body, {})
      if (!StrUtil.isEmptyString(bodyJson?.msg)) {
        throw new Error(bodyJson?.msg)
      }
      throw new Error(
        StrUtil.decodeUnicodeToChinese(
          StrUtil.isEmptyString(fetchResult?.body) ? `请求异常：${fetchResult.status}` : fetchResult?.body
        )
      )
    }

    if (responseEncoding === "text") {
      if (contentType === "application/json") {
        const resText = fetchResult?.body
        const resJson = JsonUtil.safeParse<any>(resText, {} as any)
        return resJson
      } else if (contentType === "text/html") {
        const resText = fetchResult?.body
        return resText
      } else if (contentType === "text/xml") {
        const resText = fetchResult?.body
        return resText
      } else {
        logger.info("SiYuan proxy directly response fetchResult for content type:", contentType)
        return fetchResult
      }
    } else {
      return fetchResult
    }
  }

  return { isUseSiyuanProxy, proxyFetch, proxyXmlrpc, corsFetch }
}

export { useProxy }
