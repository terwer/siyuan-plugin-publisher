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

import { PasswordType } from "zhi-blog-api"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { StrUtil } from "zhi-common"

/**
 * CommonGithubConfig 类用于存储 GitHub 相关配置信息
 */
class CommonGithubConfig extends CommonBlogConfig {
  /**
   * Github仓库名称
   */
  public githubRepo: string

  /**
   * 默认分支
   */
  public githubBranch: string

  /**
   * 文章存储的默认目录（相对于仓库根目录的相对路径，例如：docs/_posts/）
   */
  public defaultPath: string

  /**
   * 默认提交信息
   */
  public defaultMsg: string

  /**
   * 作者
   */
  public author: string

  /**
   * 邮箱
   */
  public email: string

  /**
   * 作者主页
   */
  public site: string

  /**
   * Markdown文件名规则（占位符：[yyyy] [MM] [dd] [slug] [filename] ）
   */
  public mdFilenameRule: string

  /**
   * 预览规则（占位符：[yyyy] [MM] [dd] [postid]）
   */
  public override previewPostUrl: string = ""

  /**
   * MD文件预览规则（占位符：[user] [repo] [branch] [docpath]）
   */
  public override previewUrl: string = ""

  /**
   * 构造函数
   *
   * @param {string} githubUsername - GitHub 用户名
   * @param {string} githubAuthToken - GitHub 访问令牌
   * @param {string} githubRepo - GitHub 仓库
   * @param {string} githubBranch - GitHub 分支
   * @param {string} middlewareUrl - 跨域代理 URL
   */
  constructor(
    githubUsername: string,
    githubAuthToken: string,
    githubRepo: string,
    githubBranch: string,
    middlewareUrl?: string
  ) {
    super("https://github.com", "https://api.github.com", githubUsername, githubAuthToken, middlewareUrl)

    this.username = githubUsername
    this.usernameEnabled = true
    this.password = githubAuthToken
    this.passwordType = PasswordType.PasswordType_Token
    this.tokenSettingUrl = "https://github.com/settings/tokens"
    this.showTokenTip = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.knowledgeSpaceEnabled = false

    this.githubRepo = githubRepo
    this.githubBranch = githubBranch
    this.previewUrl = "/[user]/[repo]/blob/[branch]/[docpath]"
    this.previewPostUrl = "/post/[postid].html"
    this.defaultPath = "/"
    this.defaultMsg = "auto published by siyuan-plugin-publisher"
    this.author = "terwer"
    this.email = "youweics@163.com"
    this.site = StrUtil.pathJoin(this.home, "/" + this.username)
    this.mdFilenameRule = "[filename].md"

    this.middlewareUrl = middlewareUrl
  }
}

export { CommonGithubConfig }
