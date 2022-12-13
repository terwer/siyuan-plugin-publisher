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
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { appendStr } from "~/utils/strUtil"

/**
 * 快捷操作组件
 */
export const useQuick = (props, deps?: any) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/publishQuickCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  // publish data
  const quickData = reactive({
    isGenLoading: false,
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods
  const slugMethods = deps.slugMethods
  const descMethods = deps.descMethods
  const tagMethods = deps.tagMethods

  // public methods
  const quickMethods = {
    oneclickAttr: async () => {
      ElMessageBox.confirm(
        t("main.opt.onclick.confirm.tip"),
        t("main.opt.warning"),
        {
          confirmButtonText: t("main.opt.ok"),
          cancelButtonText: t("main.opt.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          quickData.isGenLoading = true

          await slugMethods.makeSlug(true)
          await descMethods.makeDesc(true)
          await tagMethods.fetchTag(true)

          quickData.isGenLoading = false
          logger.debug("一键生成属性完成.")
          ElMessage.success(t("main.opt.success"))
        })
        .catch((e) => {
          quickData.isGenLoading = false

          if (e.toString().indexOf("cancel") <= -1) {
            ElMessage({
              type: "error",
              message: t("main.opt.failure") + "=>" + e,
            })
            logger.error(t("main.opt.failure") + "=>" + e)
          }
        })
    },
    saveAttrToSiyuan: async (hideTip?: boolean) => {
      try {
        // 保存属性到思源
        const slugData = slugMethods.getSlugData()
        const descData = descMethods.getDescData()
        const tagData = tagMethods.getTagData()
        const customAttr = {
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]:
            slugData.customSlug,
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]:
            descData.desc,
          tags: tagData.join(","),
        }

        // 获取最新属性
        const pageId = await siyuanPageMethods.getPageId()
        await siyuanApi.setBlockAttrs(pageId, customAttr)

        if (hideTip !== true) {
          ElMessage.success(t("main.opt.success"))
        }
      } catch (e) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        if (hideTip !== true) {
          ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
        }
        logger.error(errmsg)
      }
    },
  }

  return {
    quickData,
    quickMethods,
  }
}
