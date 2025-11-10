/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, it } from "vitest"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import { CommonGitlabApiAdaptor } from "~/src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.ts"

describe("test commonGitlabApiAdaptor", () => {
  const appInstance = new PublisherAppInstance()
  const gitlabCfg = new CommonGitlabConfig("terwer", "", "terwer-github-io", "main")
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
