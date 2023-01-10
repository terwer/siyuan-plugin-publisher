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
import { isEmptyString, pathJoin } from "~/utils/util"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"
import { PostForm } from "~/utils/models/postForm"
import { mdToHtml, removeMdH1, removeMdWidgetTag } from "~/utils/htmlUtil"
import { yaml2Obj } from "~/utils/yamlUtil"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"
import { LinkParser } from "~/utils/parser/LinkParser"

/**
 * 发布页面初始化组件
 * @param props 页面属性
 * @param deps 依赖的组件
 * @param otherArgs 其它参数（可选）
 */
export const useInitPublish = (props, deps, otherArgs?) => {
  const logger = LogFactory.getLogger("composables/publish/initPublishCom.ts")
  const { t } = useI18n()
  const linkParser = new LinkParser()
  // data
  const initPublishData = reactive({
    isInitLoading: false,
    apiStatus: false,
    apiTypeInfo: ref(
      appendStr(t("setting.blog.platform.support.github"), props.apiType)
    ),
    isPublished: false,
    previewMdUrl: "",
    previewUrl: "",
    mdStatusUrl: "",
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
  const quickMethods = deps.quickMethods
  const picgoPostMethods = deps.picgoPostMethods

  // methods
  const initPublishMethods = {
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
          yamlMethods.initYaml(yamlMethods.getYamlData().mdFullContent)
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
      // mdToHtml已经去掉了挂件代码
      // let html = mdToHtml(md)
      // md去掉挂件代码
      md = removeMdWidgetTag(md)
      // md去掉H1
      if (publishCfg.removeH1) {
        md = removeMdH1(md)
        // html = removeH1(html)
      }
      // md双链转换
      // @deprecated 移植性不好，放弃
      // md = linkParser.convertSiyuanLinkToInnerLink(md)
      postForm.formData.mdContent = md
      postForm.formData.htmlContent = mdToHtml(md)
      // 是否生成永久链接
      postForm.formData.usePermalink =
        githubPagesMethods.getGithubPagesData().usePermalink
      // 菜单标题
      postForm.formData.linkTitle =
        githubPagesMethods.getGithubPagesData().linkTitle
      // 权重
      postForm.formData.weight = githubPagesMethods.getGithubPagesData().weight
      // 是否显示日期字段
      postForm.formData.useDate =
        githubPagesMethods.getGithubPagesData().useDate

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

        // 防止循环提示
        yamlMethods.getYamlData().isSaved = true
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

    saveAttrToSiyuanWithInit: async () => {
      await quickMethods.saveAttrToSiyuan(true)
      await initPublishMethods.initPage(true)

      ElMessage.success(t("main.opt.success"))
    },

    getInitPublishData: () => {
      return initPublishData
    },

    /**
     * 初始化发布页面
     * @param hideTip 是否隐藏loading
     */
    initPage: async (hideTip?: boolean) => {
      initPublishData.isInitLoading = hideTip != true

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
        // 使用Picgo
        picgoPostMethods.initPicgo(publishCfg.usePicgo)

        // githubPages
        const githubPagesData = githubPagesMethods.getGithubPagesData()
        githubPagesData.githubEnabled = initPublishData.apiStatus
        let docPath
        if (initPublishData.isPublished) {
          githubPagesData.useDefaultPath = false
          docPath = githubPagesMethods.getDocPath()
        } else {
          docPath = githubCfg.defaultPath ?? ""
        }
        const currentDefaultPath = githubCfg.defaultPath ?? "尚未配置"
        const mdTitle = githubPagesMethods.getMdFilename()
        // 初始化
        githubPagesMethods.initGithubPages(
          {
            cpath: docPath,
            defpath: currentDefaultPath,
            fname: mdTitle,
          },
          siyuanData
        )

        // 所有数据初始化完成，生成YAML
        initPublishMethods.convertAttrToYAML(true)

        // 预览链接
        if (initPublishData.apiStatus && initPublishData.isPublished) {
          // 预览链接
          const baseUrl = githubCfg.baseUrl ?? "https://terwer.space/"
          const home = githubCfg.home ?? "https://terwer.space/"
          // MD预览链接
          let mdUrl
          mdUrl = pathJoin(githubCfg.githubUser, "/" + githubCfg.githubRepo)
          mdUrl = pathJoin(mdUrl, "/blob/")
          mdUrl = pathJoin(mdUrl, "/" + githubCfg.defaultBranch)
          mdUrl = pathJoin(mdUrl, "/" + docPath)
          if (!isEmptyString(githubCfg.previewMdUrl)) {
            mdUrl = githubCfg.previewMdUrl
            mdUrl = mdUrl.replace(/\[user]/, githubCfg.githubUser)
            mdUrl = mdUrl.replace(/\[repo]/, githubCfg.githubRepo)
            mdUrl = mdUrl.replace(/\[branch]/, githubCfg.defaultBranch)
            mdUrl = mdUrl.replace(/\[docpath]/, docPath)
          }
          mdUrl = pathJoin(baseUrl, mdUrl)
          initPublishData.previewMdUrl = mdUrl
          // 构建状态
          initPublishData.mdStatusUrl = appendStr(
            "https://img.shields.io/github/checks-status/",
            githubCfg.githubUser,
            "/",
            githubCfg.githubRepo,
            "/",
            githubCfg.defaultBranch,
            "?label=build"
          )

          // 实际预览链接
          let url = yamlMethods.getYamlData().yamlObj.permalink
          if (!isEmptyString(githubCfg.previewUrl)) {
            // [docpath]
            // Vitepress
            // Nuxt content
            if (githubCfg.previewUrl.indexOf("[docpath]") > -1) {
              const defaultPath = githubCfg.defaultPath ?? "docs"
              const prefix = docPath.replace(defaultPath, "").replace(".md", "")
              url = githubCfg.previewUrl.replace("/[docpath]", prefix)
            } else {
              // Vuepress、HUGO、Hexo、Jekyll
              // [postid]
              url = githubCfg.previewUrl.replace(
                /\[postid]/g,
                slugMethods.getSlugData().customSlug
              )

              // [yyyy] [MM] [dd]
              const created = publishTimeMethods.getPublishTime().created
              const datearr = created.split(" ")[0]
              const numarr = datearr.split("-")
              logger.debug("created numarr=>", numarr)
              const y = numarr[0]
              const m = numarr[1]
              const d = numarr[2]
              url = url.replace(/\[yyyy]/g, y)
              url = url.replace(/\[MM]/g, m)
              url = url.replace(/\[mm]/g, m)
              url = url.replace(/\[dd]/g, d)

              // [cats]
              const publishPath =
                githubPagesMethods.getGithubPagesData().publishPath
              const categories =
                initPublishMethods.convertDocPathToCategories(publishPath)
              // 处理分类
              if (categories.length > 0) {
                url = url.replace(/\[cats]/, categories.join("/"))
              } else {
                url = url.replace(/\/\[cats]/, "")
              }
            }
          }
          initPublishData.previewUrl = pathJoin(home, url)
        }
      } catch (e) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        logger.error(errmsg)
        // ElMessage.error(errmsg)
      }

      initPublishData.isInitLoading = false
    },
  }

  return {
    initPublishData,
    initPublishMethods,
  }
}
