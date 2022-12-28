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

import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"

/**
 * 通过PicGO上传图片，主窗口
 * @returns {Promise<void>}
 */
// export async function uploadQuickByPicGO() {
//   const syWin = window.parent
//   if (syWin.terwer && syWin.terwer.picGoUpload) {
//     return syWin.terwer.picGoUpload()
//   } else {
//     ElMessage.warning(
//       "uploadByPicGO失败，未找到hook方法，请在自定义js片段添加 import('/widgets/sy-post-publisher/lib/siyuanhook.js') ，并重启思源笔记"
//     )
//   }
// }

/**
 * 通过PicGO上传图片
 * @returns {Promise<any[]>}
 */
export async function uploadByPicGO(input) {
  if (input) {
    if (isInSiyuanNewWinBrowser()) {
      return uploadNewWinByPicGO(input)
    } else {
      alert("aaa")
    }
  } else {
    if (isInSiyuanNewWinBrowser()) {
      return uploadNewWinClipboardByPicGO()
    } else {
      alert("bbb")
    }
  }
}

/**
 * 通过PicGO上传图片，思源笔记新窗口
 * @returns {Promise<any[]>}
 */
async function uploadNewWinByPicGO(input) {
  return await window.terwer.picgoExtension.upload(input)
}

/**
 * 通过PicGO上传剪贴板图片，思源笔记新窗口
 * @returns {Promise<any[]>}
 */
async function uploadNewWinClipboardByPicGO() {
  return await window.terwer.picgoExtension.uploadFormClipboard()
}
