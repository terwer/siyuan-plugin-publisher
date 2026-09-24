# 平台支持

发布工具支持的平台已超过 30 个，按接入方式分为几类。每个平台都有一份独立的配置指南，说明需要填哪些字段、如何完成授权，以及常见问题怎么处理。

::: tip 不确定该看哪一篇？
对照下表选一个最接近的类型：静态博客（GitHub / GitLab 系）、博客协议（WordPress / MetaWeblog）、网页授权（Cookie 登录）或平台 API。
:::

## 通用平台

| 平台 | 接入方式 | 说明 |
|---|---|---|
| [语雀（API）](/platforms/common-yuque) | API Token | 需要语雀专业会员；支持知识空间与文档树 |
| [Notion（API）](/platforms/common-notion) | API Token | 发布为 Notion 页面，支持分类与标签 |
| [Halo（API）](/platforms/common-halo) | API | 适用于继续维护 Halo 2.9 站点 |
| [Confluence](/platforms/confluence) | API | 发布为 Confluence 页面 |

## GitHub 系静态博客

文档提交到仓库，静态站点构建后生效。需要仓库写权限的 Token。

| 平台 | 说明 |
|---|---|
| [Hexo](/platforms/common-github-hexo) | 支持源码与构建产物两种模式 |
| [Hugo](/platforms/github-hugo) | 标准 Hugo 目录结构 |
| [Jekyll](/platforms/github-jekyll) | 支持 front-matter 与永久链接 |
| [VuePress](/platforms/github-vuepress) | VuePress 1.x 目录结构 |
| [VuePress 2](/platforms/github-vuepress2) | VuePress 2.x，支持 YAML 永久链接 |
| [VitePress](/platforms/github-vitepress) | VitePress 站点，支持 YAML 永久链接 |
| [Quartz](/platforms/github-quartz) | Quartz 数字花园 |

## GitLab 系静态博客

与 GitHub 系配置方式一致，指向自建或官方 GitLab 实例。

| 平台 | 说明 |
|---|---|
| [GitLab Hexo](/platforms/gitlab-gitlabhexo) | Hexo 目录结构 |
| [GitLab Hugo](/platforms/gitlab-gitlabhugo) | Hugo 目录结构 |
| [GitLab Jekyll](/platforms/gitlab-gitlabjekyll) | Jekyll 目录结构 |
| [GitLab VuePress](/platforms/gitlab-gitlabvuepress) | VuePress 1.x |
| [GitLab VuePress 2](/platforms/gitlab-gitlabvuepress2) | VuePress 2.x |
| [GitLab VitePress](/platforms/gitlab-gitlabvitepress) | VitePress |
| [GitLab Astro](/platforms/gitlab-gitlabastro) | Astro 内容集合 |

## 网页授权平台

用浏览器登录态（Cookie）发布，无需申请 API。配置页提供「去登录 → 自动读取 Cookie」流程。

| 平台 | 说明 |
|---|---|
| [微信公众号](/platforms/custom-wechat) | 发布到公众号草稿箱 |
| [掘金](/platforms/custom-juejin) | 默认分类「后端」、默认标签「程序员」 |
| [知乎](/platforms/custom-zhihu) | 需要选择专栏 |
| [简书](/platforms/custom-jianshu) | 需要选择文集 |
| [CSDN](/platforms/custom-csdn) | 支持专栏与标签 |
| [哔哩哔哩](/platforms/custom-bilibili) | 发布为专栏，需选择文集 |
| [语雀网页版](/platforms/custom-yuqueweb) | Cookie 授权，不依赖会员 |
| [Halo 网页版](/platforms/custom-haloweb) | 指向自建 Halo 站点 |

## 博客协议平台

| 平台 | 说明 |
|---|---|
| [WordPress](/platforms/wordpress-wordpress) | 自建 WordPress，XML-RPC |
| [WordPress.com](/platforms/wordpress-wordpressdotcom) | 官方托管站点 |
| [博客园](/platforms/metaweblog-cnblogs) | MetaWeblog 协议 |
| [Typecho](/platforms/metaweblog-typecho) | MetaWeblog 协议 |
| [Jvue](/platforms/metaweblog-jvue) | MetaWeblog 协议 |
| [MetaWeblog 通用](/platforms/metaweblog-metaweblog) | 任何兼容 MetaWeblog 的站点 |

## 其他

| 平台 | 说明 |
|---|---|
| [本地系统](/platforms/fs-local-system) | 导出到本地目录，仅桌面端 |
| [Telegraph](/platforms/telegraph) | Telegraph 匿名发布 |
| [GitHub Astro](/platforms/github-astro) | Astro 内容集合（GitHub） |

## 平台能力对照

| 能力 | 说明 |
|---|---|
| 发布 / 更新 / 删除 | 所有平台均支持；删除仅清理插件侧的发布记录与平台文章 |
| 带图发布 | 取决于图床设置；平台原生直传或自备图床 |
| 分类 / 标签 | 需平台支持；未显式设置时部分平台会回退默认值 |
| 专栏 / 文集 / 知识空间 | 网页授权与语雀类平台需要选择 |
| 预览链接 | 由「预览规则」模板生成，用于「查看文章」 |