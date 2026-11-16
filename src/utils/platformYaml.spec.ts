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
import { DateUtil } from "zhi-common"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"
import { buildPlatformYamlFormatObj, mergeYamlObjs } from "~/src/utils/platformYaml.ts"

const buildPost = () => {
  const post = new Post()
  post.title = "同步修改"
  post.wp_slug = "sync-edit"
  post.markdown = "# 正文"
  post.html = "<h1>正文</h1>"
  post.dateCreated = new Date("2025-12-31T01:00:00.000Z")
  // 用户在详细模式里改过的更新时间
  post.dateUpdated = new Date("2026-06-06T06:06:06.000Z")
  // 已保存的 YAML：含用户手写的额外字段
  post.yaml = "---\ntitle: 旧标题\nupdated: '2026-01-01 09:00:00'\nsticky: 1\n---"
  return post
}

const buildCfg = () => {
  const cfg = new HexoConfig("terwer", "token", "blog", "main")
  cfg.yamlLinkEnabled = true
  return cfg
}

describe("mergeYamlObjs", () => {
  it("生成结果覆盖同名键，已保存的额外字段保留", () => {
    expect(mergeYamlObjs({ title: "新标题" }, { title: "旧标题", sticky: 1 })).toEqual({
      title: "新标题",
      sticky: 1,
    })
  })

  it("生成结果里的 undefined 不覆盖已保存值", () => {
    expect(mergeYamlObjs({ shortDesc: undefined }, { shortDesc: "旧摘要" })).toEqual({ shortDesc: "旧摘要" })
  })
})

describe("buildPlatformYamlFormatObj", () => {
  it("按当前模型重算，包含修改后的更新时间并保留手写字段", async () => {
    const post = buildPost()
    const yfmObj = await buildPlatformYamlFormatObj(new HexoYamlConverterAdaptor(), post, buildCfg())

    expect(yfmObj.yamlObj.title).toBe("同步修改")
    const expectedUpdated = DateUtil.formatIsoToZh(post.dateUpdated!.toISOString(), true)
    expect(yfmObj.yamlObj.updated).toBe(expectedUpdated)
    // 手写在已保存 YAML 里的字段不能丢
    expect(yfmObj.yamlObj.sticky).toBe(1)
    expect(yfmObj.formatter).toContain("sticky: 1")
    expect(yfmObj.mdFullContent.startsWith("---")).toBe(true)
  })

  it("没有已保存 YAML 时直接使用适配器结果", async () => {
    const post = buildPost()
    post.yaml = ""
    const yfmObj = await buildPlatformYamlFormatObj(new HexoYamlConverterAdaptor(), post, buildCfg())

    expect(yfmObj.yamlObj.title).toBe("同步修改")
    expect(yfmObj.yamlObj.sticky).toBeUndefined()
  })
})
