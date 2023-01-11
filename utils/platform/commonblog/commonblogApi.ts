/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import {
  isElectron,
  isInChromeExtension,
  isLocalhost,
} from "~/utils/browserUtil"
import { sendChromeMessage } from "~/utils/otherlib/ChromeUtil"
import { getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"
import { isEmptyString } from "~/utils/util"
import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"

export class CommonblogApi {
  protected logger: Logger

  constructor() {
    this.logger = LogFactory.getLogger(
      "utils/platform/commonblog/commonblogApi.ts"
    )
  }

  /**
   * 请求中转支持浏览器跨域
   * @param apiUrl 请求地址
   * @param fetchOptions 请求参数
   * @param formJson 可选，发送form请求才需要
   */
  private async fetchCORS(
    apiUrl: string,
    fetchOptions: RequestInit,
    formJson?: any[]
  ): Promise<Response> {
    const middlewareUrl = getSiyuanCfg().middlewareUrl
    const middleApiUrl = middlewareUrl + "/fetch"
    this.logger.debug("apiUrl=>", apiUrl)

    this.logger.debug("fetchOptions=>", fetchOptions)

    const originalFetchParams = {
      apiUrl,
      fetchOptions,
    }
    if (formJson != null) {
      Object.assign(originalFetchParams, {
        formJson,
      })
    }

    const data = {
      fetchParams: originalFetchParams,
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

    return await fetch(middleApiUrl, middleFetchOption)
  }

  /**
   * 请求中转支持Chrome插件跨域
   * @param apiUrl 请求地址
   * @param fetchOptions 请求参数
   * @param formJson 可选，发送form请求才需要
   */
  private async fetchChrome(
    apiUrl: string,
    fetchOptions: RequestInit,
    formJson?: any[]
  ): Promise<string> {
    try {
      const reqOps = {
        // 里面的值应该可以自定义，用于判断哪个请求之类的
        type: "fetchChromeJson",
        apiUrl, // 需要请求的url
        fetchCORSOptions: fetchOptions,
      }
      if (formJson != null) {
        Object.assign(reqOps, {
          formJson: JSON.stringify(formJson),
        })
      }
      this.logger.debug("fetchChrome reqOps=>", reqOps)
      const resJson = await sendChromeMessage(reqOps)
      this.logger.debug("fetchChromeJson resJson=>", resJson)

      return resJson
    } catch (e: any) {
      throw new Error("请求异常", e)
    }
  }

  /**
   * 同时兼容浏览器和思源宿主环境的fetch API，支持浏览器跨域
   * @param apiUrl 请求地址
   * @param fetchOptions 请求参数
   * @param formJson 可选，发送form请求才需要
   */
  private async fetchCall(
    apiUrl: string,
    fetchOptions: RequestInit,
    formJson?: any[]
  ): Promise<any> {
    let result

    if (isLocalhost(apiUrl)) {
      this.logger.warn("检测到本地请求，直接fetch获取数据")
      // 不解析了，直接fetch
      result = await fetch(apiUrl, fetchOptions)
    } else if (isElectron) {
      this.logger.warn("当前处于挂件模式，使用electron的fetch获取数据")
      // 不解析了，直接使用Node兼容调用
      result = await fetch(apiUrl, fetchOptions)
    } else if (isInChromeExtension()) {
      this.logger.warn("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
      result = await this.fetchChrome(apiUrl, fetchOptions, formJson)
    } else {
      this.logger.warn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
      this.logger.warn("formJson=>", formJson)
      result = await this.fetchCORS(apiUrl, fetchOptions, formJson)
    }

    if (!result) {
      throw new Error("请求错误或者返回结果为空")
    }

    this.logger.debug("最终返回给前端的数据=>", result)

    return result
  }

  /**
   * 通用的统一调用入口
   * @param apiUrl 请求地址
   * @param fetchOptions 请求参数
   * @param formJson 可选，发送form请求才需要
   */
  private async fetchEntry(
    apiUrl: string,
    fetchOptions: RequestInit,
    formJson?: any[]
  ): Promise<Response | string> {
    const result = await this.fetchCall(apiUrl, fetchOptions, formJson)
    this.logger.debug("请求结果，result=>", result)
    return result
  }

  /**
   * 解析CORS返回数据
   * @param corsjson cors数据
   * @protected
   */
  private parseCORSBody(corsjson: any): any {
    return corsjson.body
  }

  /**
   * fetch的兼容处理，统一返回最终的JSON数据
   * @param apiUrl 请求地址
   * @param fetchOptions 请求参数
   * @param formJson 可选，发送form请求才需要
   * @protected
   */
  protected async doFetch(
    apiUrl: string,
    fetchOptions: RequestInit,
    formJson?: any[]
  ): Promise<any> {
    // const response = await fetch(apiUrl, fetchOps)
    const response: any = await this.fetchEntry(apiUrl, fetchOptions, formJson)
    if (!response) {
      throw new Error("请求异常")
    }

    let resJson

    const isTest = process.env.TEST === "true"
    if (
      isTest ||
      (typeof response !== "undefined" && response instanceof Response)
    ) {
      // 解析响应体并返回响应结果
      const statusCode = response.status

      if (statusCode !== 200) {
        if (statusCode === 401) {
          throw new Error("因权限不足操作已被禁止")
        } else if (statusCode > 401) {
          if (statusCode === 413) {
            throw new Error("请求内容过多，请删减文章正文之后再试")
          }

          let msg = response.statusText
          if (isEmptyString(msg)) {
            msg = "网络超时或者服务器错误，请稍后再试。"
          } else {
            msg = "错误信息：" + msg
          }
          throw new Error(msg)
        } else {
          throw new Error("fetch请求错误")
        }
      }

      if (isLocalhost(apiUrl)) {
        resJson = await response.json()
      } else if (isElectron) {
        resJson = await response.json()
      } else {
        const corsJson = await response.json()
        resJson = this.parseCORSBody(corsJson)
      }
    } else {
      resJson = response
    }

    return resJson
  }

  /**
   * 发送form数据的fetch的兼容处理，统一返回最终的JSON数据
   * @param apiUrl 请求地址
   * @param fetchOptions 请求参数
   * @param formJson 可选，发送form请求才需要
   * @protected
   */
  protected async doFormFetch(
    apiUrl: string,
    fetchOptions: RequestInit,
    formJson: any[]
  ): Promise<any> {
    const widgetResult = getWidgetId()
    if (widgetResult.isInSiyuan) {
      // 将formJson转换为formData
      const form = new URLSearchParams()
      formJson.forEach((item) => {
        form.append(item.key, item.value)
      })
      fetchOptions.body = form
      return await this.doFetch(apiUrl, fetchOptions)
    }
    if (isInChromeExtension()) {
      return await this.doFetch(apiUrl, fetchOptions, formJson)
    } else {
      return await this.doFetch(apiUrl, fetchOptions, formJson)
    }
  }
}
