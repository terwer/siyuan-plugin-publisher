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

import { GithubCfg } from "~/utils/platform/github/githubCfg"
import { DynamicConfig, getDynPostidKey, SubPlatformType } from "~/utils/platform/dynamicConfig"

/**
 * 动态Github配置类
 */
export class DynamicGCfg extends GithubCfg {
  constructor(cfg: DynamicConfig) {
    super("", "", "", "", "")

    this.previewMdUrl = "/[user]/[repo]/blob/[branch]/[docpath]"
    this.previewUrl = "/post/[postid].html"
    this.posidKey = getDynPostidKey(cfg.platformKey)
    this.blogName = cfg.subPlatformType

    switch (cfg.subPlatformType) {
      case SubPlatformType.Github_Vuepress:
        this.defaultPath = "docs"
        this.mdFilenameRule = "[filename].md"
        break
      case SubPlatformType.Github_Hugo:
        this.defaultPath = "content/post"
        this.mdFilenameRule = "[slug].md"
        break
      case SubPlatformType.Github_Hexo:
        this.defaultPath = "source/_posts"
        // this.previewUrl = "/[date]/[postid]/"
        this.mdFilenameRule = "[slug].md"
        break
      case SubPlatformType.Github_Jekyll:
        this.defaultPath = "_posts"
        // this.previewUrl = "/[cats]/[date]/[postid].html"
        this.mdFilenameRule = "[yyyy]-[mm]-[dd]-[slug].md"
        break
      // Gitee需要人工审核
      // case SubPlatformType.Github_giteePages:
      //     this.baseUrl = "https://gitee.com"
      //     break
      // Coding pages已下线
      // case SubPlatformType.Github_codingPages:
      //     this.baseUrl = "https://coding.net"
      //     break
      case SubPlatformType.Github_Vitepress:
        this.defaultPath = "docs"
        this.previewUrl = "/[docpath].html"
        this.mdFilenameRule = "[slug].md"
        break
      case SubPlatformType.Github_Nuxt:
        this.defaultPath = "content"
        this.previewUrl = "/[docpath]"
        this.mdFilenameRule = "[slug].md"
        break
      case SubPlatformType.Github_Next:
        this.defaultPath = "pages"
        this.previewUrl = "/[docpath]"
        this.mdFilenameRule = "[slug].md"
        break
      default:
        break
    }
  }
}
