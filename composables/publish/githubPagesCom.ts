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
import { pathJoin } from "~/utils/util"
import { ElMessage } from "element-plus"
import { getApiParams } from "~/utils/publishUtil"

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
  })

  // deps
  const siyuanPageMethods = deps.siyuanPageMethods

  // public methods
  const githubPagesMethods = {
    githubOnChange: (val: boolean) => {
      // Github开启状态同步给其他地方用
      githubPagesData.githubEnabled = val
    },
    defaultPathOnChange: (val: boolean) => {
      githubPagesData.useDefaultPath = val
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
        docPath = "/"
      } else {
        // 非首次加载或者首次加载但是没保存过目录
        if (parentDocPath === "") {
          parentDocPath = "/"
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

    getGithubPagesData: () => {
      return githubPagesData
    },

    getDocPath: () => {
      const postidKey = getApiParams<IGithubCfg>(props.apiType).posidKey
      const siyuanData = siyuanPageMethods.getSiyuanPageData().dataObj
      const meta = siyuanData.meta
      return meta[postidKey] || ""
    },

    initGithubPages: (paths: any) => {
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
    },
  }

  return {
    githubPagesData,
    githubPagesMethods,
  }
}
