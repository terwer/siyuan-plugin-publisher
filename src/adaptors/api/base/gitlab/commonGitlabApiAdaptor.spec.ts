/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
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
    // 单测不依赖本地 GitLab 服务；mock appInstance.fetch 返回一个仓库树节点。
    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify([
          {
            id: "1",
            name: "src",
            type: "tree",
            path: "src",
          },
        ]),
    }))
    appInstance.fetch = mockFetch

    const result = await api.getUsersBlogs()
    console.log(result)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
    expect(result[0].blogid).toBe("")
    expect(result[0].blogName).toBe("")
  })
})
