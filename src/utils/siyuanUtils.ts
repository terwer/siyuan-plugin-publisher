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

import { SiyuanKernelApi } from "zhi-siyuan-api"
import { StrUtil } from "zhi-common"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { BrowserUtil } from "zhi-device"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"

const logger = createAppLogger("siyuan-util")
const { isInSiyuanWidget, isInSiyuanBrowser } = useSiyuanDevice()

/**
 * 文件是否存在
 *
 * @param kernelApi - kernelApi
 * @param p - 路径
 * @param type - 类型
 */
export const isFileExists = async (kernelApi: SiyuanKernelApi, p: string, type: "text" | "json") => {
  try {
    const res = await kernelApi.getFile(p, type)
    if (type === "text") {
      return !StrUtil.isEmptyString(res)
    }
    return res !== null
  } catch {
    return false
  }
}

/**
 * 获取挂件所在的块ID
 */
export const getSiyuanWidgetId = () => {
  if (
    window.frameElement == null ||
    window.frameElement.parentElement == null ||
    window.frameElement.parentElement.parentElement == null
  ) {
    return ""
  }

  const self = window.frameElement.parentElement.parentElement
  if (!self) {
    return ""
  }

  const widgetId = self.getAttribute("data-node-id")
  if (!widgetId) {
    return ""
  }

  return widgetId
}

// 如果是思源新窗口
const getSiyuanNewWinPageId = () => {
  let pageId: string
  const win = window as any
  if (win && win.terwer && win.terwer.pageId) {
    pageId = win.terwer.pageId
  }
  return pageId
}

export const getSiyuanPageId = async (pageId?: string, force?: boolean) => {
  // 1、显式传递的ID优先处理
  if (!StrUtil.isEmptyString(pageId)) {
    logger.debug("显示指定pageId=>", pageId)
    return pageId
  }

  // 2、兼容挂件或者挂件新窗口
  const isSiyuanWidget = isInSiyuanWidget()
  if (isSiyuanWidget) {
    // 尝试读取挂件的ID
    const widgetPageId = getSiyuanWidgetId()
    if (!StrUtil.isEmptyString(widgetPageId)) {
      const { kernelApi } = useSiyuanApi()
      const widgetAttrs = await kernelApi.getBlockByID(widgetPageId)
      const docPageId = widgetAttrs.root_id
      return docPageId
    }
  }

  // 新窗口
  if (isInSiyuanBrowser()) {
    const syBrowserPageId = getSiyuanNewWinPageId()
    if (!StrUtil.isEmptyString(syBrowserPageId)) {
      return syBrowserPageId
    }
  }

  //  3、开发模式模拟传递一个ID
  if (BrowserUtil.isInBrowser) {
    // 尝试从url参数解析ID
    const paramsPageId = BrowserUtil.getQueryParam("id")
    if (!StrUtil.isEmptyString(paramsPageId)) {
      return paramsPageId
    }
  }

  // 4、开发模式模拟传递一个ID
  const testPageId = process.env.VITE_SIYUAN_DEV_PAGE_ID
  if (!StrUtil.isEmptyString(testPageId)) {
    return testPageId
  }

  return ""
}
