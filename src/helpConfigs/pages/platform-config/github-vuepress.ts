/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const vuepressHelpConfig: PageHelpConfig = {
  pageId: "platform-config/github_Vuepress",
  helpUrl: "https://siyuan.wiki/s/20230908183534-29f49bz",
  summary:
    "通过 GitHub API 将文章发布到 Vuepress1 静态博客仓库。账号使用 GitHub Token（PAT）；文章写入仓库 docs 目录（文件名 [filename].md），图片选「当前平台」图床上传到仓库 docs/.vuepress/public/images，文章内引用为绝对路径 /images/<图片名>（Vuepress 构建时把 .vuepress/public 目录映射到站点根，因此 /images/... 在构建产物中正确显示）；查看链接为仓库 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]）或站点文章地址（/post/<postid>.html）。",
  fields: {
    home: { tip: "GitHub 首页地址，默认 https://github.com。" },
    apiUrl: { tip: "GitHub API 地址，默认 https://api.github.com，通常无需修改。" },
    username: { tip: "GitHub 用户名（owner），用于拼出仓库地址。token 需对该仓库有 push 权限。" },
    password: {
      tip: "GitHub 个人访问令牌（PAT，Token）。在 GitHub Settings → Developer settings → Personal access tokens 生成，需勾选 repo 权限。",
      link: "https://github.com/settings/tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "Vuepress 博客仓库名，与用户名组成 <user>/<repo>，例如 terwer.github.io。" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。" },
    defaultPath: { tip: "Vuepress 文章存储目录，默认 docs。发布后的 .md 会写入该目录。" },
    mdFilenameRule: { tip: "文章文件名规则，默认 [filename].md。" },
    previewPostUrl: { tip: "站点文章预览规则，默认 /post/[postid].html，发布后「查看文章」链接按此合成。注意：「YAML永久链接」写入的 permalink 是固定的 /post/<文章别名>.html，不读这条规则。" },
    previewUrl: { tip: "GitHub blob 预览规则，默认 /[user]/[repo]/blob/[branch]/[docpath]。" },
    pageType: { tip: "Vuepress 默认按 Markdown 内容发布。" },
    picbedService: { tip: "Vuepress 图片会提交到博客仓库。选择「当前平台」图床，图片上传到仓库 docs/.vuepress/public/images，文章中引用为绝对路径 /images/<图片名>（构建时 .vuepress/public 映射到站点根）。" },
    yamlLinkEnabled: {
      tip: "开启后在 Front Matter 写入 permalink，取值固定为 /post/<文章别名>.html（不读「文章预览规则」），且文章需有别名才会写入。关闭则不写 permalink，文章地址由站点的路由与主题配置决定。",
    },
    blogid: {
      tip: "发布目录：验证通过后下拉列出仓库中的可选目录，文章 .md 提交到所选目录（默认 docs）；改动「存储目录」会同步覆盖这里。要改选目录请回本页调整，快速发布页里该目录为只读。",
    },
    imageStorePath: {
      tip: "选「当前平台」图床时图片提交到仓库的位置，默认 docs/.vuepress/public/images。",
    },
    imageLinkPath: {
      tip: "文章内图片引用前缀，默认 images，即引用为 /images/<图片名> 的站点根绝对路径（构建时 .vuepress/public 映射到站点根）；填 ./images 之类则改为相对文章路径引用。",
    },
    dynYamlCfg: {
      tip: "YAML 预设配置（JSON 片段），发布时最后合并进文章 Front Matter，留空则不额外补充字段；同名键会覆盖前面自动生成的字段（包括 author）。",
    },
    defaultMsg: { tip: "提交到仓库的 commit message，文章与图片的每次提交都会带上它。" },
    author: { tip: "文章 Front Matter 里的作者名（author.name），留空时使用默认值；同时作为 commit 作者名写入仓库提交记录。" },
    email: { tip: "commit 作者邮箱，会写入仓库的提交记录。" },
    site: {
      tip: "作者主页地址，写入文章 Front Matter 的 author.link；留空时由「平台首页 + 用户名」自动拼出。",
    },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认 Token 有对目标仓库的 push 权限，仓库名与分支填写正确，存储目录已存在。Token 权限不足会在发布时收到 401/403。",
    },
    {
      q: "图片要怎么发布？",
      a: "选择「当前平台」图床，图片会上传到仓库的 docs/.vuepress/public/images 目录（默认），文章中引用为绝对路径 /images/<图片名> 地址。Vuepress 构建时把 .vuepress/public 目录映射到站点根，因此构建产物中 /images/... 能正确显示。",
    },
    {
      q: "查看链接打不开？",
      a: "查看链接默认使用仓库 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），仓库中存在该 .md 即可打开；若配置了站点文章预览规则（默认 /post/[postid].html），则站点需已部署且地址与预览规则一致。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会重新提交该文章并产生一次新提交；「删除」会从仓库移除对应 .md 文件，需要重新构建才能再次出现在站点。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "首页地址",
      content: "GitHub 首页地址，默认 https://github.com。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "GitHub API 地址，默认 https://api.github.com，通常无需修改。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "用户名",
      content: "GitHub 用户名（owner），用于拼出仓库地址。",
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
      content: "Vuepress 文章默认存储目录 docs，发布后的 .md 会写入该目录，文件名默认 [filename].md。",
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
      content: "Vuepress 默认按 Markdown 内容发布。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "选择「当前平台」图床，图片上传到仓库 docs/.vuepress/public/images，文章引用为绝对路径 /images/<图片名>（构建时 .vuepress/public 映射到站点根）。",
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
