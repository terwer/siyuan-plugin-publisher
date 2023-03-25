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
import { getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"
import { doOpenExportWin } from "~/utils/otherlib/siyuanBrowserUtil"
import { goToPage } from "~/utils/otherlib/ChromeUtil"
import { ElMessage } from "element-plus"
import { appendStr } from "~/utils/strUtil"
import { LogFactory } from "~/utils/logUtil"
import { useI18n } from "vue-i18n"

/**
 * Picgo的文章组件
 * @author terwer
 * @since 0.6.1
 */
export const usePicgoPost = () => {
  // private data
  const logger = LogFactory.getLogger("composables/picgo/import/picgoPostCom.ts")
  const { t } = useI18n()
  // public data
  const picgoPostData = reactive({
    picgoEnabled: false,
  })

  // public methods
  const picgoPostMethods = {
    picgoOnChange: (val: boolean) => {
      // Github开启状态同步给其他地方用
      picgoPostData.picgoEnabled = val
    },
    handlePicgoManage: async (pageId) => {
      try {
        let syPageId
        if (pageId instanceof Promise) {
          syPageId = await pageId
        } else {
          syPageId = pageId
        }
        const widgetResult = getWidgetId()
        if (widgetResult.isInSiyuan) {
          await doOpenExportWin(syPageId, "picgo/index.html")
        } else {
          goToPage("/picgo/index.html?id=" + syPageId)
        }
      } catch (e) {
        logger.error(t("main.opt.failure"), "=>", e)
        ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
      }
    },
    initPicgo: (val: boolean) => {
      picgoPostData.picgoEnabled = val
    },

    getPicgoPostData: () => {
      return picgoPostData
    },
  }

  return {
    picgoPostData,
    picgoPostMethods,
  }
}
