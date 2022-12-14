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
import { appendStr } from "~/utils/strUtil"
import { removeTitleNumber } from "~/utils/htmlUtil"
import { isEmptyString } from "~/utils/util"

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
  const yamlMethods = deps.yamlMethods
  const githubPagesMethods = deps.githubPagesMethods
  const quickMethods = deps.quickMethods
  const initPublishMethods = deps.initPublishMethods

  // public methods
  const publishMethods = {
    doPublish: async () => {
      logger.debug("准备发布文章...")
      publishData.isPublishLoading = true
      try {
        const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
        const api = new GithubApi(githubCfg)

        // 先删除
        // if (initPublishMethods.getInitPublishData().isPublished) {
        try {
          await publishMethods.doCancel(false)
        } catch (e) {
          logger.error("强制删除异常，不影响发布=>", e)
        }
        // }

        // 校验标题
        const mdTitle = githubPagesMethods.getGithubPagesData().mdTitle
        let fmtTitle = removeTitleNumber(mdTitle)
        fmtTitle = fmtTitle.replace(/\.md/g, "")
        if (/[\s*|\\.]/g.test(fmtTitle)) {
          logger.debug("fmtTitle=>", fmtTitle)
          ElMessage.error("文件名不能包含空格或者特殊字符")
          publishData.isPublishLoading = false
          return
        }

        // 未发布过生成属性，更新的时候不重复生成
        if (!initPublishMethods.getInitPublishData().isPublished) {
          // 未发布阶段，没有生成过
          if (!quickMethods.getQuickData().onclickFlag) {
            // 这里面会自动保存
            await quickMethods.doOneclickAttr()
          } else {
            // 生成过了，如果有修改，直接保存即可
            await quickMethods.saveAttrToSiyuan(true)
          }

          // 这里初始化一下页面，防止某些属性没有的情况
          await initPublishMethods.initPage()
        } else {
          // 更新的时候，自动保存属性到思源
          await quickMethods.saveAttrToSiyuan(true)
        }

        // 根据选项决定是否发送到Github参考
        const isOk = githubCfg.apiStatus
        // api不可用但是开启了发布
        if (!isOk && githubPagesMethods.getGithubPagesData().githubEnabled) {
          publishData.isPublishLoading = false
          ElMessage.error(
            "检测到api不可用或者配置错误，无法发布到Github，请转到源码模式自行复制文本"
          )
          return
        } else if (
          isOk &&
          githubPagesMethods.getGithubPagesData().githubEnabled
        ) {
          // api可用并且开启了发布
          logger.debug("开始真正调用api发布到Github")

          // 发布路径
          let docPath = githubPagesMethods.getGithubPagesData().publishPath
          // 生成YAML+MD的发布内容
          initPublishMethods.convertAttrToYAML(true)
          const mdFullContent = yamlMethods.getYamlData().mdFullContent
          logger.debug("即将发布的内容，mdContent=>", { mdFullContent })

          // 发布
          const res = await api.publishGithubPage(docPath, mdFullContent)

          // 成功与失败都刷新页面
          if (!res) {
            publishData.isPublishLoading = false

            // 刷新属性数据
            await initPublishMethods.initPage()
            // 发布失败
            ElMessage.error(t("main.publish.vuepress.failure"))
            return
          }

          // 这里是发布成功之后
          const customAttr = {
            [githubCfg.posidKey]: docPath,
          }
          // 获取最新属性
          const pageId = await siyuanPageMethods.getPageId()
          await siyuanApi.setBlockAttrs(pageId, customAttr)
          logger.debug("VuepressMain发布成功，保存路径,meta=>", customAttr)

          // 刷新属性数据
          await initPublishMethods.initPage()
          publishData.isPublishLoading = false
        }
        logger.debug("文章发布完成.")
        if (initPublishMethods.getInitPublishData().isPublished) {
          ElMessage.success(t("main.opt.status.updated"))
        } else {
          ElMessage.success(t("main.opt.status.publish"))
        }
      } catch (e) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        ElMessage.error(errmsg)
        logger.error(errmsg)
      }

      publishData.isPublishLoading = false
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
        .catch((e) => {
          if (e.toString().indexOf("cancel") <= -1) {
            ElMessage({
              type: "error",
              message: t("main.opt.failure") + "=>" + e,
            })
            logger.error(t("main.opt.failure") + "=>" + e)
          }
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
