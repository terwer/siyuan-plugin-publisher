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
import { SiyuanDataObj } from "~/utils/models/siyuanDataObj"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"

/**
 * 思源笔记页面数据处理组件
 * @author terwer
 * @since 0.1.0
 */
export const useSiyuanPage = (props) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/siyuanPageCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  // public data
  const siyuanPageData = reactive({
    dataObj: new SiyuanDataObj(),
  })

  // public methods
  const siyuanPageMethods = {
    getPageId: async (): Promise<string> => {
      // 获取最新属性
      const pageId = await getPageId(true, props.pageId)

      if (!pageId || pageId === "") {
        logger.error(t("page.no.id"))
        throw new Error("page.no.id")
      }
      logger.debug("当前页面ID为=>", pageId)
      return pageId
    },

    getSiyuanPageData: () => {
      return siyuanPageData
    },

    initSiyuanPage: async (pageId: string) => {
      // 思源笔记数据
      siyuanPageData.dataObj.pageId = pageId
      siyuanPageData.dataObj.meta = await siyuanApi.getBlockAttrs(pageId)
      siyuanPageData.dataObj.page = await siyuanApi.getBlockByID(pageId)
      siyuanPageData.dataObj.content = await siyuanApi.exportMdContent(pageId)
    },
  }

  return {
    siyuanPageData,
    siyuanPageMethods,
  }
}
