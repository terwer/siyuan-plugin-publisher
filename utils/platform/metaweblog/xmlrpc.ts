/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

import { getEnvOrDefault } from "~/utils/envUtil"
import { LogFactory } from "~/utils/logUtil"
import { Logger } from "loglevel"
import { fetchCustom } from "~/utils/platform/metaweblog/customXmlrpc"
import { getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"
import { fetchNode } from "~/utils/platform/metaweblog/nodeXmlrpc"
import { isInChromeExtension } from "~/utils/otherlib/ChromeUtil"

/**
 * Xmlrpc客户端封装类
 */
export class XmlrpcClient {
  private readonly logger: Logger
  private readonly apiType: string
  private readonly apiUrl: string
  private readonly username: string
  private readonly password: string

  constructor(
    apiType: string,
    apiUrl: string,
    username: string,
    password: string
  ) {
    this.logger = LogFactory.getLogger("utils/platform/metaweblog/xmlrpc.ts")
    this.apiType = apiType
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
  }

  /**
   * 请求中转支持浏览器跨域
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数
   */
  private async fetchCORS(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ): Promise<string> {
    const middlewareUrl = getEnvOrDefault(
      "VITE_MIDDLEWARE_URL",
      "/api/middleware"
    )
    const middleApiUrl = middlewareUrl + "/xmlrpc"
    this.logger.debug("apiUrl=>", apiUrl)
    const fetchCORSParams = {
      reqMethod,
      reqParams,
    }
    this.logger.debug("fetchCORSParams=>", fetchCORSParams)

    const data = {
      fetchParams: {
        apiUrl,
        fetchCORSParams,
      },
    }

    const middleFetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    this.logger.debug("middleApiUrl=>", middleApiUrl)
    this.logger.debug("middleFetchOption=>", middleFetchOption)

    const response: Response = await fetch(middleApiUrl, middleFetchOption)
    return await response.text()
  }

  /**
   * 兼容Chrome插件的xmlrpc API
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数
   */
  private async fetchChromeCORS(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ): Promise<string> {
    this.logger.debug("fetchChrome apiUrl=>", apiUrl)

    const fetchCORSParams = {
      reqMethod,
      reqParams,
    }
    this.logger.debug("fetchChrome fetchCORSParams=>", fetchCORSParams)

    const result = await fetchCustom(apiUrl, reqMethod, reqParams)
    if (!result || result === "") {
      throw new Error("请求错误或者返回结果为空")
    }
    this.logger.debug("fetchCustom result=>", result)

    // const resText = await chrome.runtime.sendMessage({
    //     // 里面的值应该可以自定义，用于判断哪个请求之类的
    //     type: 'fetchChromeXmlrpc',
    //     apiUrl: apiUrl, // 需要请求的url
    //     fetchCORSParams: fetchCORSParams
    // });
    return result
  }

  /**
   * 同时兼容浏览器和思源宿主环境的xmlrpc API
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数数组
   */
  private async fetchXmlrpc(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ): Promise<string> {
    let result

    const widgetResult = getWidgetId()
    if (widgetResult.isInSiyuan) {
      this.logger.info("当前处于挂件模式，使用electron的fetch获取数据")
      // 不解析了，直接使用Node兼容调用
      // result = await fetchElectron(apiUrl, reqMethod, reqParams)
      result = await fetchNode(apiUrl, reqMethod, reqParams)
    } else if (isInChromeExtension()) {
      this.logger.info("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
      result = await this.fetchChromeCORS(apiUrl, reqMethod, reqParams)
    } else {
      this.logger.info("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
      result = await this.fetchCORS(apiUrl, reqMethod, reqParams)
    }

    if (result === "") {
      throw new Error("请求错误或者返回结果为空")
    }

    this.logger.debug("最终返回给前端的数据=>", result)

    return result
  }

  /**
   * xmlrpc统一调用入口
   * @param reqMethod 方法
   * @param reqParams 参数
   */
  public async methodCallEntry(
    reqMethod: string,
    reqParams: any[]
  ): Promise<string> {
    const result = await this.fetchXmlrpc(this.apiUrl, reqMethod, reqParams)
    this.logger.debug("请求结果，result=>", result)
    return result
  }
}

/**
 * Xmlrpc服务器封装类
 */
// export class XmlrpcServer {
//
// }
