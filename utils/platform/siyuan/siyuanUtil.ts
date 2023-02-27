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

import { getEnv } from "~/utils/envUtil"
import { LogFactory } from "~/utils/logUtil"
import { getJSONConf, setJSONConf } from "~/utils/configUtil"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { getQueryString, isBrowser, isElectron } from "~/utils/browserUtil"
import {
  getSiyuanNewWinPageId,
  isInSiyuanNewWinBrowser,
} from "~/utils/otherlib/siyuanBrowserUtil"

const logger = LogFactory.getLogger("utils/platform/siyuan/siyuanUtil.ts")

interface WidgetResult {
  isInSiyuan: boolean
  widgetId: string
}

/**
 * 获取挂件所在的块ID
 * @returns {Promise<string>}
 */
export const getWidgetId = (): WidgetResult => {
  if (import.meta.env.MODE === "test") {
    return {
      isInSiyuan: true,
      widgetId: getEnv("VITE_SIYUAN_DEV_PAGE_ID"),
    }
  }

  if (
    window.frameElement == null ||
    window.frameElement.parentElement == null ||
    window.frameElement.parentElement.parentElement == null
  ) {
    return {
      isInSiyuan: false,
      widgetId: "",
    }
  }

  const self = window.frameElement.parentElement.parentElement
  if (!self) {
    return {
      isInSiyuan: false,
      widgetId: "",
    }
  }

  const widgetId = self.getAttribute("data-node-id")
  if (!widgetId) {
    return {
      isInSiyuan: false,
      widgetId: "",
    }
  }

  return {
    isInSiyuan: true,
    widgetId,
  }
}

/**
 * 检测是否处于思源笔记环境中
 */
export const isInSiyuanWidget = (): boolean => {
  const widgetResult = getWidgetId()
  return widgetResult.isInSiyuan
}

/**
 * 检测是否处于思源笔记主窗口或者弹出新窗口中
 */
export const isInSiyuanOrSiyuanNewWin = (): boolean => {
  return isElectron
}

/**
 * 获取本地缓存的思源笔记页面信息（不是实时的）
 * @param force true代表强制调用查询不获取缓存
 * @returns {Promise<any>}
 */
const getWidgetPage = async (force?: boolean): Promise<any> => {
  const widgetResult = getWidgetId()
  if (!widgetResult.isInSiyuan) {
    return
  }

  const widgetId = widgetResult.widgetId
  logger.debug("获取挂件的widgetId=>", widgetId)
  // 默认读取缓存
  const pageObj = getJSONConf(widgetId)
  if (!force && pageObj) {
    logger.debug("获取本地缓存的思源笔记页面信息（不是实时的）=>", pageObj)
    return pageObj
  }

  // 如果本地不存在，或者需要强制读取，调用api查询
  const siyuanApi = new SiYuanApi()
  const page = await siyuanApi.getBlockByID(widgetId)
  if (page) {
    setJSONConf(widgetId, page)
    logger.debug("调用API设置查询思源页面信息并更新本地缓存", page)
  }
  return page
}

/**
 * 获取本地缓存的思源笔记页面ID
 * @param force
 * true 强制调用查询不获取缓存
 * false 优先读取本地缓存，缓存不存在再去查询
 * @returns {Promise<*|string>}
 */
const getSiyuanPageId = async (force?: boolean): Promise<any> => {
  const page = await getWidgetPage(force)
  if (!page) {
    return
  }

  const pageId = page.root_id
  logger.debug("获取思源笔记页面ID=>", pageId)
  return pageId
}

/**
 * 获取页面ID，如果不是挂件模式，可以自己提供一个页面ID
 * 优先级
 * 1、自己显式的传递一个ID
 * 2、挂件ID
 * 3、浏览器参数id=传递的ID
 * 4、VITE_SIYUAN_DEV_PAGE_ID写死的测试ID
 * @param force 是否强制刷新
 * @param pageId 页面ID，可选的（挂件模式无需传递，开发阶段或者非挂件模式可以传递ID模拟运行）
 */
export const getPageId = async (
  force?: boolean,
  pageId?: string
): Promise<any> => {
  let syPageId

  // 1、显式传递的ID优先处理
  if (pageId) {
    logger.debug("显示指定pageId=>", pageId)
    syPageId = pageId
  }

  // 2、兼容挂件或者挂件新窗口
  if (!syPageId) {
    const widgetResult = getWidgetId()
    if (widgetResult.isInSiyuan) {
      // 尝试读取挂件的ID
      syPageId = await getSiyuanPageId(force)
    }

    // 新窗口
    if (isInSiyuanNewWinBrowser()) {
      syPageId = getSiyuanNewWinPageId()
    }
  }

  // logger.debug("syPageId=>", syPageId)
  if (!syPageId) {
    //  3、开发模式模拟传递一个ID
    if (isBrowser()) {
      // 尝试从url参数解析ID
      // const curl = window.location.href
      // const urlIdx = curl.lastIndexOf("=")
      // const qPageId = curl.substring(urlIdx + 1, curl.length)
      const qPageId = getQueryString("id")
      if (qPageId !== "") {
        syPageId = qPageId
      }
    }

    // 4、开发模式模拟传递一个ID
    if (!syPageId) {
      const testPageId = getEnv("VITE_SIYUAN_DEV_PAGE_ID")
      if (testPageId) {
        syPageId = testPageId
      }
    }
  }
  return syPageId
}
