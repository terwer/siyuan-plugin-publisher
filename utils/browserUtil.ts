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

import { fileOpen, FileWithHandle } from "browser-fs-access"
import { ElMessage } from "element-plus"

/**
 * 是否在浏览器
 * @see {@link https://github.com/flexdinesh/browser-or-node/blob/master/src/index.js#L1 isBrowser}
 */
export const isBrowser = (): boolean => typeof window !== "undefined" && typeof window.document !== "undefined"

/**
 * 检测是否是本地请求
 * @param apiUrl 请求地址
 */
export const isLocalhost = (apiUrl: string): boolean => apiUrl.indexOf("127.0.0.1") > -1

/**
 * 检测是否是Electron
 */
export const isElectron = typeof navigator !== "undefined" && /Electron/.test(navigator.userAgent)

/**
 * 获取url参数
 * @param sParam 参数
 */
export const getQueryString = (sParam: string): string => {
  if (!isBrowser()) {
    return ""
  }
  const sPageURL = window.location.search.substring(1)
  const sURLVariables = sPageURL.split("&")

  for (let i = 0; i < sURLVariables.length; i++) {
    const sParameterName = sURLVariables[i].split("=")
    if (sParameterName[0] === sParam) {
      return sParameterName[1]
    }
  }

  return ""
}

/**
 * 替换 URL 的参数
 * @param url 链接地址
 * @param paramName 参数名
 * @param paramValue 参数值
 */
const replaceUrlParam = (url: string, paramName: string, paramValue: string): string => {
  if (paramValue == null) {
    paramValue = ""
  }
  const pattern = new RegExp("\\b(" + paramName + "=).*?(&|#|$)")
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, "$1" + paramValue + "$2")
  }
  url = url.replace(/[?#]$/, "")
  return url + (url.indexOf("?") > 0 ? "&" : "?") + paramName + "=" + paramValue
}

/**
 * 设置url参数
 * @param urlstring
 * @param key
 * @param value
 */
export const setUrlParameter = (urlstring: string, key: string, value: string): string => {
  if (!isBrowser()) {
    return ""
  }
  // 已经有参数了，不重复添加
  if (urlstring.includes(key)) {
    return replaceUrlParam(urlstring, key, value)
  }
  urlstring += (urlstring.match(/[?]/g) != null ? "&" : "?") + key + "=" + value
  return urlstring
}

/**
 * 重新加载指定tab
 * @param tabname
 */
export const reloadTabPage = (tabname: string): void => {
  setTimeout(function () {
    if (isBrowser()) {
      const url = window.location.href
      window.location.href = setUrlParameter(url, "tab", tabname)
    }
  }, 200)
}

/**
 * 刷新当前tab页面
 */
export const reloadPage = (): void => {
  setTimeout(function () {
    if (isBrowser()) {
      window.location.reload()
    }
  }, 200)
}

/**
 * 刷新当前tab页面
 *
 * @param msg 消息提示
 * @param type 消息类型
 */
const reloadPageWithMessage = (msg, type = "success"): void => {
  if (type == "success") {
    ElMessage.success(msg)
  } else if (type == "warn") {
    ElMessage.warning(msg)
  }

  setTimeout(function () {
    if (isBrowser()) {
      window.location.reload()
    }
  }, 200)
}

export const readJSONFileFormDialog = async (): Promise<FileWithHandle[]> => {
  return await fileOpen({
    description: "JSON files",
    mimeTypes: ["application/json"],
    extensions: [".json"],
    multiple: true,
  })
}

/**
 * 复制网页内容到剪贴板
 * @param text 待复制的文本
 */
export const copyToClipboardInBrowser = (text) => {
  if (navigator && navigator.clipboard) {
    // Copy the selected text to the clipboard
    navigator.clipboard.writeText(text).then(
      function () {
        // The text has been successfully copied to the clipboard
        ElMessage.success("复制成功")
      },
      function (e) {
        // An error occurred while copying the text
        ElMessage.error("复制失败=>" + e)
      }
    )
  } else {
    try {
      const input = document.createElement("input")
      input.style.position = "fixed"
      input.style.opacity = "0"
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      ElMessage.success("复制成功")
    } catch (e) {
      ElMessage.error("复制失败=>" + e)
    }
  }
}

/**
 * 检测是否运行在Chrome插件中
 */
export function isInChromeExtension() {
  if (!isBrowser()) {
    return false
  }
  return window.location.href.indexOf("chrome-extension://") > -1
}

const browserUtil = {
  reloadPageWithMessage,
}

export default browserUtil
