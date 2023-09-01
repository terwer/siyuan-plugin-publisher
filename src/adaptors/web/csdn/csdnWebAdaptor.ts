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

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CommonFetchClient } from "zhi-fetch-middleware"
import { isDev } from "~/src/utils/constants.ts"

/**
 * CSDN网页授权适配器
 *
 * @see [wechatsync csdn adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/CSDN.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CsdnWebAdaptor extends BaseWebApi {
  private readonly commonFetchClient: any

  /**
   * 初始化知乎 API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: AppInstance, cfg: CsdnConfig) {
    super(appInstance, cfg)
    this.cfg = cfg

    const middlewareUrl = this.cfg.middlewareUrl ?? "https://api.terwer.space/api/middleware"
    this.commonFetchClient = new CommonFetchClient(appInstance, "", middlewareUrl, isDev)
    this.logger = createAppLogger("zhihu-web-adaptor")
  }

  public async getMetaData(): Promise<any> {
    const res = await this.csdnFetch("https://bizapi.csdn.net/blog-console-api/v1/user/info")
    const flag = !!res.data.username
    this.logger.info(`get csdn metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res.data.username,
      title: res.data.username,
      avatar: res.data.avatar,
      type: "csdn",
      displayName: "CSDN",
      supportTypes: ["markdown", "html"],
      home: "https://mp.csdn.net/",
      icon: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    }
  }

  // ================
  // private methods
  // ================
  private async csdnFetch(
    url: string,
    headers: any = {},
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType?: string | null
  ) {
    // 设置请求头
    const accept = "*/*"
    const APPLICATION_JSON = "application/json"
    const xcakey = CsdnUtils.X_CA_KEY
    const xCaNonce = CsdnUtils.generateXCaNonce()
    const xCaSignature = CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    const reqHeader = {
      accept,
      ...(contentType ? { "content-type": contentType } : {}),
      "x-ca-key": xcakey,
      "x-ca-nonce": xCaNonce,
      "x-ca-signature": xCaSignature,
      "x-ca-signature-headers": "x-ca-key,x-ca-nonce",
      ...headers,
      Cookie: this.cfg.password,
    }

    // 构建请求选项
    const requestOptions: RequestInit = {
      method: method,
      headers: reqHeader,
      body: params,
      redirect: "follow",
    }

    // 发送请求并返回响应
    const res = await this.commonFetchClient.fetchCall(url, requestOptions)
    if (res?.code !== 200) {
      throw new Error(res?.body?.message)
    }
    return res
  }
}

export { CsdnWebAdaptor }
