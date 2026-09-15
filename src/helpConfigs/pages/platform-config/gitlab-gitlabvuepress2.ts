/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const gitlabvuepress2HelpConfig: PageHelpConfig = {
  pageId: "platform-config/gitlab_Gitlabvuepress2",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过 GitLab API 将文章发布到 GitLab 上的 VuePress 2 文档站仓库。账号使用 GitLab 访问令牌（Personal Access Token）；仓库地址由「平台首页 + 用户名 + 仓库名」拼出，平台首页与 API 地址均为你的 GitLab 实例地址；文章默认写入 src/post（文件名 [slug].md）；图片选「当前平台」图床时上传到文章所在目录的 images 子目录（存储规则 [docpath]/images，例如 src/post/images/<图片名>），文章中引用为相对路径 ./images/<图片名>；查看链接为仓库 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），该规则固定不可修改。",
  fields: {
    home: {
      tip: "你的 GitLab 实例首页地址（自建实例填自己的域名，如 https://gitlab.example.com），用于拼出仓库地址；修改后 API 地址与令牌地址会同步更新。",
    },
    apiUrl: { tip: "GitLab API 地址，默认与平台首页一致（自建实例同样填实例地址）；平台首页留空时会被清空。" },
    username: { tip: "GitLab 用户名（owner），用于拼出仓库地址。访问令牌需对该仓库有 push 权限。" },
    password: {
      tip: "GitLab 个人访问令牌（Personal Access Token）。在 GitLab 右上角头像 → Preferences → Access Tokens（或 /-/user_settings/personal_access_tokens）生成，需勾选 api 或 write_repository 范围。",
      link: "https://gitlab.com/-/user_settings/personal_access_tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "VuePress 2 文档站仓库名，与用户名组成 <user>/<repo>，例如 vuepress2-blog。" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。" },
    defaultPath: { tip: "VuePress 2 文章存储目录，默认 src/post。发布后的 .md 会写入该目录。" },
    mdFilenameRule: { tip: "文章文件名规则，默认 [slug].md（文章别名）。" },
    previewPostUrl: {
      tip: "站点文章预览规则，默认 /post/[postid].html。VuePress 2 站点地址由主题路由与文件路径决定，此规则仅作查看参考。",
    },
    previewUrl: {
      tip: "GitLab blob 预览规则，固定 /[user]/[repo]/blob/[branch]/[docpath]，查看链接即该 .md 在仓库中的地址；该平台固定使用此规则，不支持修改。",
    },
    pageType: { tip: "VuePress 2 默认按 Markdown 内容发布。" },
    picbedService: {
      tip: "默认选「当前平台」图床：图片上传到文章所在目录的 images 子目录（存储规则 [docpath]/images，如 src/post/images/<图片名>），文章中引用为相对路径 ./images/<图片名>。",
    },
    blogid: {
      tip: "发布目录：验证通过后下拉列出仓库中的可选目录，文章 .md 提交到所选目录（默认 src/post）；该平台不支持修改发布目录，如需更换请删除账号后重新发布。它同时是图片目录 [docpath]/images 的解析基准。",
    },
    imageStorePath: {
      tip: "选「当前平台」图床时图片提交到仓库的位置，默认 [docpath]/images，即文章所在目录下的 images 子目录。",
    },
    imageLinkPath: {
      tip: "文章内图片引用前缀，默认 ./images（相对文章所在目录）。",
    },
    dynYamlCfg: {
      tip: "YAML 预设配置（JSON 片段），发布时逐键合并进文章 Front Matter。留空时 VuePress 2 默认写入 article: true、timeline: false、isOriginal: true。",
    },
    defaultMsg: { tip: "提交到仓库的 commit message，文章与图片的每次提交都会带上它。" },
    author: { tip: "commit 作者名，会写入仓库的提交记录，建议填自己的 GitLab 用户名或显示名。" },
    email: { tip: "commit 作者邮箱，会写入仓库的提交记录。" },
    site: {
      tip: "作者主页地址，默认由「平台首页 + 用户名」拼出；VuePress 2 的文章 Front Matter 不含作者字段，此处仅作账号信息。",
    },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认访问令牌有对目标仓库的 push 权限（api 或 write_repository 范围），仓库名与分支填写正确。权限不足会收到 401/403。",
    },
    {
      q: "自建 GitLab 该怎么填平台首页？",
      a: "平台首页填你的实例地址（如 https://gitlab.example.com），API 地址会同步为该地址。令牌地址由实例地址拼出（/-/user_settings/personal_access_tokens），需在你自己实例的偏好设置里生成令牌。",
    },
    {
      q: "图片要怎么发布？",
      a: "默认使用「当前平台」图床，图片上传到文章所在目录的 images 子目录（如 src/post/images/<图片名>），文章中引用相对路径 ./images/<图片名>，构建时随页面一起输出。",
    },
    {
      q: "查看链接打不开？",
      a: "查看链接为仓库中该 .md 的 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），仓库中存在该文件即可打开，需已登录 GitLab 且对该仓库有访问权限。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会重新提交该文章并产生一次新提交；「删除」会从仓库移除对应 .md 文件，站点需重新构建后才同步下线。",
    },
  ],
  tour: [
    { target: "[data-syp-tour='home']", title: "平台首页", content: "填写你的 GitLab 实例首页地址，用于拼出仓库地址。", placement: "bottom" },
    { target: "[data-syp-tour='apiUrl']", title: "API 地址", content: "API 地址与平台首页一致，填写平台首页后会自动同步。", placement: "bottom" },
    { target: "[data-syp-tour='username']", title: "用户名", content: "GitLab 用户名（owner），用于拼出仓库地址。", placement: "bottom" },
    { target: "[data-syp-tour='token']", title: "Token", content: "GitLab 个人访问令牌，需对目标仓库有 push 权限。", placement: "bottom" },
    { target: "[data-syp-tour='knowledgeSpace']", title: "文章目录", content: "文章默认存储目录 src/post，文件名规则默认 [slug].md，该目录不支持修改。", placement: "bottom" },
    { target: "[data-syp-tour='previewUrl']", title: "查看链接", content: "预览规则固定为 /[user]/[repo]/blob/[branch]/[docpath]，查看链接为仓库中该 .md 的 blob 地址。", placement: "bottom" },
    { target: "[data-syp-tour='pageType']", title: "发布格式", content: "VuePress 2 默认按 Markdown 内容发布。", placement: "bottom" },
    { target: "[data-syp-tour='picbedService']", title: "图片发布", content: "图床默认选「当前平台」，图片上传到文章所在目录的 images 子目录（如 src/post/images/<图片名>），文章引用相对路径 ./images/<图片名>。", placement: "bottom" },
    { target: "[data-syp-tour='validate']", title: "验证并保存", content: "验证令牌、仓库与分支后保存，再回到快速发布发布文章。", placement: "top" },
  ],
}