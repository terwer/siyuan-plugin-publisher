/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi"
import { MockBrowser } from "~/src/utils/MockBrowser"
import { XiaohongshuUtils } from "./XiaohongshuUtils"

/**
 * 小红书适配器
 *
 * @author terwer
 * @since 1.32.0
 * @deprecated 小红书签名机制复杂，暂时搁置，待后续研究
 */
class XiaohongshuWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    // 小红书验证 API: /api/galaxy/user/info
    // 成功返回: { result: 0, success: true, code: 0, data: { userId, userName, userAvatar, ... } }
    // 失败返回: { code: -1, msg: "登录已过期", result: -100, success: false }
    const header = {
      "User-Agent": MockBrowser.HEADERS.MACOS_CHROME["User-Agent"],
      referer: "https://creator.xiaohongshu.com/new/home",
    }

    try {
      const res = await this.xiaohongshuFetch("/api/galaxy/user/info", header)
      this.logger.debug("get xiaohongshu metadata res=>", res)

      // 验证是否成功
      const flag = res?.success === true && res?.code === 0 && !!res?.data?.userId
      this.logger.info(`get xiaohongshu metadata finished, flag => ${flag}`)

      if (flag) {
        return {
          flag: true,
          uid: res.data.userId,
          title: res.data.userName,
          avatar: res.data.userAvatar,
          type: "xiaohongshu",
          displayName: "小红书",
          supportTypes: ["markdown"],
          home: "https://creator.xiaohongshu.com/new/home",
          icon: "https://www.xiaohongshu.com/favicon.ico",
        }
      } else {
        return {
          flag: false,
          msg: res?.msg || "小红书授权验证失败",
        }
      }
    } catch (e) {
      this.logger.error("get xiaohongshu metadata error=>", e)
      return {
        flag: false,
        msg: e.message || "小红书授权验证异常",
      }
    }
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
    const timestamp = Date.now()

    // 生成签名头
    const signHeaders = XiaohongshuUtils.generateSignature(url, timestamp)

    const reqHeaderMap = new Map<string, string>()
    reqHeaderMap.set("Cookie", this.cfg.password)

    // 合并所有头信息：Cookie + 签名 + 用户自定义头
    const mergedHeaders = {
      ...Object.fromEntries(reqHeaderMap),
      ...signHeaders,
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
