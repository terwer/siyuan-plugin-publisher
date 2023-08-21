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
import { isDev } from "~/src/utils/constants.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Deserializer, Serializer, XmlrpcUtil } from "simple-xmlrpc"

/**
 * 用于处理代理请求的自定义 hook
 *
 * @param middlewareUrl - 可选，如果使用 CommonFetchClient 需要传递，否则可留空
 * @author terwer
 * @version 1.7.0
 * @since 1.7.0
 */
const useProxy = (middlewareUrl?: string) => {
  const logger = createAppLogger("use-proxy")
  const { kernelApi, isUseSiyuanProxy } = useSiyuanApi()

  /**
   * 创建应用程序实例和通用的 fetch 客户端实例
   */
  const appInstance = new AppInstance()
  const apiUrl = ""
  middlewareUrl = middlewareUrl ?? "https://api.terwer.space/api/middleware"
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
   * @returns 返回一个 Promise，解析为响应结果
   */
  const proxyFetch = async (
    url: string,
    headers: any[] = [],
    params: any = {},
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ) => {
    const siyuanSupported = ["application/json", "text/html", "text/xml", "image/png"]
    if (isUseSiyuanProxy && siyuanSupported.includes(contentType)) {
      logger.info("Using Siyuan forwardProxy, contentType=>", contentType)
      let body: any
      if (typeof params === "string" && !StrUtil.isEmptyString(params)) {
        body = params
      } else if (typeof params === "object" && !ObjectUtil.isEmptyObject(params)) {
        body = params
      }
      const reqUrl = `${apiUrl}${url}`
      logger.info("siyuan forwardProxy url =>", reqUrl)
      logger.info("siyuan forwardProxy fetchOptions =>", {
        headers,
        body,
        method,
        contentType,
      })
      const fetchResult = await kernelApi.forwardProxy(reqUrl, headers, body, method, contentType, 30000)
      logger.debug("proxyFetch result =>", fetchResult)

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
        logger.error("SiYuan proxy directly response fetchResult for content type:", contentType)
        return fetchResult
      }
    } else {
      logger.info("Using middleware proxy")
      const header = headers.length > 0 ? headers[0] : {}
      const fetchOptions = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...header,
        },
      }
      logger.info("commonFetchClient url in proxyFetch =>", url)
      logger.info("commonFetchClient fetchOptions in proxyFetch =>", fetchOptions)
      const res = await commonFetchClient.fetchCall(url, fetchOptions)
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
   */
  const proxyXmlrpc = async (url: string, reqMethod: string, reqParams: any[]) => {
    const body = serializer.serializeMethodCall(reqMethod, reqParams)
    const res = await proxyFetch(url, [], body, "POST", "text/xml")
    let resText = res
    resText = XmlrpcUtil.removeXmlHeader(resText)
    const deserializer = new Deserializer()
    const resJson = await deserializer.deserializeMethodResponse(resText)
    logger.debug("xmlrpc fetch result, resJson =>", resJson)
    return resJson
  }

  return { proxyFetch, proxyXmlrpc }
}

export { useProxy }
