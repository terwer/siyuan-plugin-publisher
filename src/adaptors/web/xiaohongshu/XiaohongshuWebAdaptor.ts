/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { StrUtil } from "zhi-common"
import { MockBrowser } from "~/src/utils/MockBrowser.ts"

/**
 * 小红书适配器
 *
 * @author terwer
 * @since 1.32.0
 */
class XiaohongshuWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    // "/api/galaxy/user/info"
    // "/api/galaxy/user/my-info"
    const header = {
      "User-Agent": MockBrowser.HEADERS.MACOS_CHROME["User-Agent"],
      referer: "https://creator.xiaohongshu.com/publish/publish?from=menu",
    }
    const res = await this.xiaohongshuFetch("/api/galaxy/user/my-info", header)
    // const flag = !!res?.data?.user_id
    this.logger.debug("get xiaohongshu metadata finished=>", res)
    throw new Error("开发中。。。")
  }

  // ================
  // private methods
  // ================

  private async xiaohongshuFetch(
    url: string,
    headers: any = {},
    params: any = undefined,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    contentType: string = "application/json"
  ) {
    const apiUrl = StrUtil.pathJoin(this.cfg.apiUrl, url)
    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...headers,
    }

    const body = params

    // 构建请求选项
    const requestOptions: RequestInit = {
      method: method,
      headers: mergedHeaders,
      body: params,
    }

    // 发送请求并返回响应
    this.logger.debug("xiaohongshu url =>", apiUrl)
    this.logger.debug("xiaohongshu requestOptions =>", requestOptions)
    const res = await this.webFetch(apiUrl, [mergedHeaders], body, method, contentType, true, "base64", "text")
    return res
  }

  private async xiaohongshuFormFetch(url: string, formData: BodyInit) {
    const apiUrl = StrUtil.pathJoin(this.cfg.apiUrl, url)
    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    // header
    const mergedHeaders = {
      Cookie: this.cfg.password,
    }

    const options: RequestInit = {
      method: "POST",
      headers: mergedHeaders,
      body: formData,
    }
    this.logger.debug("xiaohongshu form url =>", apiUrl)
    this.logger.debug("xiaohongshu form options =>", options)
    const res = await this.webFormFetch(apiUrl, [mergedHeaders], formData, true)
    return res
  }
}

export { XiaohongshuWebAdaptor }
