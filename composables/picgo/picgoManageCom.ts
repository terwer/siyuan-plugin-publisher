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
  reloadPage,
} from "~/utils/browserUtil"
import { reactive } from "vue"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { LogFactory } from "~/utils/logUtil"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { ImageItem } from "~/utils/models/imageItem"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { PicgoPostApi } from "~/utils/platform/picgo/picgoPostApi"

/**
 * Picgo图片管理组件
 */
export const usePicgoManage = (props, deps) => {
  // private data
  const logger = LogFactory.getLogger("composables/picgo/picgoManageCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  const picgoPostApi = new PicgoPostApi()

  // public data
  const picgoManageData = reactive({
    dialogImageUrl: "",
    dialogPreviewVisible: false,
  })

  // deps
  const picgoCommonMethods = deps.picgoCommonMethods
  // const picgoInitMethods = deps.picgoInitMethods

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

        picgoCommonData.isUploadLoading = false
        if (!hasLocalImages) {
          ElMessage.warning("未发现本地图片，不上传")
        } else {
          ElMessage.success("图片已经全部上传至图床，即将刷新页面")
          reloadPage()
        }
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
        ElMessageBox.confirm(
          "已经是远程图片，是否仍然覆盖上传？",
          t("main.opt.warning"),
          {
            confirmButtonText: t("main.opt.ok"),
            cancelButtonText: t("main.opt.cancel"),
            type: "warning",
          }
        )
          .then(async () => {
            try {
              await picgoManageMethods.doUploadImagesToBed(imageItem, true)
              picgoCommonData.isUploadLoading = false

              ElMessage.success("图片已经成功上传至图床，即将刷新页面")
              reloadPage()
            } catch (e) {
              picgoCommonData.isUploadLoading = false

              ElMessage({
                type: "error",
                message: t("main.opt.failure") + "=>" + e,
              })
              logger.error(t("main.opt.failure") + "=>" + e)
            }
          })
          .catch((e) => {
            picgoCommonData.isUploadLoading = false

            if (e.toString().indexOf("cancel") <= -1) {
              ElMessage({
                type: "error",
                message: t("main.opt.failure") + "，图片上传异常=>" + e,
              })
              logger.error(t("main.opt.failure") + "=>" + e)
            }
          })
      } else {
        try {
          await picgoManageMethods.doUploadImagesToBed(imageItem)
          picgoCommonData.isUploadLoading = false

          ElMessage.success("图片已经成功上传至图床，即将刷新页面")
          reloadPage()
        } catch (e) {
          picgoCommonData.isUploadLoading = false

          ElMessage({
            type: "error",
            message: t("main.opt.failure") + "=>" + e,
          })
          logger.error(t("main.opt.failure") + "=>" + e)
        }

        picgoCommonData.isUploadLoading = false
      }
    },

    /**
     * 单个传，否则无法将图片对应
     * @param imageItem
     * @param forceUpload 强制上传
     */
    doUploadImagesToBed: async (
      imageItem: ImageItem,
      forceUpload?: boolean
    ) => {
      const pageId = await getPageId(true, props.pageId)
      const attrs = await siyuanApi.getBlockAttrs(pageId)

      await picgoPostApi.uploadSingleImageToBed(
        pageId,
        attrs,
        imageItem,
        forceUpload
      )
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
