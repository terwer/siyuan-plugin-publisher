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
import { QuartzApiAdaptor } from "~/src/adaptors/api/quartz/quartzApiAdaptor.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"

describe("Quartz image path contract", () => {
  it("commits images to assets/images and links them with the absolute /assets/images path", () => {
    const cfg = safeMergeConfig<QuartzConfig>("{}", QuartzConfig, ["", "", "", "", ""])

    // 提交到仓库的目录：assets/images
    expect(cfg.imageStorePath).toBe("assets/images")
    // 文章里使用的链接：/assets/images/{name}（绝对路径）
    expect(cfg.imageLinkPath).toBe("assets/images")
  })

  it("emits an absolute /assets/images/{name} link while committing images to assets/images", async () => {
    const cfg = safeMergeConfig<QuartzConfig>("{}", QuartzConfig, ["", "", "", "", ""])
    const adapter = new QuartzApiAdaptor({} as any, cfg as any)

    // 记录提交到仓库时的保存路径
    const committedPaths: string[] = []
    ;(adapter as any).githubClient = {
      publishGithubPage: async (path: string) => {
        committedPaths.push(path)
        return {}
      },
    }

    const mediaObject = new MediaObject("cat-123.jpg", "image/jpeg", new Uint8Array())
    const attachment = await adapter.newMediaObject(mediaObject)

    // 文章内图片链接为绝对路径 /assets/images/{name}，提交到仓库的目录为 assets/images
    expect(attachment.url).toBe("/assets/images/cat-123.jpg")
    expect(attachment.url.startsWith("/")).toBe(true)
    expect(committedPaths).toEqual(["assets/images/cat-123.jpg"])
  })
})
