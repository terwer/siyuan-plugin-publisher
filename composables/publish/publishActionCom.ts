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
import { getJSONConf } from "~/utils/configUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { GithubApi } from "~/utils/platform/github/githubApi"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"

/**
 * 通用的发布操作组件
 * @author terwer
 * @since 0.1.0
 */
export const usePublish = (props, deps?: any) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/publishActionCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  // public data
  const publishData = reactive({
    isPublishLoading: false,
    isCancelLoading: false,
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods
  const githubPagesMethods = deps.githubPagesMethods
  const initPublishMethods = deps.initPublishMethods

  // public methods
  const publishMethods = {
    doPublish: async () => {
      logger.debug("准备发布文章...")
    },
    cancelPublish: async () => {
      logger.debug("准备取消文章发布...")
      publishData.isCancelLoading = true

      ElMessageBox.confirm(t("main.opt.warning.tip"), t("main.opt.warning"), {
        confirmButtonText: t("main.opt.ok"),
        cancelButtonText: t("main.opt.cancel"),
        type: "warning",
      })
        .then(async () => {
          await publishMethods.doCancel(true)
          publishData.isCancelLoading = false
          ElMessage.warning(t("main.opt.status.cancel"))
        })
        .catch(() => {
          // ElMessage({
          //   type: 'error',
          //   message: t("main.opt.failure"),
          // })
          publishData.isCancelLoading = false
        })
    },
    doCancel: async (isInit: boolean) => {
      const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
      const api = new GithubApi(githubCfg)

      const docPath = githubPagesMethods.getGithubPagesData().publishPath
      logger.debug("准备取消发布，docPath=>", docPath)

      await api.deleteGithubPage(docPath)

      const customAttr = {
        [githubCfg.posidKey]: "",
      }
      // 获取最新属性
      const pageId = await siyuanPageMethods.getPageId()
      await siyuanApi.setBlockAttrs(pageId, customAttr)
      logger.debug(props.apiType + "_Main取消发布,meta=>", customAttr)

      // 刷新属性数据
      if (isInit) {
        await initPublishMethods.initPage()
      }
    },
  }

  return {
    publishData,
    publishMethods,
  }
}
