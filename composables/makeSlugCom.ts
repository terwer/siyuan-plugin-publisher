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
import { ElMessage } from "element-plus"
import { appendStr, mdFileToTitle } from "~/utils/strUtil"
import { isEmptyString, pingyinSlugify, zhSlugify } from "~/utils/util"
import shortHash from "shorthash2"
import { useI18n } from "vue-i18n"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { LogFactory } from "~/utils/logUtil"
import { getPublishCfg } from "~/utils/publishUtil"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"

/**
 * 文章别名组件
 * @param defaultPageId 默认页面ID
 * @param siyuanApi 思源Api
 */
export const useSlug = (defaultPageId: string, siyuanApi: SiYuanApi) => {
  const logger = LogFactory.getLogger("composables/makeSlugCom.ts")
  const { t } = useI18n()
  const slugData = reactive({
    isSlugLoading: false,
    forceRefresh: false,
    customSlug: "",
    slugHashEnabled: true,
  })

  function checkForce() {
    // 空值跳过
    if (isEmptyString(slugData.customSlug)) {
      return true
    }

    // 别名不为空，根据用户操作判断
    return slugData.forceRefresh
  }

  async function makeSlug(hideTip?: any) {
    if (!checkForce()) {
      if (hideTip !== true) {
        ElMessage.warning(t("main.force.refresh.tip"))
      }
      return
    }

    slugData.isSlugLoading = true

    try {
      const publishCfg = getPublishCfg()
      // 获取最新属性
      const pageId = await getPageId(true, defaultPageId)
      if (!pageId || pageId === "") {
        slugData.isSlugLoading = false

        logger.error(t("page.no.id"))
        ElMessage.error(t("page.no.id"))
        return
      }
      const page = await siyuanApi.getBlockByID(pageId)

      // 标题处理
      let fmtTitle = page.content
      if (publishCfg.fixTitle) {
        fmtTitle = mdFileToTitle(fmtTitle)
      }

      // 生成别名
      if (publishCfg.useGoogleTranslate) {
        // 先调用谷歌API，如果失败就用拼音代替
        try {
          // 调用Google翻译API
          const result = await zhSlugify(fmtTitle)
          if (result) {
            slugData.customSlug = result
          } else {
            slugData.customSlug = await pingyinSlugify(fmtTitle)
            ElMessage.success(t("main.opt.failure"))
          }
        } catch (e) {
          slugData.customSlug = await pingyinSlugify(fmtTitle)
        }
      } else {
        slugData.customSlug = await pingyinSlugify(fmtTitle)
      }

      // 添加hash
      if (slugData.slugHashEnabled) {
        const newstr = page.content + new Date().toISOString()
        const hashstr = appendStr("-", shortHash(newstr).toLowerCase())
        slugData.customSlug += hashstr
      }

      // 保存别名属性到思源
      const customAttr = {
        [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]:
          slugData.customSlug,
      }
      await siyuanApi.setBlockAttrs(pageId, customAttr)

      if (hideTip !== true) {
        ElMessage.success(t("main.opt.success"))
      }
    } catch (e) {
      if (hideTip !== true) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        logger.error(errmsg)
        ElMessage.error(errmsg)
      }
    }

    // 结束
    slugData.isSlugLoading = false
  }

  /**
   * 初始化
   * @param slug
   */
  function initSlug(slug: string) {
    slugData.customSlug = slug
  }

  return {
    slugData,
    makeSlug,
    initSlug,
  }
}
