/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 已验证平台的「真实渲染行」冻结表 —— 字段指引回归尺的单一数据源。
 *
 * 这张表**不是**从配置类构造函数推导出来的，而是按各平台配置页在宿主里**真实渲染的行**逐站冻结：
 * 平台 hook 会在运行时改开关（`useTelegraphApi` 置 `usernameEnabled=true`；
 * `useBilibiliWeb`/`useZhihuWeb`/`useJianshuWeb`/`useJuejinWeb` 置 `knowledgeSpaceEnabled=true`），
 * GitHub 族「图片存储目录 / 图片访问链接」两行还取决于当前图床值（`picbedService === Bundled`）；
 * 宿主里不渲染的 `middlewareUrl`、非 `isCorsProxy` 平台的 `corsAnywhereUrl` 都不在必填集内。
 *
 * 消费者：
 *   · `fieldGuideRulers.spec.ts` —— 键尺（fields 的键必须是配置实例真实属性）与覆盖尺（必须覆盖本表 required）；
 *   · `tourAnchors.spec.ts` —— 引导锚点契约（tour 的锚点必须是该平台真实渲染的锚点，鉴权行按 passwordType 三选一）。
 *
 * 维护约定：**新增/拆分平台后必须在这里补一行**。带 `fields` 的 platform-config 页面若不在本表内，
 * `fieldGuideRulers.spec.ts` 的第三把守卫尺会失败并点名该页面。
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { PasswordType } from "zhi-blog-api"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"
import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { TelegraphConfig } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { ConfluenceConfig } from "~/src/adaptors/api/confluence/confluenceConfig.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { JekyllConfig } from "~/src/adaptors/api/jekyll/jekyllConfig.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { VuepressConfig } from "~/src/adaptors/api/vuepress/vuepressConfig.ts"
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"
import { VitepressConfig } from "~/src/adaptors/api/vitepress/vitepressConfig.ts"
import { AstroConfig } from "~/src/adaptors/api/astro/astroConfig.ts"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { YuquewebConfig } from "~/src/adaptors/web/yuqueweb/YuquewebConfig.ts"
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { JianshuConfig } from "~/src/adaptors/web/jianshu/jianshuConfig.ts"
import { JuejinConfig } from "~/src/adaptors/web/juejin/juejinConfig.ts"
import { WechatConfig } from "~/src/adaptors/web/wechat/wechatConfig.ts"
import { BilibiliConfig } from "~/src/adaptors/web/bilibili/bilibiliConfig.ts"
import { HalowebConfig } from "~/src/adaptors/web/haloweb/HalowebConfig.ts"
import { yuqueHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-yuque"
import { notionHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-notion"
import { haloHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-halo"
import { telegraphHelpConfig } from "~/src/helpConfigs/pages/platform-config/telegraph"
import { confluenceHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-confluence"
import { hexoHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-github-hexo"
import { hugoHelpConfig } from "~/src/helpConfigs/pages/platform-config/github-hugo"
import { jekyllHelpConfig } from "~/src/helpConfigs/pages/platform-config/github-jekyll"
import { quartzHelpConfig } from "~/src/helpConfigs/pages/platform-config/github-quartz"
import { vuepressHelpConfig } from "~/src/helpConfigs/pages/platform-config/github-vuepress"
import { vuepress2HelpConfig } from "~/src/helpConfigs/pages/platform-config/github-vuepress2"
import { vitepressHelpConfig } from "~/src/helpConfigs/pages/platform-config/github-vitepress"
import { astroHelpConfig } from "~/src/helpConfigs/pages/platform-config/github-astro"
import { cnblogsHelpConfig } from "~/src/helpConfigs/pages/platform-config/metaweblog-cnblogs"
import { wordpressHelpConfig } from "~/src/helpConfigs/pages/platform-config/wordpress-wordpress"
import { localSystemHelpConfig } from "~/src/helpConfigs/pages/platform-config/fs-local-system"
import { yuquewebHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-yuqueweb"
import { zhihuHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-zhihu"
import { csdnHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-csdn"
import { jianshuHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-jianshu"
import { juejinHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-juejin"
import { wechatHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-wechat"
import { bilibiliHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-bilibili"
import { halowebHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-haloweb"

export type VerifiedPlatformRows = {
  /** 预置平台 key（= pageId 去掉 `platform-config/` 前缀） */
  platformKey: string
  /** 该平台的专属页面帮助配置 */
  config: PageHelpConfig
  /** 该平台运行时的配置类 */
  ConfigClass: new (...args: any[]) => any
  /** 该平台配置页真实渲染行所绑定的配置属性名（= 字段指引的 `field` 键） */
  required: string[]
  /** 平台 hook 在运行时覆盖的开关（构造函数默认值不足以推导渲染事实） */
  hookFlags?: Record<string, unknown>
}

/** 共用表单里与平台无关的固定行 */
const COMMON_FORM = ["home", "apiUrl", "password", "previewUrl", "pageType", "picbedService"]

/** GitHub 族专有行 */
const GITHUB_ROWS = [
  "blogid",
  "githubRepo",
  "githubBranch",
  "defaultPath",
  "mdFilenameRule",
  "previewPostUrl",
  "dynYamlCfg",
  "defaultMsg",
  "author",
  "email",
  "site",
  "imageStorePath",
  "imageLinkPath",
]

export const VERIFIED_PLATFORM_ROWS: VerifiedPlatformRows[] = [
  {
    platformKey: "common_Yuque",
    config: yuqueHelpConfig,
    ConfigClass: YuqueConfig,
    required: [...COMMON_FORM, "username", "blogid"],
  },
  {
    platformKey: "common_Notion",
    config: notionHelpConfig,
    ConfigClass: NotionConfig,
    required: [...COMMON_FORM, "blogid"],
  },
  {
    platformKey: "common_Halo",
    config: haloHelpConfig,
    ConfigClass: HaloConfig,
    required: [...COMMON_FORM, "username"],
  },
  {
    platformKey: "common_Telegraph",
    config: telegraphHelpConfig,
    ConfigClass: TelegraphConfig,
    required: [...COMMON_FORM, "username", "corsAnywhereUrl", "postType", "accessToken", "saveHash", "forceReAuth"],
    // useTelegraphApi.ts:53 运行时打开用户名行
    hookFlags: { usernameEnabled: true },
  },
  {
    platformKey: "common_Confluence",
    config: confluenceHelpConfig,
    ConfigClass: ConfluenceConfig,
    required: [...COMMON_FORM, "blogid", "parentPageId"],
  },
  {
    platformKey: "github_Hexo",
    config: hexoHelpConfig,
    ConfigClass: HexoConfig,
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS, "yamlLinkEnabled"],
  },
  {
    platformKey: "github_Hugo",
    config: hugoHelpConfig,
    ConfigClass: HugoConfig,
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS, "yamlLinkEnabled"],
  },
  {
    platformKey: "github_Jekyll",
    config: jekyllHelpConfig,
    ConfigClass: JekyllConfig,
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS, "yamlLinkEnabled"],
  },
  {
    platformKey: "github_Quartz",
    config: quartzHelpConfig,
    ConfigClass: QuartzConfig,
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS, "yamlLinkEnabled"],
  },
  {
    platformKey: "github_Vuepress",
    config: vuepressHelpConfig,
    ConfigClass: VuepressConfig,
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS, "yamlLinkEnabled"],
  },
  {
    platformKey: "github_Vuepress2",
    config: vuepress2HelpConfig,
    ConfigClass: Vuepress2Config,
    // 该平台转换器不消费 yamlLinkEnabled，表单也不渲染该行
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS],
  },
  {
    platformKey: "github_Vitepress",
    config: vitepressHelpConfig,
    ConfigClass: VitepressConfig,
    // 该平台转换器不消费 yamlLinkEnabled，表单也不渲染该行
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS],
  },
  {
    platformKey: "github_Astro",
    config: astroHelpConfig,
    ConfigClass: AstroConfig,
    // 该平台转换器不消费 yamlLinkEnabled，表单也不渲染该行
    required: [...COMMON_FORM, "username", ...GITHUB_ROWS],
  },
  {
    platformKey: "metaweblog_Cnblogs",
    config: cnblogsHelpConfig,
    ConfigClass: CnblogsConfig,
    required: [...COMMON_FORM, "username"],
  },
  {
    platformKey: "wordpress_Wordpress",
    config: wordpressHelpConfig,
    ConfigClass: WordpressConfig,
    required: [...COMMON_FORM, "username"],
  },
  {
    platformKey: "fs_LocalSystem",
    config: localSystemHelpConfig,
    ConfigClass: LocalSystemConfig,
    // 本地系统无鉴权行（passwordType=None），独有 3 行：存储路径 / 媒体存储路径 / YAML 类型
    required: ["pageType", "picbedService", "storePath", "imageStorePath", "fsYamlType"],
  },
  {
    platformKey: "custom_Yuqueweb",
    config: yuquewebHelpConfig,
    ConfigClass: YuquewebConfig,
    required: [...COMMON_FORM, "blogid"],
  },
  {
    platformKey: "custom_Haloweb",
    config: halowebHelpConfig,
    ConfigClass: HalowebConfig,
    required: [...COMMON_FORM],
    // useHalowebWeb.ts 关闭知识空间
    hookFlags: { knowledgeSpaceEnabled: false },
  },
  {
    platformKey: "custom_Zhihu",
    config: zhihuHelpConfig,
    ConfigClass: ZhihuConfig,
    required: [...COMMON_FORM, "username", "blogid"],
    // useZhihuWeb.ts 打开专栏行
    hookFlags: { knowledgeSpaceEnabled: true },
  },
  {
    platformKey: "custom_Csdn",
    config: csdnHelpConfig,
    ConfigClass: CsdnConfig,
    required: [...COMMON_FORM],
    // useCsdnWeb.ts 关闭知识空间
    hookFlags: { knowledgeSpaceEnabled: false },
  },
  {
    platformKey: "custom_Jianshu",
    config: jianshuHelpConfig,
    ConfigClass: JianshuConfig,
    required: [...COMMON_FORM, "blogid"],
    // useJianshuWeb.ts 打开笔记本行
    hookFlags: { knowledgeSpaceEnabled: true },
  },
  {
    platformKey: "custom_Juejin",
    config: juejinHelpConfig,
    ConfigClass: JuejinConfig,
    required: [...COMMON_FORM, "blogid"],
    // useJuejinWeb.ts 打开分类行
    hookFlags: { knowledgeSpaceEnabled: true },
  },
  {
    platformKey: "custom_Wechat",
    config: wechatHelpConfig,
    ConfigClass: WechatConfig,
    required: [...COMMON_FORM],
    // useWechatWeb.ts 关闭知识空间
    hookFlags: { knowledgeSpaceEnabled: false },
  },
  {
    platformKey: "custom_Bilibili",
    config: bilibiliHelpConfig,
    ConfigClass: BilibiliConfig,
    required: [...COMMON_FORM, "blogid"],
    // useBilibiliWeb.ts 打开文集行（构造函数的 false 会被运行时置回 true）
    hookFlags: { knowledgeSpaceEnabled: true },
  },
]

/** 该平台配置页在宿主里真实存在的锚点集合（与 required 同源：行渲染条件 + 平台 hook 开关） */
export function renderableTourAnchors(entry: VerifiedPlatformRows): Set<string> {
  const merged = mergedPlatformConfig(entry)
  const anchors = new Set<string>(["pageType", "picbedService", "validate"])
  if (merged.homeEnabled !== false) anchors.add("home")
  if (merged.apiUrlEnabled !== false) anchors.add("apiUrl")
  if (merged.usernameEnabled) anchors.add("username")
  if (merged.passwordType === PasswordType.PasswordType_Password) anchors.add("password")
  if (merged.passwordType === PasswordType.PasswordType_Token) anchors.add("token")
  if (merged.passwordType === PasswordType.PasswordType_Cookie) anchors.add("cookie")
  if (merged.previewUrlEnabled !== false) anchors.add("previewUrl")
  if (merged.knowledgeSpaceEnabled) anchors.add("knowledgeSpace")
  if (merged.cateSearchEnabled) anchors.add("knowledgeSpaceSearch")
  if (merged.isCorsProxy) anchors.add("corsProxy")
  if (entry.platformKey.startsWith("fs_")) {
    anchors.add("storePath")
    anchors.add("imageStorePath")
    anchors.add("fsYamlType")
  }
  return anchors
}

/** 合并后的配置实例（含平台 hook 运行时开关），用于核对真实属性与渲染行 */
export function mergedPlatformConfig(entry: VerifiedPlatformRows): Record<string, any> {
  const merged = safeMergeConfig<Record<string, any>>(
    "{}",
    entry.ConfigClass as new (...args: any[]) => Record<string, any>,
    ["", "", "", "", ""]
  )
  Object.assign(merged, entry.hookFlags ?? {})
  return merged
}