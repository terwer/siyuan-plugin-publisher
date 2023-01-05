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

import { onMounted, watch } from "vue"
import { LogFactory } from "~/utils/logUtil"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { ImageParser } from "~/utils/parser/imageParser"
import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"
import { pathJoin } from "~/utils/util"

/**
 * Picgo页面初始化组件
 */
export const usePicgoInitPage = (props, deps) => {
  // private data
  const logger = LogFactory.getLogger("composables/picgo/picgoInitPageCom.ts")
  const siyuanApi = new SiYuanApi()
  const imageParser = new ImageParser()

  // deps
  const picgoCommonMethods = deps.picgoCommonMethods

  // deps data
  const picgoCommonData = picgoCommonMethods.getPicgoCommonData()

  // private methods
  const initPage = async () => {
    const pageId = await getPageId(true, props.pageId)
    const imageBlocks = await siyuanApi.getImageBlocksByID(pageId)
    logger.debug("查询文章中的图片块=>", imageBlocks)

    if (!imageBlocks || imageBlocks.length === 0) {
      return
    }

    // 解析图片地址
    let retImgs = []
    imageBlocks.forEach((page) => {
      const parsedImages = imageParser.parseImagesToArray(page.markdown)

      // 会有很多重复值
      // retImgs = retImgs.concat(retImgs, parsedImages)
      // 下面的写法可以去重
      retImgs = [...new Set([...retImgs, ...parsedImages])]
    })
    logger.debug("解析出来的所有的图片地址=>", retImgs)

    retImgs.forEach((retImg) => {
      let isLocal = false
      let imgUrl = retImg
      if (!(imgUrl.indexOf("http") > -1) && imgUrl.indexOf("assets") > -1) {
        const baseUrl = getSiyuanCfg().baseUrl
        imgUrl = pathJoin(baseUrl, "/" + imgUrl)
        isLocal = true
      }

      const imageItem = {
        name: imgUrl.substring(imgUrl.lastIndexOf("/") + 1),
        url: imgUrl,
        isLocal,
      }

      logger.debug("imageItem=>", imageItem)
      picgoCommonData.fileList.files.push(imageItem)
    })
  }

  /**
   * 监听props
   */
  watch(
    () => props.pageId,
    async () => {
      await initPage()
      logger.debug("Picgo初始化")
    }
  )

  onMounted(async () => {
    await initPage()
  })
}
