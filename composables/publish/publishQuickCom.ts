/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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
import { reloadPage } from "~/utils/browserUtil"
import { isEmptyString } from "~/utils/util"

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
    /**
     * 是否操作过一键生成
     */
    onclickFlag: false,
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods
  const slugMethods = deps.slugMethods
  const descMethods = deps.descMethods
  const tagMethods = deps.tagMethods
  const githubPagesMethods = deps.githubPagesMethods

  // public methods
  const quickMethods = {
    oneclickAttr: async (hideTip?: boolean) => {
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

          // 一键生成属性
          await quickMethods.doOneclickAttr()
          reloadPage()

          quickData.isGenLoading = false
          logger.debug("一键生成属性完成.")
          if (hideTip !== true) {
            ElMessage.success(t("main.publish.oneclick.attr.finish"))
          }
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
    doOneclickAttr: async () => {
      await slugMethods.makeSlug(true)
      await descMethods.makeDesc(true)
      await tagMethods.fetchTag(true)

      // 发布属性
      await quickMethods.saveAttrToSiyuan(true)

      quickData.onclickFlag = true
      logger.debug("发布属性完成")
    },
    saveAttrToSiyuan: async (hideTip?: boolean) => {
      try {
        // 保存属性到思源
        const slugData = slugMethods.getSlugData()
        const descData = descMethods.getDescData()
        const tagData = tagMethods.getTagData()
        const githubPagesData = githubPagesMethods.getGithubPagesData()

        let customAttr = {
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]:
            slugData.customSlug,
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]:
            descData.desc,
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_USE_PERMALINK_KEY]:
            githubPagesData.usePermalink.toString(),
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_USE_DATE_KEY]:
            githubPagesData.useDate.toString(),
          tags: tagData.join(","),
        }

        if (!isEmptyString(githubPagesData.linkTitle)) {
          customAttr = Object.assign(customAttr, {
            [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_MENU_TITLE_KEY]:
              githubPagesData.linkTitle,
          })
        }

        const weight = parseInt(githubPagesData.weight)
        if (weight > 0) {
          customAttr = Object.assign(customAttr, {
            [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_WEIGHT_KEY]: weight,
          })
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

    getQuickData: () => {
      return quickData
    },
  }

  return {
    quickData,
    quickMethods,
  }
}
