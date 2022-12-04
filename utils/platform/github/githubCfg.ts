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

/**
 * Github平台通用配置接口
 */
export interface IGithubCfg {
  /**
   * Github用户名
   */
  githubUser: string
  /**
   * Github仓库名称
   */
  githubRepo: string
  /**
   * Github个人Token令牌
   */
  githubToken: string
  /**
   * 默认分支
   */
  defaultBranch: string
  /**
   * 文章存储的默认目录（相对于仓库根目录的相对路径，例如：docs/_posts/）
   */
  defaultPath: string
  /**
   * 默认提交信息
   */
  defaultMsg: string
  /**
   * 作者
   */
  author: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 文章别名key
   */
  posidKey: string
  /**
   * 博客首页，预览用
   */
  home: string
  /**
   * 预览规则
   */
  previewUrl: string
  /**
   * API状态是否正常
   */
  apiStatus: boolean
}

/**
 * Github平台通用配置类
 */
export class GithubCfg implements IGithubCfg {
  githubUser: string
  githubRepo: string
  githubToken: string

  defaultBranch: string
  defaultMsg: string
  defaultPath: string
  author: string
  email: string
  posidKey: string = ""
  home: string
  previewUrl: string
  baseUrl: string
  apiStatus: boolean

  constructor(
    home: string,
    githubUser: string,
    githubRepo: string,
    githubToken: string
  ) {
    this.home = home
    this.githubUser = githubUser
    this.githubRepo = githubRepo
    this.githubToken = githubToken
    this.defaultBranch = "main"
    this.defaultPath = "docs/_posts"
    this.defaultMsg = "auto published by sy-post-publisher"
    this.author = "terwer"
    this.email = "youweics@163.com"
    this.previewUrl = ""
    this.baseUrl = "https://github.com"
    this.apiStatus = false
  }
}
