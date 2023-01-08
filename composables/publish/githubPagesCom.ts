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
import { LogFactory } from "~/utils/logUtil"
import { getJSONConf } from "~/utils/configUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { GithubApi } from "~/utils/platform/github/githubApi"
import { isEmptyString, parseBoolean, pathJoin } from "~/utils/util"
import { ElMessage } from "element-plus"
import { getApiParams } from "~/utils/publishUtil"
import { appendStr } from "~/utils/strUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import { SiyuanDataObj } from "~/utils/models/siyuanDataObj"

/**
 * Github pages组件
 */
export const useGithubPages = (props, deps) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/githubPagesCom.ts")
  // public data
  const githubPagesData = reactive({
    githubEnabled: false,
    useDefaultPath: false,
    currentDefaultPath: "",
    /**
     * 发布目录
     */
    customPath: "",
    /**
     * 发布的文件名
     */
    mdTitle: "",
    path: {
      // 树形目录选择
      customProps: {
        label: "label",
        children: "children",
        isLeaf: "isLeaf",
      },
    },
    /**
     * 最终发布的路径
     */
    publishPath: "",
    /**
     * 是否生成永久链接（HUGO平台专用）
     */
    usePermalink: true,
    /**
     * 菜单栏标题（HUGO平台专用，为空则不显示在菜单）
     */
    linkTitle: "",
    /**
     * 权重（决定显示顺序，越小显示越靠前）
     */
    weight: 0,
    /**
     * 是否显示日期字段
     */
    useDate: true,
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods
  const slugMethods = deps.slugMethods

  // public methods
  const githubPagesMethods = {
    githubOnChange: (val: boolean) => {
      // Github开启状态同步给其他地方用
      githubPagesData.githubEnabled = val
    },
    defaultPathOnChange: (val: boolean) => {
      githubPagesData.useDefaultPath = val

      if (val == true) {
        const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
        githubPagesMethods.initGithubPages({
          cpath: githubCfg.defaultPath ?? "",
          defpath: githubPagesData.currentDefaultPath,
          fname: githubPagesData.mdTitle,
        })
      }
    },
    customLoad: async (node: any, resolve: any) => {
      if (node.isLeaf) return resolve([])

      logger.debug("目前已保存路径=>", githubPagesData.customPath)
      logger.debug("当前节点=>", node.data)

      const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
      const api = new GithubApi(githubCfg)

      let docPath
      let parentDocPath = node.data.value || ""
      // 第一次加载并且保存过目录
      if (parentDocPath === "" && githubPagesData.customPath !== "") {
        // const githubPagesData=githubPagesMethods.getGithubPagesData()
        // docPath = githubPagesData.customPath
        docPath = ""
      } else {
        // 非首次加载或者首次加载但是没保存过目录
        if (parentDocPath === "") {
          parentDocPath = ""
        }
        // 子目录加载
        docPath = parentDocPath
      }

      const treeNode = await api.getGithubPageTreeNode(docPath)
      resolve(treeNode)
    },
    onSelectChange: (val: any) => {
      logger.debug("onSelectChange=>", val)

      if (val.isLeaf) {
        ElMessage.error("您当前选择的是页面，请注意，页面必须发布在目录下")
        return
      }

      // 渲染路径
      githubPagesMethods.initGithubPages({
        cpath: val.value,
        defpath: githubPagesData.currentDefaultPath,
        fname: githubPagesData.mdTitle,
      })
    },
    onFilenameChange: () => {
      if (githubPagesData.customPath === "") {
        return
      }
      const val = ref(githubPagesData.customPath)
      githubPagesMethods.onSelectChange(val)
      logger.info("触发文件名修改，同步发布路径.")
    },
    permalinkOnChange: (val: boolean) => {
      githubPagesData.usePermalink = val
    },
    showDateOnChange: (val: boolean) => {
      githubPagesData.useDate = val
    },

    getGithubPagesData: () => {
      return githubPagesData
    },

    getDocPath: () => {
      const postidKey = getApiParams<IGithubCfg>(props.apiType).posidKey
      const siyuanData = siyuanPageMethods.getSiyuanPageData().dataObj
      const meta = siyuanData.meta
      return meta[postidKey] || ""
    },

    /**
     * 根据规则生成文件名
     */
    getMdFilename: (): string => {
      const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
      const slugData = slugMethods.getSlugData()
      const siyuanData = siyuanPageMethods.getSiyuanPageData().dataObj

      // 文件名规则
      const mdFilenameRule = githubCfg.mdFilenameRule
      let mdTitle
      // 如果没有生成，就发布过程中动态生成
      const slugPlace = CONSTANTS.PUBLISH_DYNAMIC_SLUG
      if (isEmptyString(mdFilenameRule)) {
        mdTitle = siyuanData.page.content ?? slugData.customSlug ?? slugPlace
      } else {
        mdTitle = mdFilenameRule
        if (mdFilenameRule.indexOf("filename") > -1) {
          mdTitle = mdTitle.replace(/\[filename]/g, siyuanData.page.content)
        }
        if (mdFilenameRule.indexOf("slug") > -1) {
          mdTitle = mdTitle.replace(
            /\[slug]/g,
            slugData.customSlug ?? slugPlace
          )
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

      return mdTitle
    },

    initGithubPages: (paths: any, siyuanData?: SiyuanDataObj) => {
      let cpath: string, defpath: string, fname: string
      if (paths) {
        cpath = paths.cpath
        defpath = paths.defpath
        fname = paths.fname
      }
      logger.debug("paths=>", paths)

      // 路径处理
      githubPagesData.customPath = cpath
      githubPagesData.currentDefaultPath = defpath
      githubPagesData.mdTitle =
        fname.indexOf(".md") > -1 ? fname : fname + ".md"

      if (githubPagesData.customPath.indexOf(".md") > -1) {
        githubPagesData.publishPath = githubPagesData.customPath
      } else {
        githubPagesData.publishPath = pathJoin(
          githubPagesData.customPath,
          "/" + githubPagesData.mdTitle
        )
      }

      // 附加属性
      if (siyuanData) {
        const menuTitleKey =
          SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_MENU_TITLE_KEY
        githubPagesData.linkTitle = siyuanData.meta[menuTitleKey] ?? ""

        const weightKey =
          SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_WEIGHT_KEY
        githubPagesData.weight = siyuanData.meta[weightKey] ?? "0"

        const usePermalinkKey =
          SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_USE_PERMALINK_KEY
        githubPagesData.usePermalink = parseBoolean(
          siyuanData.meta[usePermalinkKey] ?? "true"
        )
        const useDateKey =
          SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_USE_DATE_KEY
        githubPagesData.useDate = parseBoolean(
          siyuanData.meta[useDateKey] ?? "false"
        )
      }
    },
  }

  return {
    githubPagesData,
    githubPagesMethods,
  }
}
