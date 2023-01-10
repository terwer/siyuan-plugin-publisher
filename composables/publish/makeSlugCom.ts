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
import * as util from "~/utils/util"
import { isEmptyString } from "~/utils/util"
import shortHash from "shorthash2"
import { useI18n } from "vue-i18n"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { LogFactory } from "~/utils/logUtil"
import { getPublishCfg } from "~/utils/publishUtil"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import { commonIsTest } from "~/utils/common/commonEnv"
import { getConf } from "~/utils/configUtil"
import { TEST_CONSTANTS } from "~/test/TEST_CONSTANTS"
import { SiyuanDataObj } from "~/utils/models/siyuanDataObj"
import { PostForm } from "~/utils/models/postForm"

/**
 * 文章别名组件
 * @param props 页面属性
 * @param deps 依赖的组件
 */
export const useSlug = (props, deps) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/makeSlugCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  const publishCfg = getPublishCfg()
  // public data
  const slugData = reactive({
    isSlugLoading: false,
    forceRefresh: false,
    title: "",
    customSlug: "",
    slugHashEnabled: true,
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods

  // private methods
  const checkForce = () => {
    // 空值跳过
    if (util.isEmptyString(slugData.customSlug)) {
      return true
    }

    // 别名不为空，根据用户操作判断
    return slugData.forceRefresh
  }

  // public methods
  const slugMethods = {
    makeSlug: async (hideTip?: any) => {
      if (!checkForce()) {
        if (hideTip !== true) {
          ElMessage.warning(t("main.force.refresh.tip"))
        }
        logger.debug(t("main.force.refresh.tip"))
        return
      }

      slugData.isSlugLoading = true
      logger.debug("开始生成别名...")

      try {
        // 获取最新属性
        const pageId = await siyuanPageMethods.getPageId()

        // =====================
        // == Test Mock Start ==
        if (commonIsTest) {
          const pageStr = getConf(TEST_CONSTANTS.CONSTANTS_SIYUAN_PAGE)
          const pageObj = JSON.parse(JSON.parse(pageStr))
          vi.spyOn(siyuanApi, "getBlockByID").mockResolvedValue(pageObj)
        }
        // == Test Mock End ==
        // =====================
        const page = await siyuanApi.getBlockByID(pageId)
        logger.debug("获取到思源页面数据=>", page)

        // 标题已经处理
        const fmtTitle = slugData.title
        // 生成别名
        if (publishCfg.useGoogleTranslate) {
          // 先调用谷歌API，如果失败就用拼音代替
          try {
            let result
            // 调用Google翻译API
            if (commonIsTest) {
              const mock_zhSlugify = vi
                .fn()
                .mockImplementation((q: string) => util.pinyinSlugify(q))
              result = await mock_zhSlugify(fmtTitle)
            } else {
              result = await util.zhSlugify(fmtTitle)
            }
            logger.debug("使用谷歌翻译")

            if (result) {
              slugData.customSlug = result
            } else {
              slugData.customSlug = util.pinyinSlugify(fmtTitle)
              ElMessage.success(t("main.opt.failure"))
            }
          } catch (e) {
            slugData.customSlug = util.pinyinSlugify(fmtTitle)
          }
        } else {
          slugData.customSlug = util.pinyinSlugify(fmtTitle)
        }
        logger.debug("完成别名翻译")

        // 添加hash
        if (slugData.slugHashEnabled) {
          const newstr = page.content + new Date().toISOString()
          const hashstr = appendStr("-", shortHash(newstr).toLowerCase())
          slugData.customSlug += hashstr
          logger.debug("为别名添加hash")
        }

        // 保存别名属性到思源
        const customAttr = {
          [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]:
            slugData.customSlug,
        }

        // =====================
        // == Test Mock Start ==
        if (commonIsTest) {
          vi.spyOn(siyuanApi, "setBlockAttrs").mockResolvedValue(undefined)
        }
        // == Test Mock End ==
        // =====================
        await siyuanApi.setBlockAttrs(pageId, customAttr)

        if (hideTip !== true) {
          ElMessage.success(t("main.opt.success"))
        }
        logger.info("生成别名正常完成,slugData=>", slugData)
      } catch (e) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        if (hideTip !== true) {
          ElMessage.error(errmsg)
        }
        logger.error(errmsg)
      }

      // 结束
      slugData.isSlugLoading = false
      logger.debug("生成别名结束.")
    },

    getSlugData: () => {
      return slugData
    },

    /**
     * 别名是否为空
     */
    isSlugEmpty: () => {
      return isEmptyString(slugData.customSlug)
    },

    /**
     * 初始化
     * @param siyuanData
     */
    initSlug: (siyuanData: SiyuanDataObj) => {
      // 标题处理
      let fmtTitle = siyuanData.page.content
      if (publishCfg.fixTitle) {
        fmtTitle = mdFileToTitle(fmtTitle)
      }
      logger.debug("标题处理完毕")
      slugData.title = fmtTitle
      const slugKey = SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY
      slugData.customSlug = siyuanData.meta[slugKey]

      logger.debug("initSlug=>", slugData)
    },

    /**
     * 同步FormData到属性
     * @param postForm
     */
    syncSlug: (postForm: PostForm) => {
      slugData.title = postForm.formData.title
      slugData.customSlug = postForm.formData.customSlug
    },
  }

  return {
    slugData,
    slugMethods,
  }
}
