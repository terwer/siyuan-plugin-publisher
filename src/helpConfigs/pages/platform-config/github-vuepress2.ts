/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const vuepress2HelpConfig: PageHelpConfig = {
  pageId: "platform-config/github_Vuepress2",
  helpUrl: "https://siyuan.wiki/s/20230908183739-2x156oj",
  summary:
    "通过 GitHub API 将文章发布到 Vuepress2 文档站仓库。V2 已验证配置、发布、更新、删除、带图发布与查看链接。账号使用 GitHub Token（PAT）；文章默认写入 src/post 目录（文件名 [slug].md）；图片选「当前平台」图床时上传到文章所在目录的 images 子目录（例如 src/post/images/<图片名>，即存储规则 [docpath]/images），文章中引用为相对路径 ./images/<图片名>（Vuepress2 官方推荐的资源就近放置方式，构建时随页面一起输出）；查看链接为仓库 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），站点文章地址由 Vuepress2 主题路由决定。",
  fields: {
    home: { tip: "GitHub 首页地址，默认 https://github.com。" },
    apiUrl: { tip: "GitHub API 地址，默认 https://api.github.com，通常无需修改。" },
    username: { tip: "GitHub 用户名（owner），用于拼出仓库地址。token 需对该仓库有 push 权限。" },
    password: {
      tip: "GitHub 个人访问令牌（PAT，Token）。在 GitHub Settings → Developer settings → Personal access tokens 生成，需勾选 repo 权限。",
      link: "https://github.com/settings/tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "Vuepress2 站点仓库名，与用户名组成 <user>/<repo>，例如 vuepress2-blog。" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。" },
    defaultPath: { tip: "Vuepress2 文章存储目录，默认 src/post。发布后的 .md 会写入该目录。" },
    mdFilenameRule: { tip: "文章文件名规则，默认 [slug].md（文章别名），与 Vuepress2 主题路由约定一致。" },
    previewPostUrl: { tip: "站点文章预览规则，默认 /post/[postid].html。Vuepress2 转换器不写入 permalink，实际站点地址由主题路由决定，此规则仅作查看参考。" },
    previewUrl: { tip: "GitHub blob 预览规则，默认 /[user]/[repo]/blob/[branch]/[docpath]，查看链接即该 .md 在仓库中的地址。" },
    pageType: { tip: "Vuepress2 默认按 Markdown 内容发布。" },
    picbedService: {
      tip: "选择「当前平台」图床时，图片上传到文章所在目录的 images 子目录（存储规则 [docpath]/images，如 src/post/images/<图片名>），文章中引用为相对路径 ./images/<图片名>，构建时随页面一起输出。",
    },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认 Token 有对目标仓库的 push 权限，仓库名与分支填写正确。Token 权限不足会在发布时收到 401/403。",
    },
    {
      q: "图片要怎么发布？",
      a: "选择「当前平台」图床。Vuepress2 使用资源就近约定：图片上传到文章所在目录的 images 子目录（例如 src/post/images/<图片名>），文章内引用相对路径 ./images/<图片名>。Vuepress2 构建时会将页面目录内的图片一起输出，因此无需手动配置 public 目录。",
    },
    {
      q: "查看链接打不开？",
      a: "查看链接为仓库中该 .md 的 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），仓库中存在该文件即可打开。站点线上地址由 Vuepress2 主题路由决定（本项目 converter 不写 permalink），需站点已部署。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会重新提交该文章并产生一次新提交；「删除」会从仓库移除对应 .md 文件，站点需重新构建后才同步下线。",
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
      content: "Vuepress2 文章默认存储目录 src/post，文件名规则默认 [slug].md。",
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
      content: "Vuepress2 默认按 Markdown 内容发布。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "选择「当前平台」图床，图片上传到文章所在目录的 images 子目录（如 src/post/images/<图片名>），文章引用相对路径 ./images/<图片名>。",
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
