/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { platformDocUrl } from "~/src/utils/site"

export const hugoHelpConfig: PageHelpConfig = {
  pageId: "platform-config/github_Hugo",
  helpUrl: platformDocUrl("github-hugo"),
  summary:
    "通过 GitHub API 将文章发布到 Hugo 静态博客仓库。账号使用 GitHub Token（PAT）；默认按单文件发布（.md + static/images），也可在「内容组织方式」选择页面目录（Leaf Bundle），把 index.md 与图片放进同一目录。查看链接为站点文章地址（/post/<slug>.html 或目录式 /post/<slug>/）。",
  fields: {
    home: { tip: "GitHub 首页地址，默认 https://github.com。", placeholder: "https://github.com" },
    apiUrl: { tip: "GitHub API 地址，默认 https://api.github.com，通常无需修改。", placeholder: "https://api.github.com" },
    username: { tip: "GitHub 用户名（owner），用于拼出仓库地址。token 需对该仓库有 push 权限。", placeholder: "your-github-name" },
    password: {
      tip: "GitHub 个人访问令牌（PAT，Token）。在 GitHub Settings → Developer settings → Personal access tokens 生成，需勾选 repo 权限。",
      placeholder: "ghp_xxxxxxxxxxxxxxxxxxxx",
      link: "https://github.com/settings/tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "Hugo 博客仓库名，与用户名组成 <user>/<repo>，例如 hugo-blog。", placeholder: "hugo-blog" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。", placeholder: "main" },
    defaultPath: { tip: "Hugo 文章存储目录，默认 content/post。发布后的 .md 会写入该目录。", placeholder: "content/post" },
    contentLayout: {
      tip: "内容组织方式：单文件写入「存储目录/<文件名>.md」，图片按下面的图片存储目录上传；页面目录（Leaf Bundle）写入「存储目录/<目录名>/index.md」，图片自动放入同一目录并在正文中相对引用。默认单文件；切换只影响之后发布或更新的文章，不会自动搬迁历史文章。",
    },
    mdFilenameRule: { tip: "文章文件名规则，默认 [slug].md。页面目录模式下，去掉 .md 后的名称会作为文章目录名（如 my-post/index.md）。", placeholder: "[slug].md" },
    previewPostUrl: { tip: "站点文章预览规则，默认 /post/[postid].html。页面目录模式的文章地址通常是目录形式（如 /post/[postid]/ 或 /posts/[postid]/），请按站点实际地址配置；开启「YAML永久链接」时 front matter 的 url 也会使用目录形式。", placeholder: "/post/[postid].html" },
    previewUrl: { tip: "GitHub blob 预览规则，默认 /[user]/[repo]/blob/[branch]/[docpath]。", placeholder: "/[user]/[repo]/blob/[branch]/[docpath]" },
    pageType: { tip: "Hugo 默认按 Markdown 内容发布。" },
    picbedService: { tip: "Hugo 图片会提交到博客仓库。页面目录模式下请保持「当前平台」图床，图片会写入文章目录；单文件模式下默认上传到 static/images，正文引用 /images/<图片名>。" },
    yamlLinkEnabled: {
      tip: "开启后在 Front Matter 写入 url 字段以锁定文章地址。单文件模式固定为 /post/<文章别名>.html；页面目录模式按存储目录推导为目录形式（如 /posts/<文章别名>/）。关闭则不写 url，地址由文件路径与主题 permalink 决定。",
    },
    blogid: {
      tip: "发布目录：验证通过后下拉列出仓库中的可选目录，文章 .md 提交到所选目录（默认 content/post）；改动「存储目录」会同步覆盖这里。要改选目录请回本页调整，快速发布页里该目录为只读。",
    },
    imageStorePath: {
      tip: "单文件模式下，选「当前平台」图床时图片提交到仓库的位置，默认 static/images。页面目录模式不使用该设置，图片固定写入 index.md 同目录。",
      placeholder: "static/images",
    },
    imageLinkPath: {
      tip: "单文件模式下文章内图片引用前缀，默认 images，即引用为 /images/<图片名> 的站点根绝对路径；填 ./images 或 ../images 则改为相对文章路径引用。页面目录模式不使用该设置，正文直接使用同目录的相对文件名。",
      placeholder: "/images",
    },
    dynYamlCfg: {
      tip: "YAML 预设配置（JSON 片段），发布时最后合并进文章 Front Matter，用于补充主题需要的自定义字段；同名键会覆盖前面自动生成的字段。",
      placeholder: "{\"toc\": true}",
    },
    defaultMsg: { tip: "提交到仓库的 commit message，文章与图片的每次提交都会带上它。", placeholder: "auto published by siyuan-plugin-publisher" },
    author: { tip: "commit 作者名，会写入仓库的提交记录，建议填自己的 GitHub 用户名或显示名。", placeholder: "your-name" },
    email: { tip: "commit 作者邮箱，会写入仓库的提交记录。", placeholder: "you@example.com" },
    site: {
      tip: "作者主页地址，默认由「平台首页 + 用户名」拼出；Hugo 的文章 Front Matter 不写作者字段，此处仅作账号信息。",
      placeholder: "https://github.com/your-github-name",
    },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认 Token 有对目标仓库的 push 权限，仓库名与分支填写正确，存储目录已存在。Token 权限不足会在发布时收到 401/403。",
    },
    {
      q: "图片要怎么发布？",
      a: "单文件模式：选择「当前平台」图床，图片上传到仓库 static/images（默认），正文引用 /images/<图片名>；Hugo 构建时把 static/ 原样复制到站点根。页面目录（Leaf Bundle）模式：图片自动写入 index.md 同目录，正文使用相对文件名，由 Hugo 作为 page resource 发布。",
    },
    {
      q: "怎么启用 Leaf Bundle？",
      a: "在「内容组织方式」选择「页面目录（Leaf Bundle）」后保存即可。文章会写到「存储目录/<目录名>/index.md」，同目录放图片；建议同时把「文章预览规则」改为站点实际使用的目录式地址（如 /post/[postid]/）。已有文章不会自动搬迁。",
    },
    {
      q: "查看链接打不开？",
      a: "查看链接为站点文章地址（默认 /post/<postid>.html）。页面目录模式应使用目录形式（如 /post/[postid]/ 或 /posts/[postid]/）。开启「YAML 永久链接」会在 front matter 写入 url 字段锁定地址；单文件模式取 /post/<文章别名>.html，页面目录模式取按存储目录推导的目录地址。若关闭，则地址由主题的 permalink 配置与文章在 content 下的路径决定。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会重新提交该文章并产生一次新提交；「删除」会从仓库移除对应 .md。页面目录模式下会同时清理该文章目录内的图片；单文件模式仍只删除 .md（static/images 下的图片保留）。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "首页地址",
      content: "确认首页地址保持默认即可，企业版或私有部署才需要改。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "API 地址与首页配套填写，公有云保持默认。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "用户名",
      content: "填写仓库所有者用户名，与仓库名共同定位目标仓库。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='token']",
      title: "Token",
      content: "GitHub 个人访问令牌（PAT），需对目标仓库有 push 权限。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "文章目录",
      content: "Hugo 文章默认存储目录 content/post，发布后的 .md 会写入该目录。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='previewUrl']",
      title: "查看链接",
      content: "预览规则默认 /[user]/[repo]/blob/[branch]/[docpath]，查看链接为仓库中该 .md 的 blob 地址。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "发布格式",
      content: "发布格式保持默认，无需调整。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "选择「当前平台」图床，图片上传到仓库 static/images，文章引用为绝对路径 /images/<图片名>（Hugo 构建时 static/ 原样复制到站点根）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证 Token、仓库与分支后保存，再回到快速发布发布文章。",
      placement: "top",
    },
  ],
}
