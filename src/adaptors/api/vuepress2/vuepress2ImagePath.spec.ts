/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { MediaObject } from "zhi-blog-api"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { Vuepress2ApiAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2ApiAdaptor.ts"
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"

describe("Vuepress2 image path contract", () => {
  it("uses colocated [docpath]/images store rule and ./images relative link rule", () => {
    const cfg = safeMergeConfig<Vuepress2Config>("{}", Vuepress2Config, ["", "", "", "", ""])

    // 提交目录规则：文章所在目录下的 images 子目录（资源就近放置）
    expect(cfg.imageStorePath).toBe("[docpath]/images")
    // 文章内引用：相对路径 ./images/...（Vuepress2 构建时随页面输出）
    expect(cfg.imageLinkPath).toBe("./images")
  })

  it("commits images to {docpath}/images and emits a relative ./images/{name} link", async () => {
    const cfg = safeMergeConfig<Vuepress2Config>("{}", Vuepress2Config, ["", "", "", "", ""])
    // 发布目录（blogid）决定 [docpath] 解析结果
    cfg.blogid = "src/post"
    const adapter = new Vuepress2ApiAdaptor({} as any, cfg as any)

    const committedPaths: string[] = []
    ;(adapter as any).githubClient = {
      publishGithubPage: async (path: string) => {
        committedPaths.push(path)
        return {}
      },
    }

    const mediaObject = new MediaObject("cat-123.jpg", "image/jpeg", new Uint8Array())
    // 真实发布链路中 baseExtendApi 会为 mediaObject 附加 post（无分类时 [docpath] 回退到 blogid）
    ;(mediaObject as any).post = { cate_slugs: [] }
    const attachment = await adapter.newMediaObject(mediaObject)

    // 提交到文章所在目录的 images 子目录；文章内使用相对链接 ./images/{name}
    expect(committedPaths).toEqual(["src/post/images/cat-123.jpg"])
    expect(attachment.url).toBe("./images/cat-123.jpg")
    expect(attachment.url.startsWith("/")).toBe(false)
  })
})
