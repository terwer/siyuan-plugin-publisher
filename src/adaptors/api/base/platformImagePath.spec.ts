/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { MediaObject, Post } from "zhi-blog-api"
import { resolvePlatformImagePath } from "~/src/adaptors/api/base/platformImagePath.ts"

const makeMedia = (name: string, cateSlugs?: string[]): MediaObject => {
  const media = new MediaObject(name, "image/png", new Uint8Array([1, 2, 3]))
  const post = new Post()
  if (cateSlugs) {
    post.cate_slugs = cateSlugs
  }
  media.post = post
  return media
}

/**
 * 图片落库路径规则（GitHub 与 GitLab 两族共用）
 *
 * 背景：#18 Gitlabvuepress2 实测发现 GitLab 适配器未处理 `[docpath]`，
 * 于是仓库里被建出了字面的 `[docpath]/images/` 目录（GitHub 族是对的）。
 * 这里把三种写法钉死，避免两族再次漂移。
 */
describe("resolvePlatformImagePath", () => {
  it("[docpath] 取文章所在目录，图片就近落到其 images 子目录", () => {
    const media = makeMedia("cat.png", ["src/post"])
    const { imagePath, absImgPath } = resolvePlatformImagePath("[docpath]/images", media, "images", "src/post")

    expect(imagePath).toBe("src/post/images/cat.png")
    expect(absImgPath).toBe("/src/post/images/cat.png")
  })

  it("[docpath] 拿不到文章目录时回落到 fallbackDocPath", () => {
    const media = makeMedia("cat.png")
    const { imagePath } = resolvePlatformImagePath("[docpath]/images", media, "images", "docs")

    expect(imagePath).toBe("docs/images/cat.png")
  })

  it("相对链接 ./ 与 ../ 保留相对前缀，不前置站点根斜杠", () => {
    const media = makeMedia("cat.png")

    expect(resolvePlatformImagePath("./images", media, "images", "docs").imagePath).toBe("./images/cat.png")
    expect(resolvePlatformImagePath("../images", media, "images", "docs").imagePath).toBe("../images/cat.png")
  })

  it("普通目录按仓库根解析，空值回落到 defaultPath", () => {
    const media = makeMedia("cat.png")

    expect(resolvePlatformImagePath("static/images", media, "images", "docs").imagePath).toBe("static/images/cat.png")
    expect(resolvePlatformImagePath("", media, "images", "docs").imagePath).toBe("images/cat.png")
  })

  it("不产生字面的 [docpath] 目录（回归 #18 Gitlabvuepress2）", () => {
    const media = makeMedia("cat.png", ["src/post"])
    const { imagePath } = resolvePlatformImagePath("[docpath]/images", media, "images", "src/post")

    expect(imagePath).not.toContain("[docpath]")
  })
})
