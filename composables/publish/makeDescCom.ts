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
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { appendStr } from "~/utils/strUtil"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"

/**
 * 摘要组件
 */
export const useDesc = (defaultPageId: string, siyuanApi: SiYuanApi) => {
  const logger = LogFactory.getLogger("composables/makeDescCom.ts")
  const { t } = useI18n()
  const descData = reactive({
    isDescLoading: false,
    desc: "",
  })

  const descMethods = {
    makeDesc: async (hideTips?: boolean) => {
      logger.debug("准备生成摘要...")
      descData.isDescLoading = true
      try {
        const publishCfg = getPublishCfg()
        // 获取最新属性
        const pageId = await getPageId(true, defaultPageId)

        if (!pageId || pageId === "") {
          descData.isDescLoading = false

          logger.error(t("page.no.id"))
          ElMessage.error(t("page.no.id"))
          return
        }
        logger.debug("当前页面ID为=>", pageId)

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

        if (hideTips !== true) {
          ElMessage.success(t("main.opt.success"))
        }
      } catch (e) {
        if (hideTips !== true) {
          ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
        }
      }

      descData.isDescLoading = false
      logger.debug("摘要生成完毕.")
    },

    /**
     * 初始化
     * @param desc
     */
    initDesc: (desc: string) => {
      descData.desc = desc
    },
  }

  return {
    descData,
    descMethods,
  }
}
