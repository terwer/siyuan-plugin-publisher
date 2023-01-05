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

import {
  copyToClipboardInBrowser,
  isBrowser,
  isElectron,
} from "~/utils/browserUtil"
import { reactive } from "vue"
import { parseJSONObj } from "~/utils/configUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { LogFactory } from "~/utils/logUtil"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { ImageItem } from "~/utils/models/imageItem"
import { ElMessage } from "element-plus"
import { getSiyuanNewWinDataDir } from "~/utils/otherlib/siyuanBrowserUtil"

/**
 * Picgo图片管理组件
 */
export const usePicgoManage = (props, deps) => {
  // private data
  const logger = LogFactory.getLogger("composables/picgo/picgoManageCom.ts")
  const siyuanApi = new SiYuanApi()

  // public data
  const picgoManageData = reactive({
    dialogImageUrl: "",
    dialogPreviewVisible: false,
  })

  // public methods
  const picgoManageMethods = {
    handleUploadAllImagesToBed: () => {
      alert("handleUploadAllImagesToBed")
    },

    handleUploadCurrentImageToBed: async (imageItem: ImageItem) => {
      if (!imageItem.isLocal) {
        ElMessage.error("已经上传过图床，请勿重复上传")
        return
      }

      const pageId = await getPageId(true, props.pageId)
      const attrs = await siyuanApi.getBlockAttrs(pageId)

      const mapInfoStr = attrs[CONSTANTS.PICGO_FILE_MAP_KEY] ?? "{}"
      const fileMap = parseJSONObj(mapInfoStr)
      logger.debug("fileMap=>", fileMap)

      // 处理上传
      let imageFullPath
      if (isElectron) {
        const imagePath = imageItem.originUrl
        const dataDir: string = getSiyuanNewWinDataDir()
        imageFullPath = `${dataDir}/imagePath`
      } else {
        imageFullPath = imageItem.url
      }
      logger.info(
        "isElectron=>" + isElectron + ", imageFullPath=>",
        imageFullPath
      )

      // fileMap[imageItem.originUrl] = new ImageItem(
      //   imageItem.name,
      //   imageItem.originUrl,
      //   imageItem.url,
      //   false
      // )
      // console.log("newFileMap=>", fileMap)
      //
      // const newFileMapStr = toJSONString(fileMap)
      // await siyuanApi.setBlockAttrs(pageId, {
      //   [CONSTANTS.PICGO_FILE_MAP_KEY]: newFileMapStr,
      // })
    },

    doUploadImagesToBed: (urls: string[]) => {},

    onImageUrlCopy: (url: string) => {
      if (isBrowser()) {
        const mdUrl = `![](${url})`
        copyToClipboardInBrowser(mdUrl)
      }
    },

    handlePictureCardPreview: (url) => {
      picgoManageData.dialogImageUrl = url ?? ""
      picgoManageData.dialogPreviewVisible = true
    },
  }

  return {
    picgoManageData,
    picgoManageMethods,
  }
}
