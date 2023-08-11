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

import { PicgoPostApi } from "siyuan-plugin-picgo"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { ElMessage } from "element-plus"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { StrUtil } from "zhi-common"

/**
 * Picgo 桥接 API，用于上传并替换图片链接
 *
 * @author terwer
 * @since 1.6.1
 */
const usePicgoBridge = () => {
  const logger = createAppLogger("use-picgo-bridge")
  const { t } = useVueI18n()
  const { kernelApi, blogApi } = useSiyuanApi()
  const picgoPostApi = new PicgoPostApi(kernelApi)

  /**
   * 处理图片上传与替换
   *
   * @param pageId - 页面ID
   * @param mdContent - 正文，如果为空，会用 pageId 去获取最新
   */
  const handlePicgo = async (pageId: string, mdContent?: string) => {
    let md: string = mdContent

    try {
      const attrs = await kernelApi.getBlockAttrs(pageId)
      const siyuanData = {
        pageId: pageId,
        meta: attrs,
      }

      if (StrUtil.isEmptyString(md)) {
        // 思源笔记原始文章数据
        const siyuanPost = await blogApi.getPost(pageId)
        md = siyuanPost.markdown
      }

      const picgoPostResult = await picgoPostApi.uploadPostImagesToBed(siyuanData.pageId, siyuanData.meta, md)
      // 有图片才上传
      if (picgoPostResult.hasImages) {
        if (picgoPostResult.flag) {
          md = picgoPostResult.mdContent
        } else {
          logger.warn(t("github.post.picgo.picbed.error") + "=>" + picgoPostResult.errmsg)
          ElMessage.warning(t("github.post.picgo.picbed.error") + "=>" + picgoPostResult.errmsg)
        }
      } else {
        logger.info(t("github.post.picgo.picbed.error") + "=>" + picgoPostResult.errmsg)
      }
    } catch (e) {
      logger.error(t("github.post.picgo.picbed.error") + "=>", e)
      ElMessage.error(t("github.post.picgo.picbed.error") + "=>" + e)
    }

    return md
  }

  return {
    handlePicgo,
  }
}

export { usePicgoBridge }
