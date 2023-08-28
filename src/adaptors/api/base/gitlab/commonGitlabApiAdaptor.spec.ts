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

import { describe, it } from "vitest"
import { AppInstance } from "~/src/appInstance.ts"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import { CommonGitlabApiAdaptor } from "~/src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.ts"

describe("test commonGitlabApiAdaptor", () => {
  const appInstance = new AppInstance()
  const gitlabCfg = new CommonGitlabConfig("terwer", "glpat-d2vTv8xEJQwmVUyw4VMr", "terwer-github-io", "main")
  gitlabCfg.apiUrl = "http://localhost:8002"
  gitlabCfg.home = "http://localhost:8002"
  gitlabCfg.defaultMsg = "auto published by siyuan-plugin-publisher"
  gitlabCfg.email = "youweics@163.com"
  gitlabCfg.author = "terwer"
  gitlabCfg.defaultPath = ""
  const api = new CommonGitlabApiAdaptor(appInstance, gitlabCfg)

  it("test getUsersBlogs", async () => {
    const result = await api.getUsersBlogs()
    console.log(result)
  })
})
