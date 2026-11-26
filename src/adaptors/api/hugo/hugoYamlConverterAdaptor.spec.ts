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
import { CONTENT_LAYOUT_LEAF_BUNDLE, CONTENT_LAYOUT_SINGLE } from "~/src/adaptors/api/base/contentLayout.ts"
import { GitlabhugoConfig } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoConfig.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { HugoYamlConverterAdaptor } from "~/src/adaptors/api/hugo/hugoYamlConverterAdaptor.ts"

const makePost = (): Post => {
  const post = new Post()
  post.title = "页面目录契约"
  post.wp_slug = "leaf-bundle-contract"
  post.dateCreated = new Date("2026-09-07T10:00:00.000Z")
  post.markdown = "# 页面目录契约"
  post.html = "<h1>页面目录契约</h1>"
  return post
}

const convertUrl = (cfg: HugoConfig | GitlabhugoConfig): string | undefined => {
  const converter = new HugoYamlConverterAdaptor()
  return converter.convertToYaml(makePost(), undefined, cfg).yamlObj.url
}

describe("Hugo YAML 永久链接与内容组织方式", () => {
  it("单文件模式保持既有 /post/<slug>.html 行为", () => {
    const cfg = new HugoConfig("user", "token", "blog", "main")
    cfg.yamlLinkEnabled = true
    cfg.contentLayout = CONTENT_LAYOUT_SINGLE

    expect(convertUrl(cfg)).toBe("/post/leaf-bundle-contract.html")
  })

  it("页面目录模式写入目录式地址，按存储目录推导 section", () => {
    const cfg = new HugoConfig("user", "token", "blog", "main")
    cfg.yamlLinkEnabled = true
    cfg.contentLayout = CONTENT_LAYOUT_LEAF_BUNDLE
    cfg.defaultPath = "content/post"

    expect(convertUrl(cfg)).toBe("/post/leaf-bundle-contract/")
  })

  it("页面目录模式尊重 content/posts 等实际 section", () => {
    const cfg = new HugoConfig("user", "token", "blog", "main")
    cfg.yamlLinkEnabled = true
    cfg.contentLayout = CONTENT_LAYOUT_LEAF_BUNDLE
    cfg.defaultPath = "content/posts"

    expect(convertUrl(cfg)).toBe("/posts/leaf-bundle-contract/")
  })

  it("GitLab Hugo 继承同一规则", () => {
    const cfg = new GitlabhugoConfig("user", "token", "blog", "main")
    cfg.yamlLinkEnabled = true
    cfg.contentLayout = CONTENT_LAYOUT_LEAF_BUNDLE
    cfg.defaultPath = "content/posts"

    expect(convertUrl(cfg)).toBe("/posts/leaf-bundle-contract/")
  })

  it("平台切到 bundle 后，更新旧单文件文章仍写 .html 地址", () => {
    const cfg = new HugoConfig("user", "token", "blog", "main")
    cfg.yamlLinkEnabled = true
    cfg.contentLayout = CONTENT_LAYOUT_LEAF_BUNDLE
    const post = makePost()
    post.postid = "content/post/legacy-single.md"
    const converter = new HugoYamlConverterAdaptor()
    expect(converter.convertToYaml(post, undefined, cfg).yamlObj.url).toBe("/post/leaf-bundle-contract.html")
  })

  it("本地系统导出页面目录不写死 url，交给 Hugo 按导出路径决定", () => {
    const cfg = {
      yamlLinkEnabled: true,
      contentLayout: CONTENT_LAYOUT_LEAF_BUNDLE,
      fsYamlType: "hugo",
    } as any
    const converter = new HugoYamlConverterAdaptor()
    const yamlObj = converter.convertToYaml(makePost(), undefined, cfg).yamlObj
    expect(yamlObj.url).toBeUndefined()
  })

  it("关闭 YAML 永久链接时不写 url", () => {
    const cfg = new HugoConfig("user", "token", "blog", "main")
    cfg.yamlLinkEnabled = false
    cfg.contentLayout = CONTENT_LAYOUT_LEAF_BUNDLE

    expect(convertUrl(cfg)).toBeUndefined()
  })
})
