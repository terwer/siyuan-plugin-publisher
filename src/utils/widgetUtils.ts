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
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { StrUtil } from "zhi-common"
import { BrowserUtil, SiyuanDevice } from "zhi-device"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { MockBrowser } from "~/src/utils/MockBrowser.ts"
import { extraPreCfg } from "~/src/platforms/pre.ts"

const logger = createAppLogger("widget-utils")

const matchUrl = (url: string, pattern: string) => {
  // 将字符串模式转换为正则表达式
  const regexString = pattern
    .replace("https://", "^https://") // 确保以 https:// 开头
    .replace("*", ".*") // 将 * 替换为 .* 以匹配任意字符
    .replace(".com/", "\\.com\\/.*$") // 处理 .com/ 以适应正则

  const regex = new RegExp(regexString) // 动态创建正则表达式

  return regex.test(url)
}

/**
 * 打开网页弹窗
 */
export const openBrowserWindow = (
  url: string,
  dynCfg?: DynamicConfig,
  cookieCb?: any,
  extraScriptCb?: any,
  isDevMode?: boolean
) => {
  const { isInSiyuanWidget } = useSiyuanDevice()

  if (isInSiyuanWidget()) {
    const isDev = isDevMode ?? false
    const isModel = false
    const isShow = !cookieCb
    doOpenBrowserWindow(url, undefined, undefined, isDev, isModel, isShow, dynCfg, cookieCb, extraScriptCb)
  } else {
    window.open(url)
  }
}

/**
 * 打开新窗口
 *
 * 示例：
 *
 * ```
 * ## development
 * openBrowserWindow("https://www.baidu.com", undefined, undefined, true, false)
 * openBrowserWindow("https://www.baidu.com", { "key1": "value1", "key2": "value2" }, undefined, true, false)
 *
 * ## production
 * openBrowserWindow("https://www.baidu.com")
 * ```
 *
 * @param url - url
 * @param params - 参数
 * @param win - 父窗口
 * @param isDev - 是否打开开发者工具
 * @param modal - 是否模态
 * @param isShow - 是否显示
 * @param dynCfg - 动态配置
 * @param cookieCallback - 窗口关闭回调
 * @param extraScriptCallback - 额外执行的脚本回调
 */
const doOpenBrowserWindow = (
  url: string,
  params?: Record<string, string>,
  win?: any,
  isDev = false,
  modal = false,
  isShow = true,
  dynCfg?: DynamicConfig,
  cookieCallback = undefined,
  extraScriptCallback = undefined
) => {
  try {
    if (StrUtil.isEmptyString(url)) {
      logger.error("Url cannot be empty")
      return
    }

    const { isInSiyuanWidget } = useSiyuanDevice()
    if (!BrowserUtil.isElectron() && !isInSiyuanWidget) {
      logger.info("BrowserWindow can ony be available in siyuan Electron environment")
      return
    }

    if (params) {
      Object.keys(params).forEach((key: string) => {
        const value = params[key]
        url = BrowserUtil.setUrlParameter(url, key, value)
      })
    }

    logger.info(StrUtil.f("Opening a new BrowserWindow from url => {0}", url))

    const mainWin = win ?? SiyuanDevice.siyuanWindow()
    const { app, BrowserWindow, getCurrentWindow } = mainWin.require("@electron/remote")
    const remote = mainWin.require("@electron/remote").require("@electron/remote/main")
    const mainWindow = getCurrentWindow()
    const newWindow = new BrowserWindow({
      parent: mainWindow,
      width: 900,
      height: 750,
      show: isShow,
      resizable: true,
      modal: modal,
      icon: SiyuanDevice.browserJoinPath(
        SiyuanDevice.siyuanWindow().siyuan.config.system.appDir,
        "stage",
        "icon-large.png"
      ),
      titleBarOverlay: {
        color: "#cccccca5",
        symbolColor: "black",
      },
      webPreferences: {
        nativeWindowOpen: true,
        nodeIntegration: true,
        webviewTag: true,
        webSecurity: false,
        contextIsolation: false,
      },
    })

    // newWindow.webContents.userAgent = `SiYuan/${app.getVersion()} https://b3log.org/siyuan Electron`
    // newWindow.webContents.userAgent = MockBrowser.HEADERS.MACOS_CHROME["User-Agent"]

    // ！！！ ⚠️警告，这里的拦截权限非常高，非必要不要设置， 过滤器的范围应该尽量小
    // 设置 session
    const session = newWindow.webContents.session
    session.webRequest.onBeforeSendHeaders({ urls: extraPreCfg.uaWhiteList }, (details: any, callback: any) => {
      const reqUrl = new URL(url)
      console.warn("UA 已修改适配，当前请求为", reqUrl)
      if (extraPreCfg.headersMap[reqUrl.href]) {
        // headers自定义
        const newHeaders = extraPreCfg.headersMap[reqUrl.href]
        for (const key in newHeaders) {
          details.requestHeaders[key] = newHeaders[key]
        }
        console.warn("使用自定义header")
      } else {
        // 使用统一 header
        details.requestHeaders["User-Agent"] = MockBrowser.HEADERS.MACOS_CHROME["User-Agent"]
        console.warn("使用默认header")
      }
      callback({ cancel: false, requestHeaders: details.requestHeaders })
    })
    // ！！！ ⚠️警告，这里的拦截权限非常高，非必要不要设置， 过滤器的范围应该尽量小

    // 允许
    remote.enable(newWindow.webContents)
    if (isDev) {
      newWindow.webContents.openDevTools()
    }

    const readCookies = async () => {
      const extraScript = dynCfg.extraScript
      if (extraScript) {
        try {
          const result = await newWindow.webContents.executeJavaScript(extraScript)
          logger.info(`执行额外脚本成功：${result}`)
          await extraScriptCallback(result)
        } catch (error) {
          logger.error(`执行额外脚本失败：${error}`)
          ElMessage.error(`执行额外脚本失败：${error}`)
        }
      }
      // ============================================================================================

      // https://www.electronjs.org/zh/docs/latest/api/session
      const ses = newWindow.webContents.session
      const targetDomain = dynCfg.domain
      // 1. 获取所有 Cookie
      const allCookies: any[] = await ses.cookies.get({})
      // 2. 过滤出目标域名及其子域名的 Cookie
      const domainCookies = allCookies.filter((cookie) => {
        // Cookie 的 domain 可能是：
        // - "example.com" (精确匹配)
        // - ".example.com" (主域名及所有子域名)
        // - "sub.example.com" (特定子域名)
        return (
          cookie.domain === targetDomain ||
          cookie.domain === `.${targetDomain}` ||
          cookie.domain.endsWith(`.${targetDomain}`)
        )
      })
      if (domainCookies.length > 0) {
        logger.info(`读取所有cookies成功`, domainCookies)
        await cookieCallback(dynCfg, domainCookies)
      } else {
        logger.info(`未读取到Cookie`)
      }
    }

    // const readCookies = () => {
    //   // https://www.electronjs.org/zh/docs/latest/api/session
    //   const ses = newWindow.webContents.session
    //   const domain = dynCfg.domain
    //   if (dynCfg.extraScript) {
    //     newWindow.webContents
    //       .executeJavaScript(dynCfg.extraScript)
    //       .then((result: any) => {
    //         logger.info(`执行额外脚本触发：${result}`)
    //         extraScriptCallback(result)
    //       })
    //       .catch((error: any) => {
    //         logger.error(`执行额外脚本失败：${error}`)
    //         ElMessage.error("执行额外脚本失败：${error}")
    //       })
    //   }
    //   ses.cookies
    //     .get({ domain })
    //     .then(async (cookies: any) => {
    //       logger.info(`读取cookie事件触发，准备读取 ${domain} 下的所有 Cookie`, cookies)
    //       await cookieCallback(dynCfg, cookies)
    //     })
    //     .catch(async (error: any) => {
    //       logger.error(`读取 Cookie 失败：${error}`)
    //       ElMessage.error(`读取 Cookie 失败：${error}`)
    //       await cookieCallback(dynCfg, undefined)
    //     })
    // }

    // 监听 close 事件
    newWindow.on("close", (evt: any) => {
      // readCookies()
      logger.info("窗口关闭事件触发")
    })
    newWindow.loadURL(url)

    // newWindow.webContents.executeJavaScript("window.location.href").then((curUrl: string) => {
    //   if (url != curUrl) {
    //     alert("当前地址" + curUrl + "与" + url + "不一致，需要刷新页面，请稍后")
    //     newWindow.loadURL(curUrl)
    //   }
    // })

    // 读取指定域的所有 Cookie
    if (cookieCallback) {
      readCookies().then(() => {
        newWindow.hide()
        newWindow.close()
      })
    } else {
      logger.info("cookieCallback is undefined")
      newWindow.show()
    }
  } catch (e) {
    logger.error("Open browser window failed", e)
    ElMessage.error(`Open browser window failed =>${e}`)
  }
}

/**
 * 获取主窗口页面的节点ID
 *
 * @param doc - 父窗口的 document 对象
 * @returns 返回页面的节点ID，如果不存在，则返回undefined
 */
const getMainWindowPageId = (doc: Document): string | undefined => {
  // 查找包含 protyle 类但不包含 fn__none 的 div 元素
  const protyleElement = doc.querySelector("div.protyle:not(.fn__none)")

  // 在该 div 元素下查找包含 protyle-title 类的 div 元素，并获取 data-node-id 属性的值
  const protyleTitleElement = protyleElement?.querySelector("div.protyle-title")
  const nodeId = protyleTitleElement?.getAttribute("data-node-id")

  return nodeId
}

/**
 * 获取挂件所在的块ID
 *
 * 如果挂件未找到或块ID无效，则返回undefined
 * @returns 返回挂件所在的块ID，如果不存在，则返回undefined
 */
export const getWidgetId = (): string | undefined => {
  const parentDocument = window.parent.document
  // 返回挂件所在的块ID
  return getMainWindowPageId(parentDocument)
}
