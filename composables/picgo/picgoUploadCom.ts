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

import { reactive } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { isInSiyuanWidget } from "~/utils/platform/siyuan/siyuanUtil"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { isElectron } from "~/utils/browserUtil"
import { ImageItem } from "~/utils/models/imageItem"

/**
 * Picgo上传组件
 */
export const usePicgoUpload = (props, deps, refs) => {
  // private data
  const logger = LogFactory.getLogger("composables/picgo/picgoUploadCom.ts")
  const { t } = useI18n()

  // public data
  const picgoUploadData = reactive({
    dialogPicgoSettingFormVisible: false,
  })

  // deps
  const picgoCommonMethods = deps.picgoCommonMethods

  // deps data
  const picgoCommonData = picgoCommonMethods.getPicgoCommonData()

  // refs
  const refSelectedFiles = refs.refSelectedFiles

  // private methods
  /**
   * 处理图片后续
   * @param imgInfos
   */
  const doAfterUpload = (imgInfos) => {
    let imageJson
    if (typeof imgInfos == "string") {
      logger.warn("doAfterUpload返回的是字符串，需要解析")
      imageJson = JSON.parse(imgInfos)
    } else {
      imageJson = imgInfos
    }

    picgoCommonData.loggerMsg = JSON.stringify(imgInfos)
    logger.debug("doAfterUpload,imgInfos=>", imgInfos)

    if (imageJson && imageJson.length > 0) {
      imageJson.forEach((img) => {
        const rtnItem = new ImageItem(img.imgUrl, img.imgUrl, false)
        picgoCommonData.loggerMsg += "\nnewItem=>" + JSON.stringify(rtnItem)

        picgoCommonData.fileList.files.push(rtnItem)
      })
    }
    ElMessage.success(t("main.opt.success"))
  }

  // public methods
  const picgoUploadMethods = {
    handlePicgoSetting: async () => {
      if (picgoCommonData.showDebugMsg) {
        picgoUploadData.dialogPicgoSettingFormVisible = true
        return
      }

      if (!isElectron) {
        await ElMessageBox.alert(
          t("picgo.pic.setting.no.tip"),
          t("main.opt.tip"),
          {
            confirmButtonText: t("main.opt.ok"),
          }
        )
        return
      }

      picgoUploadData.dialogPicgoSettingFormVisible = true
    },
    bindFileControl: () => {
      refSelectedFiles.value.click()
    },
    doUploadPicSelected: async (event) => {
      picgoCommonData.isUploadLoading = true

      try {
        const fileList = event.target.files

        console.log("onRequest fileList=>", fileList)
        if (!fileList || fileList.length === 0) {
          ElMessage.error("请选择图片")
          picgoCommonData.isUploadLoading = false
          return
        }

        if (!isInSiyuanWidget() && !isInSiyuanNewWinBrowser()) {
          ElMessage.error("非electron环境只能通过剪贴板上传")
          picgoCommonData.isUploadLoading = false
          return
        }

        // 获取选择的文件的路径数组
        const filePaths = []
        for (let i = 0; i < fileList.length; i++) {
          // const tmppath = URL.createObjectURL(fileList[i])
          // logger.debug("tmppath=>", tmppath)
          //
          // const base64 = await readBase64FromFile(fileList[i])
          // logger.debug("base64=>", base64)

          if (fileList.item(i).path) {
            filePaths.push(fileList.item(i).path)
            logger.debug("路径不为空")
          } else {
            // const base64Obj = {
            //   base64Image: base64,
            //   fileName: fileList.item(i).name, // 图片的文件名
            //   width: "200", // 图片宽度
            //   height: "200", // 图片高度
            //   extname: ".png", // 图片格式的扩展名 比如.jpg | .png
            // }
            logger.debug("路径为空，忽略")
            // filePaths.push(base64Obj)
          }
        }

        const imgInfos = await picgoUtil.uploadByPicGO(filePaths)
        // 处理后续
        doAfterUpload(imgInfos)

        picgoCommonData.isUploadLoading = false
      } catch (e) {
        if (e.toString().indexOf("cancel") <= -1) {
          ElMessage({
            type: "error",
            message: t("main.opt.failure") + "=>" + e,
          })
          logger.error(t("main.opt.failure") + "=>" + e)
        }
        picgoCommonData.isUploadLoading = false
      }
    },
    doUploadPicFromClipboard: async () => {
      picgoCommonData.isUploadLoading = true

      try {
        const imgInfos = await picgoUtil.uploadByPicGO()
        // 处理后续
        doAfterUpload(imgInfos)

        picgoCommonData.isUploadLoading = false
      } catch (e) {
        if (e.toString().indexOf("cancel") <= -1) {
          ElMessage({
            type: "error",
            message: t("main.opt.failure") + "=>" + e,
          })
          logger.error(t("main.opt.failure") + "=>", e)
        }
        picgoCommonData.isUploadLoading = false
      }
    },
  }

  return {
    picgoUploadData,
    picgoUploadMethods,
  }
}
