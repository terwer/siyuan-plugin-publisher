/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { BlogConfig, Post } from "zhi-blog-api"
import dayjs from "dayjs"
import { AstroYamlConverterAdaptor } from "~/src/adaptors/api/astro/astroYamlConverterAdaptor.ts"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"
import { VitepressYamlConverterAdaptor } from "~/src/adaptors/api/vitepress/vitepressYamlConverterAdaptor.ts"

const buildPost = () => {
  const post = new Post()
  post.title = "占位符集成测试"
  post.wp_slug = "placeholder-integration"
  post.dateCreated = new Date("2026-01-02T03:04:05.000Z")
  post.dateUpdated = new Date("2026-02-03T04:05:06.000Z")
  post.mt_keywords = "思源, 发布"
  post.categories = ["技术"]
  post.markdown = "# 正文"
  post.html = "<h1>正文</h1>"
  return post
}

// 发布链路上的 cfg 来自设置反序列化，是普通对象而不是配置类实例（issue #2054）
const buildCfg = (dynYamlCfg?: string) => ({ yamlLinkEnabled: false, dynYamlCfg }) as unknown as BlogConfig

describe("静态站 YAML 转换器接入 YAML 预设占位符", () => {
  it("Astro 把占位符解析后写入 Front Matter", () => {
    const post = buildPost()
    const converter = new AstroYamlConverterAdaptor()
    const yamlFormatObj = converter.convertToYaml(
      post,
      undefined,
      buildCfg('{"updatedDate": "[createDate-YYYY-MM-DD]", "tags": "[tags]", "author": "[title]"}')
    )

    expect(yamlFormatObj.yamlObj.updatedDate).toBe(dayjs(post.dateCreated).format("YYYY-MM-DD"))
    expect(yamlFormatObj.yamlObj.tags).toEqual(["思源", "发布"])
    expect(yamlFormatObj.yamlObj.author).toBe("占位符集成测试")
    expect(yamlFormatObj.formatter).toContain("updatedDate:")
  })

  it("Vitepress 在预设配置为空时保留平台默认字段", () => {
    const converter = new VitepressYamlConverterAdaptor()
    const yamlObj = converter.convertToYaml(buildPost(), undefined, buildCfg("")).yamlObj
    expect(yamlObj.outline).toBe("deep")
    expect(yamlObj.sidebar).toBe(false)
    expect(yamlObj.prev).toBe(false)
    expect(yamlObj.next).toBe(false)
  })

  it("Vitepress 自定义预设配置仍按同名覆盖语义处理，不补默认字段", () => {
    const converter = new VitepressYamlConverterAdaptor()
    const yamlObj = converter.convertToYaml(buildPost(), undefined, buildCfg('{"outline": "local"}')).yamlObj
    expect(yamlObj.outline).toBe("local")
    expect(yamlObj.sidebar).toBeUndefined()
  })

  it("Jekyll 自定义预设配置覆盖平台默认字段（layout 不再自动补）", () => {
    const converter = new JekyllYamlConverterAdaptor()
    const yamlObj = converter.convertToYaml(buildPost(), undefined, buildCfg('{"published": false}')).yamlObj
    expect(yamlObj.published).toBe(false)
    expect(yamlObj.layout).toBeUndefined()
  })
})
