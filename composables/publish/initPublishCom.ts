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
import { ElMessage, ElMessageBox } from "element-plus"
import { appendStr, mdFileToTitle } from "~/utils/strUtil"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { PageEditMode } from "~/utils/common/pageEditMode"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { isEmptyString } from "~/utils/util"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"
import { PostForm } from "~/utils/models/postForm"
import { mdToHtml, removeH1, removeMdH1 } from "~/utils/htmlUtil"
import { yaml2Obj } from "~/utils/yamlUtil"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"

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
  const yamlMethods = deps.yamlMethods

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
        // 文件名规则
        const mdFilenameRule = githubCfg.mdFilenameRule
        let mdTitle
        if (isEmptyString(mdFilenameRule)) {
          mdTitle = siyuanData.page.content ?? slugData.customSlug ?? "no-slug"
        } else {
          mdTitle = mdFilenameRule
          if (mdFilenameRule.indexOf("filename") > -1) {
            mdTitle = mdTitle.replace(/\[filename]/g, siyuanData.page.content)
          }
          if (mdFilenameRule.indexOf("slug") > -1) {
            mdTitle = mdTitle.replace(/\[slug]/g, slugData.customSlug)
          }
          let date = new Date()
          if (mdFilenameRule.indexOf("yyyy") > -1) {
            const year = date.getFullYear()
            mdTitle = mdTitle.replace(/\[yyyy]/g, year.toString())
          }
          if (
            mdFilenameRule.indexOf("MM") > -1 ||
            mdFilenameRule.indexOf("mm") > -1
          ) {
            let monthstr
            let month = date.getMonth() + 1
            monthstr = month.toString()
            if (month < 10) {
              monthstr = appendStr("0", monthstr)
            }
            mdTitle = mdTitle.replace(/\[MM]/g, monthstr)
            mdTitle = mdTitle.replace(/\[mm]/g, monthstr)
          }
          if (mdFilenameRule.indexOf("dd") > -1) {
            let daystr
            let day = date.getDate()
            daystr = day.toString()
            if (day < 10) {
              daystr = appendStr("0", daystr)
            }
            mdTitle = mdTitle.replace(/\[dd]/g, daystr)
          }
        }
        // 初始化
        githubPagesMethods.initGithubPages({
          cpath: docPath,
          defpath: currentDefaultPath,
          fname: mdTitle,
        })
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

      if (val === PageEditMode.EditMode_source) {
        initPublishMethods.convertAttrToYAML(true)
        pageModeData.etype = val
      } else {
        const isSaved = yamlMethods.getYamlData().isSaved
        if (!isSaved) {
          ElMessageBox.confirm(t("main.yaml.no.save"), t("main.opt.warning"), {
            confirmButtonText: t("main.opt.ok"),
            cancelButtonText: t("main.opt.cancel"),
            type: "warning",
          })
            .then(async () => {
              initPublishMethods.convertYAMLToAttr(true)
              pageModeData.etype = val
            })
            .catch(() => {
              pageModeData.etype = val
            })
        } else {
          pageModeData.etype = val
        }
      }
    },

    onYamlShowTypeChange: (val) => {
      const pageModeData = pageModeMethods.getPageModeData()
      pageModeData.stype = val

      switch (val) {
        case SourceContentShowType.YAML:
          yamlMethods.initYaml(yamlMethods.getYamlData().formatter)
          break
        case SourceContentShowType.CONTENT:
          yamlMethods.initYaml(yamlMethods.getYamlData().mdContent)
          break
        case SourceContentShowType.YAML_CONTENT:
          yamlMethods.initYaml(
            yamlMethods.getYamlData().formatter +
              yamlMethods.getYamlData().mdContent
          )
          break
        case SourceContentShowType.HTML_CONTENT:
          yamlMethods.initYaml(yamlMethods.getYamlData().htmlContent)
          break
        default:
          break
      }
    },

    // 将文档路径转换为分类
    convertDocPathToCategories: (docPath: string): string[] => {
      const publishCfg = getPublishCfg()

      logger.debug("docPath=>", docPath)
      const docPathArray = docPath.split("/")
      let categories = []
      if (docPathArray.length > 1) {
        for (let i = 1; i < docPathArray.length - 1; i++) {
          let docCat
          if (publishCfg.fixTitle) {
            docCat = mdFileToTitle(docPathArray[i])
          } else {
            docCat = docPathArray[i]
          }
          categories.push(docCat)
        }
      }

      return categories
    },

    // 组件数据转formData，主要是修改页面之后同步
    composableDataToForm: (): PostForm => {
      const publishCfg = getPublishCfg()

      const postForm = new PostForm()
      postForm.formData.title = slugMethods.getSlugData().title
      postForm.formData.customSlug = slugMethods.getSlugData().customSlug
      postForm.formData.desc = descMethods.getDescData().desc
      postForm.formData.created = publishTimeMethods.getPublishTime().created
      postForm.formData.tag.dynamicTags = tagMethods.getTagData()
      // 分类
      const docPath = githubPagesMethods.getGithubPagesData().customPath
      postForm.formData.categories =
        initPublishMethods.convertDocPathToCategories(docPath)
      // 正文
      let md = siyuanPageMethods.getSiyuanPageData().dataObj.content.content
      let html = mdToHtml(md)
      if (publishCfg.removeH1) {
        md = removeMdH1(md)
        html = removeH1(html)
      }
      postForm.formData.mdContent = md
      postForm.formData.htmlContent = html

      return postForm
    },

    // 组件在页面上尽量使用自带的Data，这个是与DOM绑定的，可以实时获取最新数据，
    // 调用之前先使用form中转
    convertAttrToYAML: (hideTip?: any) => {
      const publishCfg = getPublishCfg()
      const githubCfg = getJSONConf<IGithubCfg>(props.apiType)

      // composableDataToForm
      const postForm = initPublishMethods.composableDataToForm()

      yamlMethods.doConvertAttrToYAML(props.yamlConverter, postForm, githubCfg)
      initPublishMethods.onYamlShowTypeChange(publishCfg.contentShowType)

      if (hideTip !== true) {
        ElMessage.success(t("main.opt.success"))
      }
    },

    formToComposableData: (postForm: PostForm): void => {
      // 别名
      slugMethods.syncSlug(postForm)
      // 摘要
      descMethods.syncDesc(postForm)
      // 发布时间
      publishTimeMethods.syncPublishTime(postForm)
      // 标签
      tagMethods.syncTag(postForm)
      // 分类没办法同步
      // pages相关，暂不支持
      // githubPagesMethods.syncMdFile(postForm)
    },

    convertYAMLToAttr: (hideTip?: boolean) => {
      if (
        pageModeMethods.getPageModeData().stype !== SourceContentShowType.YAML
      ) {
        const errmsg = "只能转换YAML，请切换显示模式"
        ElMessage.error(errmsg)
        throw new Error(errmsg)
      }

      try {
        const githubCfg = getJSONConf<IGithubCfg>(props.apiType)

        // yamlToObj
        const formatter = yamlMethods.getYamlData().yamlContent
        const yamlObj = yaml2Obj(formatter)
        const yamlFormatObj = new YamlFormatObj()
        yamlFormatObj.yamlObj = yamlObj
        logger.debug("准备将YAML转换为文章属性，yamlFormatObj=>", yamlFormatObj)
        const postForm = yamlMethods.doConvertYAMLToAttr(
          props.yamlConverter,
          yamlFormatObj,
          githubCfg
        )

        // formData转composable组件数据
        initPublishMethods.formToComposableData(postForm)
        // 标记为保存
        yamlMethods.getYamlData().isSaved = true
        if (hideTip !== true) {
          ElMessage.success(t("main.opt.success"))
        }
      } catch (e) {
        if (hideTip !== true) {
          ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
        }
      }
    },
  }

  return {
    initPublishData,
    initPublishMethods,
  }
}
