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
import { CommonblogConfig } from "~/src/adaptors/api/base/CommonblogConfig.ts"

/**
 * CommonGithubConfig 类用于存储 GitHub 相关配置信息
 */
class CommonGithubConfig extends CommonblogConfig {
  public githubRepo: string
  public githubBranch: string
  public defaultPath: string

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
    super("https://github.com", "", githubUsername, githubAuthToken, middlewareUrl)

    this.username = githubUsername
    this.password = githubAuthToken
    this.usernameEnabled = true
    this.passwordType = PasswordType.PasswordType_Token
    this.githubRepo = githubRepo
    this.githubBranch = githubBranch
    this.defaultPath = "/"
    this.blogid = ""
    this.blogName = ""

    this.middlewareUrl = middlewareUrl
  }
}

export { CommonGithubConfig }
