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

import { reactive } from "vue"
import { LogFactory } from "~/utils/logUtil"
import { mdToHtml, parseHtml, removeH1 } from "~/utils/htmlUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { ElMessage } from "element-plus"
import { useI18n } from "vue-i18n"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { getPublishCfg } from "~/utils/publishUtil"
import { appendStr } from "~/utils/strUtil"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import { SiyuanDataObj } from "~/utils/models/siyuanDataObj"
import { PostForm } from "~/utils/models/postForm"

/**
 * 摘要组件
 */
export const useDesc = (props, deps?: any) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/makeDescCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  // public data
  const descData = reactive({
    isDescLoading: false,
    desc: "",
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods

  // public methods
  const descMethods = {
    makeDesc: async (hideTip?: boolean) => {
      logger.debug("准备生成摘要...")
      descData.isDescLoading = true
      try {
        const publishCfg = getPublishCfg()
        // 获取最新属性
        const pageId = await siyuanPageMethods.getPageId()

        const data = await siyuanApi.exportMdContent(pageId)
        const md = data.content
        let html = mdToHtml(md)
        if (publishCfg.removeH1) {
          html = removeH1(html)
        }
        descData.desc = parseHtml(html, CONSTANTS.MAX_PREVIEW_LENGTH, true)

        // 保存属性到思源
        const customAttr = {
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]:
            descData.desc,
        }
        await siyuanApi.setBlockAttrs(pageId, customAttr)

        if (hideTip !== true) {
          ElMessage.success(t("main.opt.success"))
        }
      } catch (e) {
        if (hideTip !== true) {
          ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
        }
      }

      descData.isDescLoading = false
      logger.debug("摘要生成完毕.")
    },

    getDescData: () => {
      return descData
    },

    /**
     * 初始化
     * @param siyuanData
     */
    initDesc: (siyuanData: SiyuanDataObj) => {
      const descKey = SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY
      descData.desc = siyuanData.meta[descKey]
    },

    /**
     * 同步FormData到属性
     * @param postForm
     */
    syncDesc: (postForm: PostForm) => {
      descData.desc = postForm.formData.desc
    },
  }

  return {
    descData,
    descMethods,
  }
}
