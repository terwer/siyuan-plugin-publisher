/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
