/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { AstroConfig } from "~/src/adaptors/api/astro/astroConfig.ts"
import { AstroYamlConverterAdaptor } from "~/src/adaptors/api/astro/astroYamlConverterAdaptor.ts"
import { DocsifyConfig } from "~/src/adaptors/api/docsify/docsifyConfig.ts"
import { DocsifyYamlConverterAdaptor } from "~/src/adaptors/api/docsify/docsifyYamlConverterAdaptor.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { HugoYamlConverterAdaptor } from "~/src/adaptors/api/hugo/hugoYamlConverterAdaptor.ts"
import { JekyllConfig } from "~/src/adaptors/api/jekyll/jekyllConfig.ts"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"
import { VitepressConfig } from "~/src/adaptors/api/vitepress/vitepressConfig.ts"
import { VitepressYamlConverterAdaptor } from "~/src/adaptors/api/vitepress/vitepressYamlConverterAdaptor.ts"
import { VuepressConfig } from "~/src/adaptors/api/vuepress/vuepressConfig.ts"
import { VuepressYamlConverterAdaptor } from "~/src/adaptors/api/vuepress/vuepressYamlConverterAdaptor.ts"
import { formatDateTimeWithOffset, formatLocalDate } from "~/src/utils/dateUtils.ts"

// issue #1719：Front Matter 的日期必须表达「作者本地时间 + 显式时区偏移」，
// 不能固定加 8 小时，否则非 UTC+8 作者的文章会被写成第二天。
const buildPost = () => {
  const post = new Post()
  post.title = "时区契约"
  post.wp_slug = "timezone-contract"
  post.markdown = "# 正文"
  post.html = "<h1>正文</h1>"
  // 欧洲/柏林 2025-04-23 20:00（夏令时 +02:00）
  post.dateCreated = new Date("2025-04-23T18:00:00.000Z")
  post.dateUpdated = new Date("2025-04-24T04:30:00.000Z")
  post.shortDesc = "摘要"
  post.mt_keywords = "siyuan,timezone"
  post.categories = ["技术"]
  return post
}

type DateTimeCase = {
  name: string
  Config: new (...args: any[]) => BlogConfig
  Converter: new () => YamlConvertAdaptor
  fields: { key: string; source: "dateCreated" | "dateUpdated" }[]
}

const DATE_TIME_CASES: DateTimeCase[] = [
  {
    name: "Jekyll",
    Config: JekyllConfig,
    Converter: JekyllYamlConverterAdaptor,
    fields: [{ key: "date", source: "dateCreated" }],
  },
  {
    name: "Hexo",
    Config: HexoConfig,
    Converter: HexoYamlConverterAdaptor,
    fields: [
      { key: "date", source: "dateCreated" },
      { key: "updated", source: "dateUpdated" },
    ],
  },
  {
    name: "Hugo",
    Config: HugoConfig,
    Converter: HugoYamlConverterAdaptor,
    fields: [
      { key: "date", source: "dateCreated" },
      { key: "lastmod", source: "dateUpdated" },
    ],
  },
  {
    name: "Vitepress",
    Config: VitepressConfig,
    Converter: VitepressYamlConverterAdaptor,
    fields: [{ key: "date", source: "dateCreated" }],
  },
  {
    name: "Vuepress",
    Config: VuepressConfig,
    Converter: VuepressYamlConverterAdaptor,
    fields: [{ key: "date", source: "dateCreated" }],
  },
  {
    name: "Quartz",
    Config: QuartzConfig,
    Converter: QuartzYamlConverterAdaptor,
    fields: [
      { key: "date", source: "dateCreated" },
      { key: "updated", source: "dateUpdated" },
    ],
  },
]

describe("静态站 Front Matter 发布时间", () => {
  for (const platform of DATE_TIME_CASES) {
    it(`${platform.name} 写入本地时间与显式偏移，且可无损读回`, () => {
      const post = buildPost()
      const cfg = new platform.Config("terwer", "token", "blog", "main")
      const converter = new platform.Converter()
      const yamlFormatObj = converter.convertToYaml(post, undefined, cfg)

      for (const field of platform.fields) {
        const source = post[field.source] as Date
        const value = yamlFormatObj.yamlObj[field.key]
        expect(value, `${platform.name}.${field.key}`).toBe(formatDateTimeWithOffset(source))
        expect(value, `${platform.name}.${field.key} 应带显式偏移`).toMatch(/[+-]\d{2}:\d{2}$/)
        expect(new Date(value).getTime(), `${platform.name}.${field.key} 应保持同一绝对时刻`).toBe(source.getTime())
      }

      const roundTrip = converter.convertToAttr(new Post(), yamlFormatObj, cfg)
      expect(roundTrip.dateCreated?.getTime()).toBe(post.dateCreated.getTime())
      if (platform.fields.some((field) => field.source === "dateUpdated")) {
        expect(roundTrip.dateUpdated?.getTime()).toBe(post.dateUpdated.getTime())
      }
    })
  }

  const DATE_ONLY_CASES = [
    { name: "Docsify", Config: DocsifyConfig, Converter: DocsifyYamlConverterAdaptor, key: "date" },
    { name: "Astro", Config: AstroConfig, Converter: AstroYamlConverterAdaptor, key: "pubDate" },
  ] as const

  for (const platform of DATE_ONLY_CASES) {
    it(`${platform.name} 使用本地日历日，不使用 UTC 日期`, () => {
      const post = buildPost()
      const cfg = new platform.Config("terwer", "token", "blog", "main")
      const converter = new platform.Converter()
      const yamlFormatObj = converter.convertToYaml(post, undefined, cfg)

      expect(yamlFormatObj.yamlObj[platform.key]).toBe(formatLocalDate(post.dateCreated))
      expect(yamlFormatObj.yamlObj[platform.key]).not.toContain("T")

      const roundTrip = converter.convertToAttr(new Post(), {
        yamlObj: yamlFormatObj.yamlObj,
      } as YamlFormatObj)
      expect(formatLocalDate(roundTrip.dateCreated)).toBe(formatLocalDate(post.dateCreated))
    })
  }
})
