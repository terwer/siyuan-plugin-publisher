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
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CommonGitlabClient } from "zhi-gitlab-middleware"
import { CategoryInfo, Post, UserBlog, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { DateUtil, HtmlUtil, StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"
import { Base64 } from "js-base64"
import { isDev } from "~/src/utils/constants.ts"
import IdUtil from "~/src/utils/idUtil.ts"

/**
 * Gitlab API 适配器
 *
 * @author terwer
 * @version 1.11.0
 * @since 1.11.0
 */
class CommonGitlabApiAdaptor extends BaseBlogApi {
  private gitlabClient: CommonGitlabClient

  constructor(appInstance: PublisherAppInstance, cfg: CommonGitlabConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("common-gitlab-api-adaptor")

    this.gitlabClient = new CommonGitlabClient(
      appInstance,
      cfg.apiUrl,
      cfg.password,
      cfg.username,
      cfg.githubRepo,
      cfg.githubBranch,
      cfg.defaultMsg,
      cfg.email,
      cfg.author,
      cfg.middlewareUrl,
      isDev
    )
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const nodes = await this.gitlabClient.getRepositoryTree("")
    this.logger.debug("getRepositoryTree =>", nodes)

    // 数据适配
    if (nodes && nodes.length > 0) {
      const userblog: UserBlog = new UserBlog()
      const cfg = this.cfg as CommonGitlabConfig
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
    const cfg = this.cfg as CommonGitlabConfig

    // 路径处理
    const savePath = post.cate_slugs?.[0] ?? cfg.blogid
    const filename = post.mdFilename ?? "auto-" + IdUtil.newID()
    const docPath = `${savePath}/${filename}.md`
    this.logger.info("将要最终发送到以下目录 =>", docPath)

    // 开始发布
    const res = await this.gitlabClient.createRepositoryFile(docPath, post.description)
    this.logger.debug("gitlab newPost finished =>", res)

    if (!res?.file_path) {
      throw new Error("Gitlab 调用API异常 =>" + res?.message)
    }
    return res.file_path
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    this.logger.debug("start getPost =>", { postid: postid })

    const res = await this.gitlabClient.getRepositoryFile(postid)
    this.logger.debug("gitlab getPost finished =>", res)
    if (!res) {
      throw new Error("Gitlab 调用API异常")
    }

    let commonPost = new Post()
    commonPost.postid = res.file_path
    // 文件标题
    commonPost.mdFilename = res.file_name
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
    const extractedPath = res.file_path.replace(res.file_name, "").replace(/\/$/, "")
    catSlugs.push(extractedPath)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    this.logger.debug("start editPost =>", { postid: postid, post: toRaw(post) })
    const res = await this.gitlabClient.updateRepositoryFile(post.postid, post.description)
    this.logger.debug("gitlab editPost finished =>", res)

    if (!res?.file_path) {
      throw new Error("Gitlab 调用API异常")
    }
    return true
  }

  public async deletePost(postid: string): Promise<boolean> {
    try {
      const resJson = await this.gitlabClient.deleteRepositoryFile(postid)
      this.logger.debug("gitlab deletePost finished =>", resJson)
    } catch (e) {
      throw new Error("Gitlab 调用API异常 =>" + e)
    }

    return true
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    return Promise.resolve([])
  }

  public async getCategoryTreeNodes(docPath: string): Promise<any[]> {
    const res = await this.gitlabClient.getRepositoryTree(docPath)
    return res
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const cfg = this.cfg as CommonGitlabConfig
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
}

export { CommonGitlabApiAdaptor }
