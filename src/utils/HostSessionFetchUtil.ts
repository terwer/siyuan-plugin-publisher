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
import { createAppLogger, type ILogger } from "~/src/utils/appLogger.ts"

/**
 * 宿主会话直传（Electron `session.fetch`，即 Chromium 网络栈）。
 *
 * 与 {@link PluginFetchUtil} 的区别：后者走 Node 的 fetch，部分站点会因客户端特征被拒；
 * 本通道复用宿主自身的网络栈与默认会话，行为与宿主内直接访问网页一致，
 * 因此对这类站点可用，且**不需要用户登录**。
 *
 * 仅声明使用该通道的平台会走到这里，其他平台不受影响。
 */
class HostSessionFetchUtil {
  /**
   * 取 Electron 的默认会话对象。
   *
   * 新版本 Electron 已移除 `remote`，因此优先取 `@electron/remote`，
   * 取不到时再尝试 `electron` 本体上暴露的 `session`。
   */
  private static getDefaultSession(appInstance: PublisherAppInstance, logger?: ILogger): any | null {
    const win = appInstance?.win
    if (typeof win?.require !== "function") {
      return null
    }

    try {
      const remote = win.require("@electron/remote")
      const session = remote?.session?.defaultSession
      if (session) {
        return session
      }
    } catch (e) {
      logger?.debug("HostSessionFetchUtil: @electron/remote unavailable", e)
    }

    try {
      const electron = win.require("electron")
      const session = electron?.session?.defaultSession
      if (session) {
        return session
      }
    } catch (e) {
      logger?.debug("HostSessionFetchUtil: electron.session unavailable", e)
    }

    return null
  }

  /** 宿主是否具备该通道的能力 */
  public static canUseSessionFetch(appInstance: PublisherAppInstance): boolean {
    const session = this.getDefaultSession(appInstance)
    return typeof session?.fetch === "function"
  }

  /**
   * 取一个绑定默认会话的 fetch。
   *
   * 该 fetch 与 `window.fetch` 的差异在于不受页面同源策略约束（会话级 API），
   * 因此可以跨站调用平台端点。
   */
  public static getSessionFetch(appInstance: PublisherAppInstance, logger?: ILogger): typeof fetch | null {
    const session = this.getDefaultSession(appInstance, logger)
    if (typeof session?.fetch !== "function") {
      return null
    }
    // 绑定到 session，避免调用时丢失 this
    return ((input: any, init?: any) => session.fetch(input, init)) as typeof fetch
  }

  /**
   * 确保默认会话已对该站点可用。
   *
   * 部分站点会先返回一个需要由页面脚本完成校验的中间页；宿主的渲染栈在访问一次站点后即会
   * 自动完成该过程并保持可用，故这里只需访问一次站点根地址并等待其稳定。
   *
   * 该动作**幂等**且**无需用户交互**：已可用时直接命中，不会重复打开窗口。
   *
   * @param appInstance 应用实例
   * @param home 站点根地址（平台首页）
   * @param probeUrl 用于判定可用性的端点（通常为 API 地址）；省略时用首页判定
   * @param logger 日志
   */
  public static async ensureSiteReady(
    appInstance: PublisherAppInstance,
    home: string,
    probeUrl?: string,
    logger?: ILogger
  ): Promise<boolean> {
    const log = logger ?? createAppLogger("host-session-fetch")
    const doFetch = this.getSessionFetch(appInstance, log)
    if (!doFetch) {
      log.warn("HostSessionFetchUtil: session fetch unavailable, skip readiness")
      return false
    }
    if (StrUtil.isEmptyString(home)) {
      log.warn("HostSessionFetchUtil: empty home, skip readiness")
      return false
    }

    const target = StrUtil.isEmptyString(probeUrl) ? home : probeUrl
    if (await this.probe(doFetch, target, log)) {
      log.info("HostSessionFetchUtil: site already ready")
      return true
    }

    const opened = await this.visitSite(appInstance, home, log)
    if (!opened) {
      return false
    }

    const deadline = Date.now() + 20000
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1500))
      if (await this.probe(doFetch, target, log)) {
        log.info("HostSessionFetchUtil: site ready after visit")
        return true
      }
    }

    log.warn("HostSessionFetchUtil: site not ready within timeout")
    return false
  }

  /** 探测端点是否已可用（只关心是否还能拿到非中间页响应） */
  private static async probe(doFetch: typeof fetch, url: string, log: ILogger): Promise<boolean> {
    try {
      const res = await doFetch(url, { method: "GET" })
      const status = Number(res?.status ?? 0)
      log.debug(`HostSessionFetchUtil: probe ${url} => ${status}`)
      // 中间页通常以 403 返回；能拿到其它状态说明已放行
      return status > 0 && status !== 403
    } catch (e) {
      log.debug("HostSessionFetchUtil: probe failed", e)
      return false
    }
  }

  /** 访问一次站点，让宿主渲染栈自行完成站点校验 */
  private static async visitSite(appInstance: PublisherAppInstance, url: string, log: ILogger): Promise<boolean> {
    const win = appInstance?.win
    if (typeof win?.require !== "function") {
      return false
    }

    let BrowserWindow: any
    try {
      BrowserWindow = win.require("@electron/remote")?.BrowserWindow
    } catch (e) {
      log.debug("HostSessionFetchUtil: BrowserWindow unavailable", e)
    }
    if (!BrowserWindow) {
      return false
    }

    let w: any = null
    try {
      w = new BrowserWindow({
        width: 480,
        height: 360,
        show: false,
        skipTaskbar: true,
        webPreferences: { contextIsolation: true, nodeIntegration: false },
      })
      await w.loadURL(url)
      log.info("HostSessionFetchUtil: visited site for readiness")
      return true
    } catch (e) {
      log.warn("HostSessionFetchUtil: visit site failed", e)
      return false
    } finally {
      try {
        if (w && !w.isDestroyed()) {
          w.destroy()
        }
      } catch (e) {
        log.debug("HostSessionFetchUtil: destroy window failed", e)
      }
    }
  }
}

export default HostSessionFetchUtil
