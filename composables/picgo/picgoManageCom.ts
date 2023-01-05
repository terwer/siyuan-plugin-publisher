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
  reloadPage,
} from "~/utils/browserUtil"
import { reactive } from "vue"
import { parseJSONObj, toJSONString } from "~/utils/configUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { LogFactory } from "~/utils/logUtil"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { ImageItem } from "~/utils/models/imageItem"
import { ElMessage } from "element-plus"
import { getSiyuanNewWinDataDir } from "~/utils/otherlib/siyuanBrowserUtil"
import { uploadByPicGO } from "~/utils/otherlib/picgoUtil"
import { useI18n } from "vue-i18n"
import { isFileExist } from "~/utils/otherlib/ChromeUtil"

/**
 * Picgo图片管理组件
 */
export const usePicgoManage = (props, deps) => {
  // private data
  const logger = LogFactory.getLogger("composables/picgo/picgoManageCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()

  // public data
  const picgoManageData = reactive({
    dialogImageUrl: "",
    dialogPreviewVisible: false,
  })

  // deps
  const picgoCommonMethods = deps.picgoCommonMethods
  const picgoInitMethods = deps.picgoInitMethods

  // deps data
  const picgoCommonData = picgoCommonMethods.getPicgoCommonData()

  // public methods
  const picgoManageMethods = {
    handleUploadAllImagesToBed: async () => {
      picgoCommonData.isUploadLoading = true

      try {
        let hasLocalImages = false
        const imageItemArray = picgoCommonData.fileList.files

        for (let i = 0; i < imageItemArray.length; i++) {
          const imageItem = imageItemArray[i]
          if (!imageItem.isLocal) {
            logger.warn("已经上传过图床，请勿重复上传=>", imageItem.originUrl)
            continue
          }

          hasLocalImages = true
          await picgoManageMethods.doUploadImagesToBed(imageItem)
        }

        if (!hasLocalImages) {
          ElMessage.error("未发现本地图片，不上传")
        }
        picgoCommonData.isUploadLoading = false

        reloadPage()
      } catch (e) {
        picgoCommonData.isUploadLoading = false

        ElMessage({
          type: "error",
          message: t("main.opt.failure") + "=>" + e,
        })
        logger.error(t("main.opt.failure") + "=>" + e)
      }
    },

    handleUploadCurrentImageToBed: async (imageItem: ImageItem) => {
      picgoCommonData.isUploadLoading = true

      if (!imageItem.isLocal) {
        ElMessage.error("已经上传过图床，请勿重复上传")
        picgoCommonData.isUploadLoading = false
        return
      }

      try {
        await picgoManageMethods.doUploadImagesToBed(imageItem)
        picgoCommonData.isUploadLoading = false

        reloadPage()
      } catch (e) {
        picgoCommonData.isUploadLoading = false

        ElMessage({
          type: "error",
          message: t("main.opt.failure") + "=>" + e,
        })
        logger.error(t("main.opt.failure") + "=>" + e)
      }
    },

    /**
     * 单个传，否则无法将图片对应
     * @param imageItem
     */
    doUploadImagesToBed: async (imageItem: ImageItem) => {
      const pageId = await getPageId(true, props.pageId)
      const attrs = await siyuanApi.getBlockAttrs(pageId)

      const mapInfoStr = attrs[CONSTANTS.PICGO_FILE_MAP_KEY] ?? "{}"
      const fileMap = parseJSONObj(mapInfoStr)
      logger.warn("fileMap=>", fileMap)

      // 处理上传
      const filePaths = []
      if (!imageItem.isLocal) {
        logger.warn("非本地图片，忽略=>", imageItem.url)
        return
      }

      let imageFullPath
      if (isElectron) {
        const imagePath = imageItem.originUrl.substring(
          imageItem.originUrl.indexOf("assets"),
          imageItem.originUrl.length
        )
        const dataDir: string = getSiyuanNewWinDataDir()
        imageFullPath = `${dataDir}/${imagePath}`

        // 不存在就用网页url
        if (!isFileExist(imageFullPath)) {
          imageFullPath = imageItem.url
        }
      } else {
        imageFullPath = imageItem.url
      }
      logger.warn(
        "isElectron=>" + isElectron + ", imageFullPath=>",
        imageFullPath
      )
      filePaths.push(imageFullPath)

      // 批量上传
      const imageJson: any = await uploadByPicGO(filePaths)
      logger.warn("图片上传完成，imageJson=>", imageJson)
      const imageJsonObj = JSON.parse(imageJson)
      // 处理后续
      if (imageJsonObj && imageJsonObj.length > 0) {
        const img = imageJsonObj[0]
        const newImageItem = new ImageItem(
          imageItem.originUrl,
          img.imgUrl,
          false
        )
        fileMap[newImageItem.hash] = newImageItem
      }

      logger.warn("newFileMap=>", fileMap)

      const newFileMapStr = toJSONString(fileMap)
      await siyuanApi.setBlockAttrs(pageId, {
        [CONSTANTS.PICGO_FILE_MAP_KEY]: newFileMapStr,
      })
    },

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
