/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { Post } from "zhi-blog-api"
import { GitlabastroYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-astro/gitlabastroYamlConverterAdaptor.ts"
import { GitlabdocsifyYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-docsify/gitlabdocsifyYamlConverterAdaptor.ts"
import { GitlabhugoYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoYamlConverterAdaptor.ts"
import { GitlabvuepressYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressYamlConverterAdaptor.ts"

const createPost = () => {
  const post = new Post()
  post.title = "回读验证"
  post.shortDesc = "回读验证摘要"
  post.mt_excerpt = "回读验证摘要"
  post.mt_keywords = "标签甲,标签乙"
  post.categories = ["验证分类"]
  post.markdown = "# 正文"
  post.html = "<h1>正文</h1>"
  return post
}

describe("GitLab YAML readback", () => {
  it("fills shortDesc for Astro/Docsify, whose YAML uses description", () => {
    for (const adaptor of [new GitlabastroYamlConverterAdaptor(), new GitlabdocsifyYamlConverterAdaptor()]) {
      const back = adaptor.convertToAttr(new Post(), adaptor.convertToYaml(createPost()))
      expect(back.shortDesc).toBe("回读验证摘要")
      expect(back.mt_excerpt).toBe("回读验证摘要")
    }
  })

  it("normalizes array/string tags and never throws on malformed tags", () => {
    const vuepress = new GitlabvuepressYamlConverterAdaptor()
    const back = vuepress.convertToAttr(new Post(), { yamlObj: { tags: "标签甲,标签乙" } } as any)
    expect(back.mt_keywords).toBe("标签甲,标签乙")

    const hugo = new GitlabhugoYamlConverterAdaptor()
    const hugoBack = hugo.convertToAttr(new Post(), { yamlObj: { tags: "标签甲,标签乙" } } as any)
    expect(hugoBack.mt_keywords).toBe("标签甲,标签乙")
  })
})
