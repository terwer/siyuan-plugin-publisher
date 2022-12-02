/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { GithubApi } from "~/utils/platform/github/githubApi"
import logUtil from "~/utils/logUtil"
import { VuepressCfg } from "~/utils/platform/github/vuepress/VuepressCfg"

/**
 * Vuepress V1 API
 */
export class VuepressApiV1 extends GithubApi {
  // Vuepress配置
  vuepressCfg: VuepressCfg

  constructor(vuepressCfg: VuepressCfg) {
    super(vuepressCfg)
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
      logUtil.logInfo("getPageTreeNode,data=>", data)
    }

    return treeNode
  }
}
