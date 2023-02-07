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

import { PicGoUploadApi } from "~/utils/platform/picgo/picGoUploadApi"
import { isInSiyuanOrSiyuanNewWin } from "~/utils/platform/siyuan/siyuanUtil"

// Pico上传Api封装
const picGoUploadApi = new PicGoUploadApi()

/**
 * 通过PicGO上传图片
 * @returns {Promise<any[]>}
 */
const uploadByPicGO = async (input) => {
  // 通过PicGO上传图片
  if (input) {
    if (isInSiyuanOrSiyuanNewWin()) {
      const syPicgo = window.SyPicgo
      return syPicgo.upload(input)
    } else {
      // HTTP调用本地客户端上传
      return picGoUploadApi.upload(input)
    }
  } else {
    // 通过PicGO上传剪贴板图片
    if (isInSiyuanOrSiyuanNewWin()) {
      const syPicgo = window.SyPicgo
      return syPicgo.uploadFormClipboard()
    } else {
      // HTTP调用本地客户端上传
      return picGoUploadApi.upload()
    }
  }
}

/**
 * PicGO相关操作统一访问入口
 */
const picgoUtil = {
  uploadByPicGO,
}
export default picgoUtil
