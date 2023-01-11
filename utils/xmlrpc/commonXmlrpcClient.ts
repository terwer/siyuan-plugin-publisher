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

import { LogFactory } from "~/utils/logUtil"
import { Logger } from "loglevel"
import { isElectron, isInChromeExtension } from "~/utils/browserUtil"
import { fetchNode } from "~/utils/xmlrpc/impl/nodeXmlrpc"
import { fetchChrome } from "~/utils/xmlrpc/impl/chromeXmlrpc"
import { fetchMiddleware } from "~/utils/xmlrpc/impl/middlewareXmlrpc"
import { XmlRpcValue } from "simple-xmlrpc"

/**
 * Xmlrpc客户端封装类
 */
export class CommonXmlrpcClient {
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
   * 同时兼容浏览器和思源宿主环境的xmlrpc API
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数数组
   */
  private async fetchXmlrpc(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ): Promise<XmlRpcValue> {
    let result

    if (isElectron) {
      this.logger.info("当前处于挂件模式，使用electron的fetch获取数据")
      // 不解析了，直接使用Node兼容调用
      result = await fetchNode(apiUrl, reqMethod, reqParams)
    } else if (isInChromeExtension()) {
      this.logger.info("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
      result = await fetchChrome(apiUrl, reqMethod, reqParams)
    } else {
      this.logger.info("当前处于服务器伺服模式，已开启请求代理解决CORS跨域问题")
      result = await fetchMiddleware(apiUrl, reqMethod, reqParams)
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
  public async methodCall(reqMethod: string, reqParams: any[]): Promise<any> {
    const result = await this.fetchXmlrpc(this.apiUrl, reqMethod, reqParams)
    this.logger.debug("请求结果，result=>", result)
    return result
  }
}
