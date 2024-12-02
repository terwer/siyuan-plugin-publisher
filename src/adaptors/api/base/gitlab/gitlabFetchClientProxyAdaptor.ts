/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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

import { ICommonFetchClient } from "zhi-fetch-middleware"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ILogger } from "zhi-lib-base"
import { JsonUtil, StrUtil } from "zhi-common"

/**
 * 通用的 gitlab fetch 客户端代理适配器
 *
 * @remarks
 * 该适配器用于实现通用的fetch客户端代理，通过代理实现对fetch请求的拦截和重写
 *
 * @public
 */
class GitlabFetchClientProxyAdaptor implements ICommonFetchClient {
  private readonly logger: ILogger
  private readonly appInstance: PublisherAppInstance
  private readonly cfg: CommonGitlabConfig

  constructor(appInstance: PublisherAppInstance, cfg: CommonGitlabConfig) {
    this.logger = createAppLogger("gitlab-fetch-client-proxy")

    this.appInstance = appInstance
    this.cfg = cfg
  }

  public async fetchCall(url: string, fetchOptions?: RequestInit, forceProxy?: boolean): Promise<any> {
    try {
      // /api/v4/projects/terwer%2Fterwer-github-io/repository/files/docs%2F%E6%B5%8B%E8%AF%95%E6%96%87%E7%AB%A0%2F003.%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A39.md
      // {
      //   "method": ""
      //   "headers": {},
      //   "body": {}
      // }
      const apiUrl = StrUtil.pathJoin(this.cfg.apiUrl, url)
      this.logger.debug("gitlab fetch adaptor start")
      this.logger.debug("apiUrl=>", apiUrl)
      this.logger.debug("fetchOptions=>", fetchOptions)

      const resp: Response = await this.appInstance.fetch(apiUrl, fetchOptions)
      this.logger.debug("gitlab fetch adaptor end，resp=>", resp)
      if (resp.ok) {
        return this.safeParseBodyJson(resp)
      } else {
        const respText = await resp.text()
        if (resp.status === 400 && respText.includes("already exists")) {
          return {
            exist: true,
          }
        }
        throw `gitlab fetch adaptor 请求错误，code ${resp.status}, detail => ${JSON.stringify({
          statusText: resp.statusText,
          msg: respText,
        })}`
      }
    } catch (e: any) {
      this.logger.error(e)
      throw new Error("请求处理异常 => " + e.toString())
    }
  }

  //================================================================
  // private function
  //================================================================
  private async safeParseBodyJson(response: any) {
    const resText = await response.text()
    const resJson = JsonUtil.safeParse<any>(resText, {} as any)
    return resJson
  }
}

export { GitlabFetchClientProxyAdaptor }
