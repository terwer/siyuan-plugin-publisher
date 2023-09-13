/*
 * Copyright (c) 2023, Terwer . All rights reserved.
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

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CategoryInfo, Post, UserBlog, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { CommonGithubClient, GithubConfig } from "zhi-github-middleware"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { DateUtil, HtmlUtil, StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"
import { Base64 } from "js-base64"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import IdUtil from "~/src/utils/idUtil.ts"

/**
 * Github API 适配器
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CommonGithubApiAdaptor extends BaseBlogApi {
  private githubClient: CommonGithubClient

  constructor(appInstance: any, cfg: CommonGithubConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("common-github-api-adaptor")

    const githubConfig = new GithubConfig(cfg.username, cfg.githubRepo, cfg.password)
    githubConfig.defaultBranch = cfg.githubBranch
    githubConfig.defaultPath = cfg.defaultPath
    githubConfig.defaultMsg = cfg.defaultMsg
    githubConfig.author = cfg.author
    githubConfig.email = cfg.email
    githubConfig.previewMdUrl = cfg.previewUrl
    githubConfig.previewUrl = cfg.previewPostUrl
    githubConfig.baseUrl = cfg.home
    githubConfig.mdFilenameRule = cfg.mdFilenameRule

    this.githubClient = new CommonGithubClient(githubConfig)
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const nodes = await this.githubClient.getGithubPageTreeNode("")
    this.logger.debug("getGithubPageTreeNode =>", nodes)

    // 数据适配
    if (nodes && nodes.length > 0) {
      const userblog: UserBlog = new UserBlog()
      const cfg = this.cfg as CommonGithubConfig
      userblog.blogid = cfg.defaultPath
      userblog.blogName = cfg.defaultPath
      userblog.url = StrUtil.pathJoin(StrUtil.pathJoin(cfg.home, cfg.username), cfg.githubRepo)
      result.push(userblog)
    }
    this.logger.debug("result result =>", result)

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    this.logger.debug("start newPost =>", { post: toRaw(post) })
    const cfg = this.cfg as CommonGithubConfig

    // 路径处理
    const savePath = post.cate_slugs?.[0] ?? cfg.blogid
    const filename = post.mdFilename ?? "auto-" + IdUtil.newID()
    const docPath = `${savePath}/${filename}.md`
    this.logger.info("将要最终发送到以下目录 =>", docPath)

    // 开始发布
    const res = await this.githubClient.publishGithubPage(docPath, post.description)

    if (!res?.content?.path) {
      throw new Error("Github 调用API异常")
    }
    return res.content.path
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    this.logger.debug("start getPost =>", { postid: postid })

    const res = await this.githubClient.getGithubPage(postid)
    this.logger.debug("getPost finished =>", res)
    if (!res) {
      throw new Error("Github 调用API异常")
    }

    let commonPost = new Post()
    commonPost.postid = res.path
    commonPost.mdFilename = res.name
    commonPost.markdown = Base64.fromBase64(res.content)
    commonPost.description = commonPost.markdown

    // YAML属性转换
    const yamlAdaptor: YamlConvertAdaptor = this.getYamlAdaptor()
    if (null !== yamlAdaptor) {
      const yamlObj = await YamlUtil.yaml2ObjAsync(commonPost.description)
      const yamlFormatObj = new YamlFormatObj()
      yamlFormatObj.yamlObj = yamlObj
      this.logger.debug("extract frontFormatter, yamlFormatObj =>", yamlFormatObj)
      commonPost = yamlAdaptor.convertToAttr(commonPost, yamlFormatObj, this.cfg)
      this.logger.debug("handled yamlObj using YamlConverterAdaptor =>", yamlObj)
    }

    // 初始化知识空间
    const catSlugs = []
    const extractedPath = res.path.replace(res.name, "").replace(/\/$/, "")
    catSlugs.push(extractedPath)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    this.logger.debug("start editPost =>", { postid: postid, post: toRaw(post) })

    const res = await this.githubClient.updateGithubPage(post.postid, post.description)
    if (!res?.content?.path) {
      throw new Error("Github 调用API异常")
    }
    return true
  }

  public async deletePost(postid: string): Promise<boolean> {
    const res = await this.githubClient.deleteGithubPage(postid)
    if (!res?.commit?.sha) {
      throw new Error("Github 调用API异常")
    }
    return true
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    return Promise.resolve([])
  }

  public async getCategoryTreeNodes(docPath: string): Promise<any[]> {
    const res = await this.githubClient.getGithubPageTreeNode(docPath)
    return res
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const cfg = this.cfg as CommonGithubConfig
    let previewUrl: string
    previewUrl = cfg.previewUrl
      .replace("[user]", cfg.username)
      .replace("[repo]", cfg.githubRepo)
      .replace("[branch]", cfg.githubBranch)
      .replace("[docpath]", postid)
    // 路径组合
    previewUrl = StrUtil.pathJoin(this.cfg.home, previewUrl)
    return previewUrl
  }

  public async getPostPreviewUrl(postid: string): Promise<string> {
    let previewUrl: string
    const newPostid = postid.substring(postid.lastIndexOf("/") + 1).replace(".md", "")
    previewUrl = this.cfg.previewUrl.replace("[postid]", newPostid)
    // 路径组合
    previewUrl = StrUtil.pathJoin(StrUtil.pathJoin(this.cfg.home, this.cfg.username), previewUrl)

    return previewUrl
  }

  // ================
  // private methods
  // ================
  private processFilename(post: Post, cfg: CommonGitlabConfig) {
    // 处理文件规则
    const created = DateUtil.formatIsoToZhDate(post.dateCreated.toISOString(), true)
    const datearr = created.split(" ")[0]
    const numarr = datearr.split("-")
    const y = numarr[0]
    const m = numarr[1]
    const d = numarr[2]
    this.logger.debug("created numarr=>", numarr)
    let filename = cfg.mdFilenameRule.replace(/\.md/g, "")
    if (cfg.useMdFilename) {
      // 使用真实文件名作为MD文件名
      filename = filename.replace(/\[filename\]/g, post.title)
    } else {
      // 使用别名作为MD文件名
      filename = filename.replace(/\[slug\]/g, post.wp_slug)
    }
    // 年月日
    filename = filename
      .replace(/\[yyyy\]/g, y)
      .replace(/\[MM\]/g, m)
      .replace(/\[mm\]/g, m)
      .replace(/\[dd\]/g, d)

    return filename
  }

  private processPathCategory(savePath: string, cfg: CommonGitlabConfig) {
    let categories = []
    if (cfg.usePathCategory) {
      this.logger.debug("savePath=>", savePath)
      const docPathArray = savePath.split("/")
      if (docPathArray.length > 1) {
        for (let i = 1; i < docPathArray.length - 1; i++) {
          const docCate = HtmlUtil.removeTitleNumber(docPathArray[i])
          categories.push(docCate)
        }
      }
    }

    return categories
  }
}

export { CommonGithubApiAdaptor }
