/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

import { inSiyuan } from "~/utils/platform/siyuan/siyuanUtil"
import {
  getQueryString,
  isBrowser,
  readJSONFileFormDialog,
  setUrlParameter,
} from "~/utils/browserUtil"
import { LogFactory } from "~/utils/logUtil"
import { isInFirefoxExtension } from "~/utils/otherlib/FirefoxUtil"
import { pathJoin } from "~/utils/util"

const logger = LogFactory.getLogger()

/**
 * 在chrome插件打开网页
 *
 * 注意：非chrome环境，pageUrl：/index.html，split：/，实际url为：//index.html
 * @param pageUrl 例如：/index.html
 * @param split 例如：/，但部分情况下无需传递此参数
 *
 */
function getPageUrl(pageUrl, split) {
  // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
  // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
  // runtime.
  // let url = chrome.runtime.getURL("index/index.html");
  let url = pageUrl
  // 外部链接
  if (url.startsWith("http") || url.startsWith("https")) {
    logger.info("当前是外部链接，直接跳转")
    return url
  }

  // 处理内部链接
  if (typeof chrome.runtime !== "undefined") {
    url = chrome.runtime.getURL(url)
  } else {
    // 思源笔记链接处理
    const from = getQueryString("from")
    if (inSiyuan() || from === "siyuan") {
      url = "/widgets/sy-post-publisher" + url
      url = setUrlParameter(url, "from", "siyuan")
    }

    // 处理手动分隔符
    let baseUrl = window.location.protocol + "//" + window.location.host
    if (split && split !== "") {
      baseUrl = window.location.protocol + "//" + window.location.host + split
    }

    // 智能拼接
    url = pathJoin(baseUrl, url)
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
 * 检测是否运行在Chrome插件中
 */
export function isInChromeExtension() {
  if (!isBrowser()) {
    return false
  }
  if (isInFirefoxExtension()) {
    return false
  }
  return (
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
  )
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
 * 导入JSON配置
 */
export const importJSONToLocalStorage = async () => {
  // Open a file dialog and select a file
  const files = await readJSONFileFormDialog()

  // Create a FileReader to read the file
  const reader = new FileReader()

  // When the file has been read, log the contents to the console
  reader.addEventListener("load", () => {
    // Parse the JSON string to a JavaScript object
    const data = JSON.parse(reader.result)

    console.log("准备导入配置，读取到的配置数据为=>", data)
    // Iterate over the key/value pairs in the object
    for (const [key, value] of Object.entries(data)) {
      // Add each pair to LocalStorage
      localStorage.setItem(key, value)
    }
  })

  // Read the file as a string of text
  reader.readAsText(files[0])
}
