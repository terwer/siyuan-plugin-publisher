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
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"

// 发布链路里的 cfg 来自设置的反序列化结果，是普通对象而不是配置类实例（issue #2054）。
// 这里用 JSON 往返模拟这一形态，钉住「自定义预览规则必须生效」的契约。
const toStoredConfig = <T extends object>(cfg: T): T => JSON.parse(JSON.stringify(cfg)) as T

const buildPost = () => {
  const post = new Post()
  post.title = "自定义预览规则"
  post.wp_slug = "custom-preview-rule"
  post.dateCreated = new Date("2026-01-02T03:04:05.000Z")
  post.dateUpdated = new Date("2026-01-02T03:04:05.000Z")
  post.markdown = "# 正文"
  post.html = "<h1>正文</h1>"
  return post
}

// 日期占位符使用本地时间，按同一格式化函数推算期望值，避免测试依赖运行环境时区
const localDateParts = () => {
  const formatted = DateUtil.formatIsoToZh(buildPost().dateCreated.toISOString(), true)
  return formatted.split(" ")[0].split("-")
}

const PLATFORMS = [
  { name: "Hexo", Config: HexoConfig, Converter: HexoYamlConverterAdaptor },
  { name: "Quartz", Config: QuartzConfig, Converter: QuartzYamlConverterAdaptor },
]

describe("Github 族自定义预览规则在发布链路上生效", () => {
  for (const platform of PLATFORMS) {
    it(`${platform.name} 的普通对象配置也会按自定义规则生成 permalink`, () => {
      const instance = new platform.Config("terwer", "token", "blog", "main")
      const stored = toStoredConfig(instance)
      stored.previewPostUrl = "/[yyyy]/[mm]/[dd]/[postid].html"
      stored.yamlLinkEnabled = true

      // 普通对象没有类原型：这里确认它确实不是实例，避免用例退化成实例路径
      expect(stored instanceof platform.Config).toBe(false)

      const converter = new platform.Converter()
      const yamlObj = converter.convertToYaml(buildPost(), undefined, stored).yamlObj
      const [yyyy, mm, dd] = localDateParts()
      expect(yamlObj.permalink).toBe(`/${yyyy}/${mm}/${dd}/custom-preview-rule.html`)
    })

    it(`${platform.name} 的默认规则仍指向文章别名`, () => {
      const stored = toStoredConfig(new platform.Config("terwer", "token", "blog", "main"))
      stored.yamlLinkEnabled = true

      const converter = new platform.Converter()
      const yamlObj = converter.convertToYaml(buildPost(), undefined, stored).yamlObj
      expect(yamlObj.permalink).toBe("/post/custom-preview-rule.html")
    })
  }
})
