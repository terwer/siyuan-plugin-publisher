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

// 警告⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法

import { ElMessage } from "element-plus"
import { isInSiyuanWidget } from "~/utils/platform/siyuan/siyuanUtil"
import envUtil from "~/utils/envUtil"
import { isEmptyString } from "~/utils/util"

/**
 * 是否在思源浏览器
 * @returns {boolean}
 */
export const isInSiyuanNewWinBrowser = () => {
  return typeof window.terwer !== "undefined"
}

/**
 * 获取可操作的Window
 */
const getSiyuanWindow = () => {
  if (isInSiyuanWidget()) {
    return parent.window
  } else {
    if (isInSiyuanNewWinBrowser()) {
      return window
    }
    return window
  }
}

/**
 * 获取新窗口数据目录
 */
export const getSiyuanNewWinDataDir = () => {
  return window.terwer.dataDir ?? "/notfound"
}

/**
 * 关闭思源窗口
 */
export const doCloseExportWin = () => {
  const syWin = getSiyuanWindow()

  const { getCurrentWindow } = syWin.require("@electron/remote")
  getCurrentWindow().close()
}

/**
 * 打开思源导出窗口
 * 打开的时候 syWin = window.parent
 */
export const doOpenExportWin = async (pageId, pageUrl) => {
  const syWin = getSiyuanWindow()

  if (syWin.syp && syWin.syp.renderPublishHelper) {
    // 打开弹窗
    syWin.syp.renderPublishHelper(pageId, pageUrl, syWin, envUtil.isDev)
  } else {
    ElMessage.warning(
      "renderPublishHelper失败，未找到hook方法，请在自定义js片段添加 import('/widgets/sy-post-publisher/lib/siyuanhook.js') ，并重启思源笔记"
    )
  }
}

// 如果是思源新窗口
export const getSiyuanNewWinPageId = () => {
  let pageId
  if (window && window.terwer && window.terwer.pageId) {
    pageId = window.terwer.pageId
    // console.log("window.terwer.pageId=>", window.terwer.pageId)
  }
  return pageId
}

/**
 * 适配主题外观
 */
const fitTheme = () => {
  const syWin = parent.window
  const customstyle = syWin.customstyle
  fitThemeCustom(customstyle)
}

/**
 * 用给定的颜色自定义背景
 * @param customstyle 自定义样式
 */
const fitThemeCustom = (customstyle) => {
  const customAppBgColor = getComputedStyle(document.documentElement).getPropertyValue("--custom-app-bg-color")
  // 样式不一致才去适配
  if (!isEmptyString(customstyle.backgroundColor) && customstyle.backgroundColor !== customAppBgColor) {
    document.documentElement.style.setProperty("--custom-app-bg-color", customstyle.backgroundColor)

    console.log("重新适配customstyle完成=>", customstyle)
  }
}

/**
 * 打开文件
 * @param absFilePath 文件绝对路径
 */
const openPath = (absFilePath) => {
  const syWin = getSiyuanWindow()

  if (syWin.syp && syWin.syp.openPath) {
    // 打开弹窗
    syWin.syp.openPath(absFilePath)
  } else {
    ElMessage.warning(
      "openPath失败，未找到hook方法，请在自定义js片段添加 import('/widgets/sy-post-publisher/lib/siyuanhook.js') ，并重启思源笔记"
    )
  }
}

// 统一访问入口
const siyuanBrowserUtil = {
  fitTheme,
  fitThemeCustom,
  getSiyuanWindow,
  openPath,
}

export default siyuanBrowserUtil
