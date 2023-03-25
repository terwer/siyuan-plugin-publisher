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

import { isInSiyuanWidget } from "~/utils/platform/siyuan/siyuanUtil"
import { getQueryString, isInChromeExtension, readJSONFileFormDialog, setUrlParameter } from "~/utils/browserUtil"
import { LogFactory } from "~/utils/logUtil"
import { isEmptyString, pathJoin } from "~/utils/util"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"
import { DeviceType, DeviceUtil } from "~/utils/deviceUtil"
import { getLocalStorageAdaptor } from "~/utils/otherlib/confUtil"

const logger = LogFactory.getLogger()

// 思源笔记
const FROM_SIYUAN = "siyuan"
// 思源笔记新窗口
const FROM_SIYUAN_NEWWIN = "siyuanNewWin"
// Chrome浏览器
const FROM_CHROME = "chrome"

/**
 * 来源
 */
export const FROM_CONSTANTS = {
  FROM_SIYUAN,
  FROM_SIYUAN_NEWWIN,
  FROM_CHROME,
}

/**
 * 通过 host 拼接url
 * @param host
 * @param srcUrl
 * @param split
 * @returns {string}
 */
const appendHost = (host, srcUrl, split) => {
  let url = srcUrl
  let baseUrl = window.location.protocol + "//" + host
  if (split && split !== "") {
    baseUrl = window.location.protocol + "//" + host + split
  }

  // 智能拼接
  url = pathJoin(baseUrl, url)
  return url
}

/**
 * 在chrome插件打开网页
 *
 * 注意：非chrome环境，pageUrl：/index.html，split：/，实际url为：//index.html
 * @param pageUrl 例如：/index.html
 * @param split 例如：/，但部分情况下无需传递此参数
 *
 */
export const getPageUrl = (pageUrl, split) => {
  // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
  // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
  // runtime.
  // let url = chrome.runtime.getURL("index/index.html");
  let url = pageUrl
  // 外部链接
  if (url.startsWith("http") || url.startsWith("https")) {
    logger.debug("当前是外部链接，直接跳转")
    return url
  }

  // 处理内部链接
  const deviceType = DeviceUtil.getDevice()
  console.log("deviceType=>", deviceType)
  let from = getQueryString("from")

  if (
    deviceType === DeviceType.DeviceType_Siyuan_Widget ||
    deviceType === DeviceType.DeviceType_Siyuan_NewWin ||
    FROM_CONSTANTS.FROM_SIYUAN === from ||
    FROM_CONSTANTS.FROM_SIYUAN_NEWWIN === from
  ) {
    // 思源笔记链接处理
    url = "/widgets/sy-post-publisher" + url
    if (isInSiyuanWidget()) {
      from = FROM_CONSTANTS.FROM_SIYUAN
    }
    if (isInSiyuanNewWinBrowser()) {
      from = FROM_CONSTANTS.FROM_SIYUAN_NEWWIN
    }
    if (isInChromeExtension()) {
      from = FROM_CONSTANTS.FROM_CHROME
    }
    if (!isEmptyString(from)) {
      url = setUrlParameter(url, "from", from)
    }

    // 处理host
    let host = window.location.host
    if (isInSiyuanNewWinBrowser()) {
      const ipv4 = window.terwer.ip
      host = ipv4 + ":" + window.location.port
    }
    // 拼接url
    url = appendHost(host, url, split)
  } else if (deviceType === DeviceType.DeviceType_Chrome_Extension) {
    url = chrome.runtime.getURL(url)
  } else {
    let host = window.location.host
    // 拼接url
    url = appendHost(host, url, split)
  }

  logger.warn("将要打开页面=>", url)
  return url
}

export function goToPage(pageUrl) {
  const url = getPageUrl(pageUrl, "")
  window.open(url)
}

export function goToPageWithTarget(pageUrl, target, split) {
  const url = getPageUrl(pageUrl, split)
  if (target === "_self") {
    window.location.href = url
  } else {
    window.open(url)
  }
}

/**
 * 向Chrome发送消息
 * @param message 消息
 */
export async function sendChromeMessage(message) {
  return await new Promise((resolve) => {
    // Firefox处理
    // if (isInFirefoxExtension()) {
    //     logger.warn("Firefox发送消息", message)
    //     // browser.runtime.sendMessage(message, resolve)
    //
    //     if (message.type == "fetchChromeXmlrpc") {
    //         try {
    //             firefoxXmlHttpRequest({url: message.apiUrl}).then(function (r) {
    //                 resolve(r)
    //             })
    //         } catch (e) {
    //             logger.error("Firefox request error")
    //             resolve("error")
    //         }
    //     }
    // }

    chrome.runtime.sendMessage(message, resolve)
  })
}

/**
 * 导入JSON数据
 *
 * @param callback 回调
 */
export const importJSONData = async (callback) => {
  // Open a file dialog and select a file
  const files = await readJSONFileFormDialog()

  // Create a FileReader to read the file
  const reader = new FileReader()

  // When the file has been read, log the contents to the console
  reader.addEventListener("load", () => {
    // Parse the JSON string to a JavaScript object
    const data = JSON.parse(reader.result)

    console.log("准备导入配置，读取到的配置数据为=>", data)
    callback(data)
  })

  // Read the file as a string of text
  reader.readAsText(files[0])
}

/**
 * 导入JSON配置
 */
export const importJSONToLocalStorage = async () => {
  const store = getLocalStorageAdaptor()

  await importJSONData(function (data) {
    // Iterate over the key/value pairs in the object
    for (const [key, value] of Object.entries(data)) {
      // Add each pair to LocalStorage
      store.setItem(key, value)
    }
  })
}

/**
 * 检测是否是Windows
 */
export const isWindows = typeof navigator !== "undefined" && "Windows" === navigator?.userAgentData?.platform

/**
 * 是否在插槽里面
 * @type {boolean}
 */
export const isSlot = getQueryString("isSlot") === "true"

/**
 * 检测文件是否存在
 * @returns {boolean}
 */
export const isFileExist = (filepath) => {
  const fs = require("fs")

  if (fs.existsSync(filepath)) {
    console.log("File exists")
    return true
  } else {
    console.log("File does not exist")
    return false
  }
}
