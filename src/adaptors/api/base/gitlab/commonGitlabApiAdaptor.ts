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
import { AppInstance } from "~/src/appInstance.ts"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CommonGitlabClient } from "zhi-gitlab-middleware"
import { UserBlog } from "zhi-blog-api"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { StrUtil } from "zhi-common"

/**
 * Gitlab API 适配器
 *
 * @author terwer
 * @version 1.11.0
 * @since 1.11.0
 */
class CommonGitlabApiAdaptor extends BaseBlogApi {
  private gitlabClient: CommonGitlabClient

  constructor(appInstance: AppInstance, cfg: CommonGitlabConfig) {
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
      cfg.middlewareUrl
    )
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const nodes = await this.gitlabClient.getRepositoryTree("")
    this.logger.debug("getRepositoryTree =>", nodes)

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
}

export { CommonGitlabApiAdaptor }
