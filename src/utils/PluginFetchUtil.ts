/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import type { ILogger } from "~/src/utils/appLogger.ts"

/**
 * 插件宿主内 node-fetch 直传（与 FormData multipart、MetaWeblog XML-RPC 共用）。
 */
class PluginFetchUtil {
  public static pluginLibPath(appInstance: PublisherAppInstance, relativePath: string) {
    return `${appInstance.moduleBase}${relativePath}`
  }

  public static canUsePluginFetch(appInstance: PublisherAppInstance): boolean {
    return typeof appInstance?.win?.require === "function"
  }

  public static getPluginNodeFetch(appInstance: PublisherAppInstance, logger?: ILogger): typeof fetch {
    const win = appInstance.win
    if (typeof win?.require === "function") {
      try {
        const nfc = win.require(this.pluginLibPath(appInstance, "libs/node-fetch-cjs/dist/index.js"))
        return (nfc.default ?? nfc) as typeof fetch
      } catch (e) {
        logger?.warn("plugin node-fetch unavailable, fallback to appInstance.fetch", e)
      }
    }
    return appInstance.fetch as typeof fetch
  }

  public static async postText(
    appInstance: PublisherAppInstance,
    url: string,
    body: string,
    contentType: string,
    logger?: ILogger
  ): Promise<string> {
    const doFetch = this.getPluginNodeFetch(appInstance, logger)
    const res = await doFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body,
    })
    const status = Number(res.status)
    if (!(status >= 200 && status < 300)) {
      const errText = await res.text()
      throw new Error(
        StrUtil.isEmptyString(errText) ? `HTTP request failed (${status})` : `HTTP request failed (${status}): ${errText}`
      )
    }
    return await res.text()
  }
}

export default PluginFetchUtil
