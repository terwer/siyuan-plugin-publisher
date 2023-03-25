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

import { GithubApi } from "~/utils/platform/github/githubApi"
import { VuepressCfg } from "~/utils/platform/github/vuepress/VuepressCfg"
import { LogFactory } from "~/utils/logUtil"

/**
 * Vuepress V1 API
 */
export class VuepressApiV1 extends GithubApi {
  // Vuepress配置
  vuepressCfg: VuepressCfg

  constructor(vuepressCfg: VuepressCfg) {
    super(vuepressCfg)
    this.logger = LogFactory.getLogger("utils/platform/github/vuepress/vuepressApiV1.ts")
    this.vuepressCfg = vuepressCfg
  }

  async getGithubPageTreeNode(docPath: string): Promise<any[]> {
    const data = await this.getPageData(docPath)

    const treeNode = [] as any[]

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.name.indexOf(".vuepress") > -1) {
          continue
        }
        if (item.name.indexOf("@pages") > -1) {
          continue
        }
        if (item.name.indexOf("_posts") > -1) {
          continue
        }
        const node = {
          value: item.path,
          label: item.name,
          isLeaf: item.name.indexOf(".md") > -1,
        }
        treeNode.push(node)
      }
      this.logger.debug("getPageTreeNode,data=>", data)
    }

    return treeNode
  }
}
