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
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
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
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"
import { Vuepress2YamlConverterAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2YamlConverterAdaptor.ts"

// Github 族各平台的构建器约定：文章路由要么由 Front Matter 的链接字段决定，要么完全由文件路径决定。
// 后者（Vuepress2 / Vitepress / Astro / Docsify）不识别任何链接字段，配置页因此不提供「YAML永久链接」开关。
const LINK_FIELDS = ["permalink", "url"]

const GITHUB_PLATFORMS = [
  { name: "Hexo", Config: HexoConfig, Converter: HexoYamlConverterAdaptor },
  { name: "Hugo", Config: HugoConfig, Converter: HugoYamlConverterAdaptor },
  { name: "Jekyll", Config: JekyllConfig, Converter: JekyllYamlConverterAdaptor },
  { name: "Quartz", Config: QuartzConfig, Converter: QuartzYamlConverterAdaptor },
  { name: "Vuepress", Config: VuepressConfig, Converter: VuepressYamlConverterAdaptor },
  { name: "Vuepress2", Config: Vuepress2Config, Converter: Vuepress2YamlConverterAdaptor },
  { name: "Vitepress", Config: VitepressConfig, Converter: VitepressYamlConverterAdaptor },
  { name: "Astro", Config: AstroConfig, Converter: AstroYamlConverterAdaptor },
  { name: "Docsify", Config: DocsifyConfig, Converter: DocsifyYamlConverterAdaptor },
]

function buildConfig(platform: (typeof GITHUB_PLATFORMS)[number]): CommonGithubConfig {
  return safeMergeConfig<CommonGithubConfig>("{}", platform.Config as any, ["terwer", "token", "blog", "main", ""])
}

function frontMatterOf(platform: (typeof GITHUB_PLATFORMS)[number], yamlLinkEnabled: boolean): Record<string, any> {
  const cfg = buildConfig(platform)
  cfg.yamlLinkEnabled = yamlLinkEnabled

  const post = new Post()
  post.title = "永久链接契约"
  post.wp_slug = "yaml-link-contract"
  post.dateCreated = new Date("2026-09-07T10:00:00.000Z")
  post.shortDesc = "YAML 永久链接能力契约"
  post.mt_keywords = "siyuan"
  post.markdown = "# 永久链接契约"
  post.html = "<h1>永久链接契约</h1>"

  const converter = new platform.Converter()
  return converter.convertToYaml(post, undefined, cfg).yamlObj
}

const linkFieldsIn = (yamlObj: Record<string, any>): string[] => LINK_FIELDS.filter((f) => yamlObj?.[f] !== undefined)

describe("Github 族 YAML 永久链接能力契约", () => {
  it("「YAML永久链接」开关只对会写入链接字段的平台展示", () => {
    const supported = GITHUB_PLATFORMS.filter((p) => buildConfig(p).yamlLinkSupported).map((p) => p.name)
    const unsupported = GITHUB_PLATFORMS.filter((p) => !buildConfig(p).yamlLinkSupported).map((p) => p.name)

    expect(supported.sort()).toEqual(["Hexo", "Hugo", "Jekyll", "Quartz", "Vuepress"])
    expect(unsupported.sort()).toEqual(["Astro", "Docsify", "Vitepress", "Vuepress2"])
  })

  it("配置的能力位与转换器实际行为一致", () => {
    for (const platform of GITHUB_PLATFORMS) {
      const writesLink = linkFieldsIn(frontMatterOf(platform, true)).length > 0
      expect(buildConfig(platform).yamlLinkSupported, `${platform.name} 开关开启时应写入链接字段`).toBe(writesLink)
    }
  })

  it("路由由文件路径决定的平台，开关两个位置都不产生链接字段", () => {
    const unsupported = GITHUB_PLATFORMS.filter((p) => !buildConfig(p).yamlLinkSupported)
    expect(unsupported.length).toBeGreaterThan(0)

    for (const platform of unsupported) {
      for (const enabled of [true, false]) {
        const yamlObj = frontMatterOf(platform, enabled)
        expect(linkFieldsIn(yamlObj), `${platform.name} 不应写入 ${LINK_FIELDS.join("/")}`).toEqual([])
      }
    }
  })

  it("受支持平台开启开关后写入的链接指向该文章别名", () => {
    for (const platform of GITHUB_PLATFORMS.filter((p) => buildConfig(p).yamlLinkSupported)) {
      const yamlObj = frontMatterOf(platform, true)
      const link: string = yamlObj.permalink ?? yamlObj.url
      expect(link, `${platform.name} 应写入链接字段`).toBeTruthy()
      // 各平台占位符规则不同：hexo/quartz/jekyll 取 previewPostUrl，hugo/vuepress 用固定的 /post/[slug].html
      expect(link, `${platform.name} 链接应包含文章别名`).toContain("yaml-link-contract")
    }
  })
})
