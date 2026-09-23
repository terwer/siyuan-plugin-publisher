import { defineConfig } from "vitepress"
import { REPO_URL, SITE_BASE, SITE_HOME } from "./site.mts"

/**
 * 平台指南分组 —— 与 `docs/platforms/*.md` 的文件名一一对应。
 * 新增平台文档时在这里补一行，即可同时出现在侧栏与平台总览。
 */
const platformGroups = [
  {
    text: "通用平台",
    items: [
      { text: "语雀（API）", link: "/platforms/common-yuque" },
      { text: "Notion（API）", link: "/platforms/common-notion" },
      { text: "Halo（API）", link: "/platforms/common-halo" },
      { text: "Confluence", link: "/platforms/confluence" },
    ],
  },
  {
    text: "GitHub 系静态博客",
    items: [
      { text: "Hexo", link: "/platforms/common-github-hexo" },
      { text: "Hugo", link: "/platforms/github-hugo" },
      { text: "Jekyll", link: "/platforms/github-jekyll" },
      { text: "VuePress", link: "/platforms/github-vuepress" },
      { text: "VuePress 2", link: "/platforms/github-vuepress2" },
      { text: "VitePress", link: "/platforms/github-vitepress" },
      { text: "Quartz", link: "/platforms/github-quartz" },
      { text: "Astro", link: "/platforms/github-astro" },
    ],
  },
  {
    text: "GitLab 系静态博客",
    items: [
      { text: "GitLab Hexo", link: "/platforms/gitlab-gitlabhexo" },
      { text: "GitLab Hugo", link: "/platforms/gitlab-gitlabhugo" },
      { text: "GitLab Jekyll", link: "/platforms/gitlab-gitlabjekyll" },
      { text: "GitLab VuePress", link: "/platforms/gitlab-gitlabvuepress" },
      { text: "GitLab VuePress 2", link: "/platforms/gitlab-gitlabvuepress2" },
      { text: "GitLab VitePress", link: "/platforms/gitlab-gitlabvitepress" },
      { text: "GitLab Astro", link: "/platforms/gitlab-gitlabastro" },
    ],
  },
  {
    text: "网页授权平台",
    items: [
      { text: "微信公众号", link: "/platforms/custom-wechat" },
      { text: "掘金", link: "/platforms/custom-juejin" },
      { text: "知乎", link: "/platforms/custom-zhihu" },
      { text: "简书", link: "/platforms/custom-jianshu" },
      { text: "CSDN", link: "/platforms/custom-csdn" },
      { text: "哔哩哔哩", link: "/platforms/custom-bilibili" },
      { text: "语雀网页版", link: "/platforms/custom-yuqueweb" },
      { text: "Halo 网页版", link: "/platforms/custom-haloweb" },
    ],
  },
  {
    text: "博客协议平台",
    items: [
      { text: "WordPress", link: "/platforms/wordpress-wordpress" },
      { text: "WordPress.com", link: "/platforms/wordpress-wordpressdotcom" },
      { text: "博客园", link: "/platforms/metaweblog-cnblogs" },
      { text: "Typecho", link: "/platforms/metaweblog-typecho" },
      { text: "Jvue", link: "/platforms/metaweblog-jvue" },
      { text: "MetaWeblog 通用", link: "/platforms/metaweblog-metaweblog" },
    ],
  },
  {
    text: "其他",
    items: [
      { text: "本地系统", link: "/platforms/fs-local-system" },
      { text: "Telegraph", link: "/platforms/telegraph" },
    ],
  },
]

export default defineConfig({
  lang: "zh-CN",
  title: "发布工具",
  description: "思源笔记多平台发布插件 —— 一次编写，发布到 30+ 平台",

  // 站点部署地址集中在此，换域名只改 docs/.vitepress/site.mts
  base: SITE_BASE,
  sitemap: { hostname: SITE_HOME },

  // 历史归档不进站点：它们是历史记录，引用的旧路径已不存在
  srcExclude: ["archive/**", "**/README.md"],

  head: [
    ["link", { rel: "icon", href: `${SITE_BASE}images/publisher-icon.png` }],
    ["meta", { name: "theme-color", content: "#3e63dd" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "发布工具" }],
  ],

  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
  },

  themeConfig: {
    logo: "/images/publisher-icon.png",
    siteTitle: "发布工具",

    nav: [
      { text: "使用指南", link: "/guide/usage", activeMatch: "/guide/" },
      { text: "平台支持", link: "/platforms/", activeMatch: "/platforms/" },
      { text: "开发", link: "/dev/", activeMatch: "/dev/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "开始使用",
          items: [{ text: "使用指南", link: "/guide/usage" }],
        },
        {
          text: "发布方式",
          items: [
            { text: "快速发布", link: "/guide/quick-publish" },
            { text: "详细发布", link: "/guide/single-publish" },
            { text: "批量分发", link: "/guide/batch-publish" },
          ],
        },
        {
          text: "配合使用",
          items: [
            { text: "文章管理", link: "/guide/article-manage" },
            { text: "发布设置", link: "/guide/settings" },
            { text: "图床设置", link: "/guide/picbed" },
            { text: "分类体系", link: "/guide/categories" },
          ],
        },
        {
          text: "进阶",
          items: [
            { text: "AI 辅助", link: "/guide/ai" },
            { text: "CORS 代理配置", link: "/guide/cors-proxy" },
            { text: "常见问题", link: "/guide/faq" },
          ],
        },
      ],
      "/platforms/": [
        { text: "平台支持", link: "/platforms/" },
        ...platformGroups.map((g) => ({ text: g.text, collapsed: true, items: g.items })),
      ],
      "/dev/": [
        {
          text: "插件开发",
          items: [{ text: "开发指南", link: "/dev/" }, { text: "插件开发手册", link: "/dev/plugin-development" }],
        },
      ],
    },

    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除条件",
            footer: { selectText: "选择", navigateText: "切换", closeText: "关闭" },
          },
        },
      },
    },

    outline: { level: [2, 3], label: "本页目录" },
    docFooter: { prev: "上一篇", next: "下一篇" },
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色",
    darkModeSwitchTitle: "切换到深色",
    sidebarMenuLabel: "目录",
    returnToTopLabel: "回到顶部",
    lastUpdated: { text: "最后更新于" },

    socialLinks: [{ icon: "github", link: REPO_URL }],

    footer: {
      message: "以 GPL-3.0 许可发布",
      copyright: "Copyright © 2026 Terwer, Inc.",
    },

    editLink: {
      pattern: `${REPO_URL}/edit/main/docs/:path`,
      text: "在 GitHub 上编辑此页",
    },
  },
})