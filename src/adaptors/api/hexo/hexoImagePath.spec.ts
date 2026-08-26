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
import { HexoApiAdaptor } from "~/src/adaptors/api/hexo/hexoApiAdaptor.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"

describe("Hexo image path contract", () => {
  it("commits images to source/images and links them with the relative ../images path", () => {
    const cfg = safeMergeConfig<HexoConfig>("{}", HexoConfig, ["", "", "", "", ""])

    // 提交到仓库的目录：source/images（Hexo 源文件目录）
    expect(cfg.imageStorePath).toBe("source/images")
    // 文章里使用的链接：../images/...（相对路径，源码与构建产物均可显示）
    //   - 源码 source/_posts/x.md：../images/ 解析到 source/images/
    //   - 构建后文章 URL 恒为 /post/{slug}.html（站点根下 1 层）：../images/ 解析到站点根 /images/
    expect(cfg.imageLinkPath).toBe("../images")
  })

  it("emits a relative ../images/{name} link while committing images to source/images", async () => {
    const cfg = safeMergeConfig<HexoConfig>("{}", HexoConfig, ["", "", "", "", ""])
    const adapter = new HexoApiAdaptor({} as any, cfg as any)

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

    // 文章内图片链接为相对路径 ../images/{name}，提交到仓库的目录为 source/images
    expect(attachment.url).toBe("../images/cat-123.jpg")
    expect(attachment.url.startsWith("/")).toBe(false)
    expect(committedPaths).toEqual(["source/images/cat-123.jpg"])
  })
})
