/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { PicbedServiceTypeEnum } from "zhi-blog-api"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"

// CommonBlogConfig 分支
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/typechoConfig.ts"
import { JvueConfig } from "~/src/adaptors/api/jvue/jvueConfig.ts"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { WordpressdotcomConfig } from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomConfig.ts"
import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { ConfluenceConfig } from "~/src/adaptors/api/confluence/confluenceConfig.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"
import { TelegraphConfig } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"

// CommonGithubConfig 分支（GitHub / GitLab 两族共用）
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { JekyllConfig } from "~/src/adaptors/api/jekyll/jekyllConfig.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { VuepressConfig } from "~/src/adaptors/api/vuepress/vuepressConfig.ts"
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"
import { VitepressConfig } from "~/src/adaptors/api/vitepress/vitepressConfig.ts"
import { AstroConfig } from "~/src/adaptors/api/astro/astroConfig.ts"
import { GitlabhexoConfig } from "~/src/adaptors/api/gitlab-hexo/gitlabhexoConfig.ts"
import { GitlabastroConfig } from "~/src/adaptors/api/gitlab-astro/gitlabastroConfig.ts"

// Web 族（网页 Cookie / 平台图床）
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { JianshuConfig } from "~/src/adaptors/web/jianshu/jianshuConfig.ts"
import { JuejinConfig } from "~/src/adaptors/web/juejin/juejinConfig.ts"
import { WechatConfig } from "~/src/adaptors/web/wechat/wechatConfig.ts"
import { BilibiliConfig } from "~/src/adaptors/web/bilibili/bilibiliConfig.ts"
import { YuquewebConfig } from "~/src/adaptors/web/yuqueweb/YuquewebConfig.ts"

// 文件系统
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"

/**
 * 图床默认值回归
 *
 * 规则：平台若声明「支持平台图床」（bundledPicbedSupported 为 true / 或实现了
 * newMediaObject），新建账号的默认图床就必须是 Bundled，否则用户发带图文章时
 * 图片不会被上传，而界面上看起来"发成功了"——图丢失且难以察觉。
 *
 * 反例保护：Notion / Telegraph / 语雀 确实没有平台图床能力，保持 None 是正确行为，
 * 不能被"统一成 Bundled"误伤。
 */
const ARGS = ["http://localhost", "http://localhost/api", "user", "pass", "", "", ""]

const bundledByDefault: Array<[string, any]> = [
  // MetaWeblog 协议族：均由 metaweblogBlogApiAdaptor.newMediaObject 提供平台图床
  ["Cnblogs", CnblogsConfig],
  ["Typecho", TypechoConfig],
  ["Jvue", JvueConfig],
  ["Wordpress", WordpressConfig],
  ["Wordpressdotcom", WordpressdotcomConfig],
  ["Metaweblog", MetaweblogConfig],
  // 各自实现 newMediaObject
  ["Halo", HaloConfig],
  ["Confluence", ConfluenceConfig],
  // GitHub 族
  ["Hexo", HexoConfig],
  ["Hugo", HugoConfig],
  ["Jekyll", JekyllConfig],
  ["Quartz", QuartzConfig],
  ["Vuepress", VuepressConfig],
  ["Vuepress2", Vuepress2Config],
  ["Vitepress", VitepressConfig],
  ["Astro", AstroConfig],
  // GitLab 族
  ["Gitlabhexo", GitlabhexoConfig],
  ["Gitlabastro", GitlabastroConfig],
  // Web 族
  ["Zhihu", ZhihuConfig],
  ["Csdn", CsdnConfig],
  ["Jianshu", JianshuConfig],
  ["Juejin", JuejinConfig],
  ["Wechat", WechatConfig],
  ["Bilibili", BilibiliConfig],
  ["Yuqueweb", YuquewebConfig],
  // 文件系统
  ["LocalSystem", LocalSystemConfig],
]

const noneByDefault: Array<[string, any]> = [
  // 这三个平台没有平台图床能力（bundledPicbedSupported = false），保持 None 才对
  ["Notion", NotionConfig],
  ["Telegraph", TelegraphConfig],
  ["Yuque", YuqueConfig],
]

describe("picbed default matches platform capability", () => {
  it.each(bundledByDefault)("%s 新建账号默认使用平台图床", (_name, ConfigClass) => {
    const cfg: any = safeMergeConfig("{}", ConfigClass, ARGS)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it.each(noneByDefault)("%s 无平台图床能力，默认不使用图床", (_name, ConfigClass) => {
    const cfg: any = safeMergeConfig("{}", ConfigClass, ARGS)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.None)
  })

  it("不会覆盖用户显式选择的「不使用」", () => {
    const cfg: any = safeMergeConfig(
      JSON.stringify({ picbedService: PicbedServiceTypeEnum.None }),
      TypechoConfig,
      ARGS
    )
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.None)
  })

  it("不会覆盖用户显式选择的 PicGo", () => {
    const cfg: any = safeMergeConfig(
      JSON.stringify({ picbedService: PicbedServiceTypeEnum.PicGo }),
      TypechoConfig,
      ARGS
    )
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.PicGo)
  })
})
