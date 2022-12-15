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

import { isBrowser } from "~/utils/browserUtil"
import { inSiyuan } from "~/utils/platform/siyuan/siyuanUtil"
import { ElMessage } from "element-plus"

const SIYUAN_BROWSER_CONSTANTS_SIYUAN_EXPORT_CLOSE = "siyuan-export-close"

// 警告⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法

/**
 * 是否在思源浏览器
 * @returns {boolean}
 */
export const isInSiyuanBrowser = () => {
  console.log("inSiyuan=>", inSiyuan())
  console.log("isBrowser=>", isBrowser())
  console.log("window.siyuan=>", window.siyuan !== "undefined")
  return inSiyuan() && isBrowser() && typeof window.siyuan !== "undefined"
}

/**
 * 关闭思源导出窗口
 */
export const doCloseExportWin = () => {
  const { ipcRenderer } = require("electron")
  ipcRenderer.send(SIYUAN_BROWSER_CONSTANTS_SIYUAN_EXPORT_CLOSE)

  // getCurrentWindow().webContents.setZoomFactor(1)
  if (window.siyuan.printWin) {
    window.siyuan.printWin.destroy()
  }
}

/**
 * 打开思源导出窗口
 */
export const doOpenExportWin = async () => {
  const syWin = window.parent
  if (syWin.terwer && syWin.terwer.renderPublishHelper) {
    // 打开弹窗
    syWin.terwer.renderPublishHelper()
  } else {
    ElMessage.warning(
      "未找到hook方法，请在自定义js片段添加 import('/widgets/sy-post-publisher/lib/siyuanhook.js') ，并重启思源笔记"
    )
  }
}
