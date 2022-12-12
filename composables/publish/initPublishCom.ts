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

import { reactive, ref } from "vue"
import { getPublishCfg, getPublishStatus } from "~/utils/publishUtil"
import { getJSONConf } from "~/utils/configUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { ElMessage } from "element-plus"
import { appendStr } from "~/utils/strUtil"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { PageEditMode } from "~/utils/common/pageEditMode"
import { PublishPreference } from "~/utils/models/publishPreference"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { SLUG_TYPE_CONSTANTS } from "~/utils/constants/slugTypeConstants"

/**
 * 发布页面初始化组件
 * @param props 页面属性
 * @param deps 依赖的组件
 * @param otherArgs 其它参数（可选）
 */
export const useInitPublish = (props, deps, otherArgs?) => {
  const logger = LogFactory.getLogger("composables/publish/initPublishCom.ts")
  const { t } = useI18n()
  // data
  const initPublishData = reactive({
    isInitLoading: false,
    apiStatus: false,
    isPublished: false,
    apiTypeInfo: ref(
      appendStr(t("setting.blog.platform.support.github"), props.apiType)
    ),
  })

  // deps
  // 注意，使用use引用的实例不共享
  const pageModeMethods = deps.pageModeMethods
  const siyuanPageMethods = deps.siyuanPageMethods
  const slugMethods = deps.slugMethods
  const descMethods = deps.descMethods
  const publishTimeMethods = deps.publishTimeMethods
  const tagMethods = deps.tagMethods
  const githubPagesMethods = deps.githubPagesMethods

  // methods
  const initPublishMethods = {
    initPage: async () => {
      initPublishData.isInitLoading = true

      try {
        // 读取偏好设置
        const publishCfg = getPublishCfg()
        const pageModeData = pageModeMethods.getPageModeData()
        pageModeData.etype = publishCfg.editMode
        pageModeData.stype = publishCfg.contentShowType

        // 读取平台配置
        const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
        // API状态
        initPublishData.apiStatus = githubCfg.apiStatus

        // 获取页面ID
        const pageId = await getPageId(true, props.pageId)
        if (!pageId || pageId === "") {
          initPublishData.isInitLoading = false

          logger.error(t("page.no.id"))
          ElMessage.error(t("page.no.id"))
          return
        }

        // 思源笔记数据
        await siyuanPageMethods.initSiyuanPage(pageId)
        const siyuanData = siyuanPageMethods.getSiyuanPageData().dataObj

        // 发布状态
        initPublishData.isPublished = getPublishStatus(
          props.apiType,
          siyuanPageMethods.getSiyuanPageData().dataObj.meta
        )

        // Form数据
        // initPublishMethods.siyuanDataToForm(publishCfg)
        // // 默认目录
        // formData.value.postForm.formData.customPath =
        //   githubCfg.defaultPath ?? "尚未配置"
        // if (initPublishData.isPublished) {
        //   formData.value.postForm.formData.customPath =
        //     initPublishMethods.getDocPath()
        //   initPublishMethods.convertDocPathToCategories(
        //     formData.value.postForm.formData.customPath,
        //     publishCfg
        //   )
        // }
        // logger.debug("formData=>", formData.value)

        // ===========================
        // 后面尽量使用formData获取数据
        // ===========================

        // 表单属性转换为YAML
        // if (dependentMethods.yamlMethods) {
        //   dependentMethods.yamlMethods.doConvertAttrToYAML(
        //     props.yamlConverter,
        //     formData.value.postForm,
        //     githubCfg
        //   )
        //   // 初始化YAML数据，显示默认（内部调用initYaml）
        //   initPublishMethods.onYamlShowTypeChange(publishCfg.contentShowType)
        //   logger.debug(
        //     "yamlObj=>",
        //     dependentMethods.yamlMethods.getYamlData().yamlObj
        //   )
        // }

        // composables 初始化
        // 别名
        slugMethods.initSlug(siyuanData)
        // 摘要
        descMethods.initDesc(siyuanData)
        // 发布时间
        publishTimeMethods.initPublishTime(siyuanData)
        // 标签
        tagMethods.initTag(siyuanData)
        // githubPages
        const githubPagesData = githubPagesMethods.getGithubPagesData()
        githubPagesData.githubEnabled = initPublishData.apiStatus
        let docPath
        if (initPublishData.isPublished) {
          githubPagesData.useDefaultPath = false
          docPath = githubPagesMethods.getDocPath()

          // 预览链接
          //   const vdomain = "https://terwer.space/"
          //   githubPagesData.previewUrl =
          //     "https://github.com/" +
          //     githubCfg.githubUser +
          //     "/" +
          //     githubCfg.githubRepo +
          //     "/blob/" +
          //     githubCfg.defaultBranch +
          //     "/" +
          //     docPath
          //   githubPagesData.previewRealUrl = pathJoin(
          //     vdomain,
          //     yamlData.yamlObj.yamlObj.permalink
          //   )
        } else {
          docPath = githubCfg.defaultPath ?? ""
        }
        const currentDefaultPath = githubCfg.defaultPath ?? "尚未配置"
        const slugData = slugMethods.getSlugData()
        const mdTitle =
          props.slugType === SLUG_TYPE_CONSTANTS.SLUG_TYPE_MD_FILE
            ? siyuanData.page.content
            : slugData.customSlug ?? "no-slug"
        logger.debug("siyuanData=>", siyuanData.page.content)
        githubPagesMethods.initGithubPages({
          cpath: docPath,
          defpath: currentDefaultPath,
          fname: mdTitle,
        })

        // ================
        // 处理发布之后的数据
        // ================
      } catch (e) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        logger.error(errmsg)
        // ElMessage.error(errmsg)
      }

      initPublishData.isInitLoading = false
    },

    // page methods
    onEditModeChange: (val: PageEditMode) => {
      const pageModeData = pageModeMethods.getPageModeData()
      pageModeData.etype = val

      if (val === PageEditMode.EditMode_source) {
        // convertAttrToYAML(true)
      }
    },

    onYamlShowTypeChange: (val) => {
      // formOptionData.stype = val
      //
      // switch (val) {
      //   case SourceContentShowType.YAML:
      //     if (dependentMethods.yamlMethods) {
      //       dependentMethods.yamlMethods.initYaml(
      //         dependentMethods.yamlMethods.getYamlData().formatter
      //       )
      //     }
      //     break
      //   case SourceContentShowType.CONTENT:
      //     if (dependentMethods.yamlMethods) {
      //       dependentMethods.yamlMethods.initYaml(
      //         dependentMethods.yamlMethods.getYamlData().mdContent
      //       )
      //     }
      //     break
      //   case SourceContentShowType.YAML_CONTENT:
      //     if (dependentMethods.yamlMethods) {
      //       dependentMethods.yamlMethods.initYaml(
      //         dependentMethods.yamlMethods.getYamlData().formatter +
      //           dependentMethods.yamlMethods.getYamlData().mdContent
      //       )
      //     }
      //     break
      //   case SourceContentShowType.HTML_CONTENT:
      //     dependentMethods.yamlMethods.initYaml(
      //       dependentMethods.yamlMethods.getYamlData().htmlContent
      //     )
      //     break
      //   default:
      //     break
      // }
    },

    // 将文档路径转换为分类
    convertDocPathToCategories: (
      docPath: string,
      publishCfg: PublishPreference
    ) => {
      logger.debug("docPath=>", docPath)
      // const docPathArray = docPath.split("/")
      // if (docPathArray.length > 1) {
      //   formData.value.postForm.formData.categories = []
      //   for (let i = 1; i < docPathArray.length - 1; i++) {
      //     let docCat
      //     if (publishCfg.fixTitle) {
      //       docCat = mdFileToTitle(docPathArray[i])
      //     } else {
      //       docCat = docPathArray[i]
      //     }
      //     formData.value.postForm.formData.categories.push(docCat)
      //   }
      // }
    },

    // 组件数据转formData，主要是修改页面之后同步
    composableDataToForm: () => {
      // formData.value.postForm.formData.customSlug = slugData.customSlug
      // formData.value.postForm.formData.desc = descData.desc
      // formData.value.postForm.formData.created = publishTimeData.created
      // formData.value.postForm.formData.tag.dynamicTags = tagData.tag.dynamicTags
    },

    // 组件在页面上尽量使用自带的Data，这个是与DOM绑定的，可以实时获取最新数据，有改变的时候同步formData
    // 调用之前先同步form

    // 调用之前先同步form
    convertAttrToYAML: (hideTip?: any) => {
      const publishCfg = getPublishCfg()
      const githubCfg = getJSONConf<IGithubCfg>(props.apiType)

      // composableDataToForm()

      // yamlMethods.doConvertAttrToYAML(
      //   props.yamlConverter,
      //   formData.value.postForm,
      //   githubCfg
      // )
      // onYamlShowTypeChange(publishCfg.contentShowType)

      if (hideTip !== true) {
        ElMessage.success(t("main.opt.success"))
      }
    },

    convertYAMLToAttr: () => {
      // yamlMethods.doConvertYAMLToAttr()
    },
  }

  return {
    initPublishData,
    initPublishMethods,
  }
}
