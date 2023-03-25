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

import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { Octokit } from "@octokit/core"
import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import { Base64 } from "js-base64"
import { isEmptyString } from "~/utils/util"

/**
 * Github API
 * @see https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
 */
export class GithubApi {
  protected logger: Logger
  // 读取配置
  private readonly githubCfg: IGithubCfg

  // Octokit.js
  // https://github.com/octokit/core.js#readme
  private readonly octokit: Octokit

  constructor(githubCfg: IGithubCfg) {
    this.logger = LogFactory.getLogger("utils/platform/github/githubApi.ts")
    this.githubCfg = githubCfg
    this.octokit = new Octokit({
      auth: githubCfg.githubToken,
    })
  }

  /**
   * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
   * 子类API使用，应用层面不建议直接调用
   * @param docPath 完整文件路径，例如：docs/_posts/测试.md
   */
  protected async getPageSha(docPath: string): Promise<string> {
    let sha

    const data = await this.getPageData(docPath)
    if (data) {
      sha = data.sha
    }
    return sha
  }

  /**
   * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
   * 子类API使用，应用层面不建议直接调用
   * @param docPath 完整文件路径，例如：docs/_posts/测试.md
   */
  async getPageData(docPath: string): Promise<any> {
    let data

    if (isEmptyString(this.githubCfg.githubUser) || isEmptyString(this.githubCfg.githubRepo)) {
      throw new Error("分类获取失败")
    }

    const route =
      "GET /repos/" +
      this.githubCfg.githubUser +
      "/" +
      this.githubCfg.githubRepo +
      "/contents/" +
      docPath +
      "?ref=" +
      this.githubCfg.defaultBranch
    this.logger.debug("getPage route=>", route)
    const res = await this.octokit.request(route, {
      owner: this.githubCfg.githubUser,
      repo: this.githubCfg.githubRepo,
      path: docPath,
    })
    this.logger.debug("getPage res=>", res)

    if (res) {
      data = res.data
    }
    return data
  }

  /**
   * 创建或更新页面
   * 子类API使用，应用层面不建议直接调用
   * @param docPath 页面路径，相对于根仓库的完整路径
   * @param mdContent Markdown文本
   * @param sha 文件的sha，undefined表示新建，更新需要传sha字符串
   */
  protected async createOrUpdatePage(docPath: string, mdContent: string, sha: any): Promise<any> {
    let data

    // const base64 = Buffer.from(mdContent).toString('base64');
    const base64 = Base64.toBase64(mdContent)
    const route = "PUT /repos/" + this.githubCfg.githubUser + "/" + this.githubCfg.githubRepo + "/contents/" + docPath
    const options = {
      owner: this.githubCfg.githubUser,
      repo: this.githubCfg.githubRepo,
      path: docPath,
      message: this.githubCfg.defaultMsg,
      committer: {
        name: this.githubCfg.author,
        email: this.githubCfg.email,
      },
      content: base64,
      branch: this.githubCfg.defaultBranch,
    }
    if (sha) {
      Object.assign(options, {
        sha,
      })
    }

    const res = await this.octokit.request(route, options)
    this.logger.debug("createOrUpdatePage res=>", res)

    if (res) {
      data = res.data
    }
    return data
  }

  /**
   * 删除页面
   * 子类API使用，应用层面不建议直接调用
   * @param docPath 页面路径，相对于根仓库的完整路径
   * @param sha 文件的sha，undefined表示新建，更新需要传sha字符串
   */
  protected async deletePage(docPath: string, sha: any): Promise<any> {
    let data

    const route =
      "DELETE /repos/" + this.githubCfg.githubUser + "/" + this.githubCfg.githubRepo + "/contents/" + docPath
    const options = {
      owner: this.githubCfg.githubUser,
      repo: this.githubCfg.githubRepo,
      path: docPath,
      message: this.githubCfg.defaultMsg,
      committer: {
        name: this.githubCfg.author,
        email: this.githubCfg.email,
      },
      sha,
      branch: this.githubCfg.defaultBranch,
    }

    const res = await this.octokit.request(route, options)
    this.logger.debug("deletePage res=>", res)

    if (res) {
      data = res.data
    }
    return data
  }

  // ===========================
  // 下面是公共方法，子类可酌情重写
  // ===========================
  /**
   * 发布文章到Github
   * @param docPath 相对于根仓库的完整路径，包括文件名和扩展名
   * @param mdContent Markdown文本
   */
  public async publishGithubPage(docPath: string, mdContent: string): Promise<any> {
    // https://github.com/terwer/src-sy-post-publisher/issues/21
    const sha = undefined
    const res = await this.createOrUpdatePage(docPath, mdContent, sha)
    this.logger.debug("Github publishPage,res=>", res)
    return res
  }

  /**
   * 更新文章到Github
   * @param docPath
   * @param mdContent
   */
  public async updateGithubPage(docPath: string, mdContent: string): Promise<any> {
    // https://github.com/terwer/src-sy-post-publisher/issues/21
    const sha = await this.getPageSha(docPath)

    const res = await this.createOrUpdatePage(docPath, mdContent, sha)
    this.logger.debug("Github updatePage,res=>", res)
    return res
  }

  /**
   * 删除Github发布的文章
   * @param docPath 对于根仓库的完整路径，包括文件名和扩展名
   */
  public async deleteGithubPage(docPath: string): Promise<any> {
    const sha = await this.getPageSha(docPath)

    const res = await this.deletePage(docPath, sha)
    this.logger.debug("Github deletePage,res=>", res)
    return res
  }

  /**
   * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
   * @param docPath 完整文件路径，例如：docs/_posts/测试.md
   */
  public async getGithubPageTreeNode(docPath: string): Promise<any[]> {
    const data = await this.getPageData(docPath)

    const treeNode = [] as any[]

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
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
