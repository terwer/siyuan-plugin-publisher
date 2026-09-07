/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const quartzHelpConfig: PageHelpConfig = {
  pageId: "platform-config/github_Quartz",
  helpUrl: "https://siyuan.wiki/s/20230908182140-8riar0r",
  summary:
    "通过 GitHub API 将文章发布到 Quartz 静态博客仓库。V2 已验证配置、发布、更新、删除、带图发布与查看链接。账号使用 GitHub Token（PAT）；文章写入仓库 content 目录（文件名 [filename].md），图片选「当前平台」图床上传到仓库 assets/images，文章内引用为绝对路径 /assets/images/<图片名>；查看链接为仓库 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]）或站点文章地址（/post/<postid>.html）。",
  fields: {
    home: { tip: "GitHub 首页地址，默认 https://github.com。" },
    apiUrl: { tip: "GitHub API 地址，默认 https://api.github.com，通常无需修改。" },
    username: { tip: "GitHub 用户名（owner），用于拼出仓库地址。token 需对该仓库有 push 权限。" },
    password: {
      tip: "GitHub 个人访问令牌（PAT，Token）。在 GitHub Settings → Developer settings → Personal access tokens 生成，需勾选 repo 权限。",
      link: "https://github.com/settings/tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "Quartz 博客仓库名，与用户名组成 <user>/<repo>，例如 terwer/quartz-blog。" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。" },
    defaultPath: { tip: "Quartz 文章存储目录，默认 content。发布后的 .md 会写入该目录。" },
    mdFilenameRule: { tip: "文章文件名规则，默认 [filename].md。" },
    previewPostUrl: { tip: "站点文章预览规则，默认 /post/[postid].html。开启「YAML 永久链接」时会在 front matter 写入 permalink 以强制文章地址为该规则。" },
    previewUrl: { tip: "GitHub blob 预览规则，默认 /[user]/[repo]/blob/[branch]/[docpath]。" },
    pageType: { tip: "Quartz 默认按 Markdown 内容发布。" },
    picbedService: { tip: "Quartz 图片会提交到博客仓库。选择「当前平台」图床，图片上传到仓库 assets/images，文章中引用为绝对路径 /assets/images/<图片名>。" },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认 Token 有对目标仓库的 push 权限，仓库名与分支填写正确，存储目录已存在。Token 权限不足会在发布时收到 401/403。",
    },
    {
      q: "图片要怎么发布？",
      a: "选择「当前平台」图床，图片会上传到仓库的 assets/images 目录（默认），文章中引用为绝对路径 /assets/images/<图片名> 地址。具体能否在构建产物显示取决于 Quartz 站点对 /assets 静态资源的处理方式。",
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
      content: "Quartz 文章默认存储目录 content，发布后的 .md 会写入该目录。",
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
      content: "Quartz 默认按 Markdown 内容发布。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "选择「当前平台」图床，图片上传到仓库 assets/images，文章引用为绝对路径 /assets/images/<图片名>。",
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
