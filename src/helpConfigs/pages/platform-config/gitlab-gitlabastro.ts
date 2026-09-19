/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const gitlabastroHelpConfig: PageHelpConfig = {
  pageId: "platform-config/gitlab_Gitlabastro",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过 GitLab API 将文章发布到 GitLab 上的 Astro 站点仓库。账号使用 GitLab 访问令牌（Personal Access Token）；仓库地址由「平台首页 + 用户名 + 仓库名」拼出，平台首页与 API 地址均为你的 GitLab 实例地址；文章默认写入 src/content/blog（文件名 [slug].md）；图片选「当前平台」图床时上传到仓库根目录的 public/images，文章中引用为绝对路径 /images/<图片名>；查看链接为仓库 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），该规则固定不可修改。",
  fields: {
    home: {
      tip: "你的 GitLab 实例首页地址（自建实例填自己的域名，如 https://gitlab.example.com），用于拼出仓库地址；修改后 API 地址与令牌地址会同步更新。",
      placeholder: "https://gitlab.example.com",
    },
    apiUrl: { tip: "GitLab API 地址，默认与平台首页一致（自建实例同样填实例地址）；平台首页留空时会被清空。", placeholder: "https://gitlab.example.com" },
    username: { tip: "GitLab 用户名（owner），用于拼出仓库地址。访问令牌需对该仓库有 push 权限。", placeholder: "your-gitlab-name" },
    password: {
      tip: "GitLab 个人访问令牌（Personal Access Token）。在你的 GitLab 实例右上角头像 → Preferences → Access Tokens 生成（路径 /-/user_settings/personal_access_tokens，域名换成你自己的实例地址），需勾选 api 或 write_repository 范围。",
      placeholder: "glpat-xxxxxxxxxxxxxxxxxxxx",
      link: "https://gitlab.example.com/-/user_settings/personal_access_tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "Astro 站点仓库名，与用户名组成 <user>/<repo>，例如 astro-blog。", placeholder: "gitlab-astro-blog" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。", placeholder: "main" },
    defaultPath: { tip: "Astro 文章存储目录，默认 src/content/blog。发布后的 .md 会写入该内容集合目录。", placeholder: "src/content/blog" },
    mdFilenameRule: { tip: "文章文件名规则，默认 [slug].md（文章别名），与 Astro 内容集合的文件路径约定一致。", placeholder: "[slug].md" },
    previewPostUrl: {
      tip: "站点文章预览规则，默认 /post/[postid].html。Astro 内容集合按文件路径生成路由，Front Matter 无 permalink 字段可读，实际站点地址由文件路径决定，此规则仅作查看参考。",
      placeholder: "/post/[postid].html",
    },
    previewUrl: {
      tip: "GitLab blob 预览规则，固定 /[user]/[repo]/blob/[branch]/[docpath]，查看链接即该 .md 在仓库中的地址；该平台固定使用此规则，不支持修改。",
      placeholder: "/[user]/[repo]/blob/[branch]/[docpath]",
    },
    pageType: { tip: "Astro 默认按 Markdown 内容发布。" },
    picbedService: {
      tip: "Astro 默认选「当前平台」图床：图片上传到仓库根目录的 public/images，文章中引用为绝对路径 /images/<图片名>。",
    },
    blogid: {
      tip: "发布目录：验证通过后下拉列出仓库中的可选目录，文章 .md 提交到所选目录（默认 src/content/blog）；该平台不支持修改发布目录，如需更换请在仓库中调整内容集合位置后重新发布。",
    },
    imageStorePath: {
      tip: "选「当前平台」图床时图片提交到仓库的位置，默认 public/images（仓库根目录下的 public/images）。",
      placeholder: "public/images",
    },
    imageLinkPath: {
      tip: "文章内图片引用前缀，默认 /images（以站点根开头的绝对路径，对应 public/images）。",
      placeholder: "/images",
    },
    dynYamlCfg: {
      tip: "YAML 预设配置（JSON 片段），发布时逐键合并进文章 Front Matter。留空时不追加额外字段；Astro 默认写入 title、description、pubDate（yyyy-MM-dd）、tags、categories、keywords。",
      placeholder: "{\"draft\": false}",
    },
    defaultMsg: { tip: "提交到仓库的 commit message，文章与图片的每次提交都会带上它。", placeholder: "auto published by siyuan-plugin-publisher" },
    author: { tip: "commit 作者名，会写入仓库的提交记录，建议填自己的 GitLab 用户名或显示名。", placeholder: "your-name" },
    email: { tip: "commit 作者邮箱，会写入仓库的提交记录。", placeholder: "you@example.com" },
    site: {
      tip: "作者主页地址，默认由「平台首页 + 用户名」拼出；Astro 的文章 Front Matter 不含作者字段，此处仅作账号信息。",
      placeholder: "https://gitlab.example.com/your-gitlab-name",
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
      a: "Astro 默认使用「当前平台」图床，图片提交到仓库根目录的 public/images，文章中引用绝对路径 /images/<图片名>；Astro 构建时把 public 下的资源原样输出。",
    },
    {
      q: "发布目录能不能改？",
      a: "不能。Astro 的发布目录固定为内容集合目录（默认 src/content/blog），配置页不提供修改；如需更换请在仓库中调整内容集合位置后重新发布。",
    },
    {
      q: "查看链接打不开？",
      a: "查看链接为仓库中该 .md 的 blob 地址（/[user]/[repo]/blob/[branch]/[docpath]），仓库中存在该文件即可打开，需已登录 GitLab 且对该仓库有访问权限。",
    },
  ],
  tour: [
    { target: "[data-syp-tour='home']", title: "平台首页", content: "填写你的 GitLab 实例首页地址，用于拼出仓库地址。", placement: "bottom" },
    { target: "[data-syp-tour='apiUrl']", title: "API 地址", content: "API 地址与平台首页一致，填写平台首页后会自动同步。", placement: "bottom" },
    { target: "[data-syp-tour='username']", title: "用户名", content: "填写仓库所有者用户名，与仓库名共同定位目标仓库。", placement: "bottom" },
    { target: "[data-syp-tour='token']", title: "Token", content: "GitLab 个人访问令牌，需对目标仓库有 push 权限。", placement: "bottom" },
    { target: "[data-syp-tour='knowledgeSpace']", title: "文章目录", content: "Astro 文章默认存储目录 src/content/blog，文件名规则默认 [slug].md，该目录不支持修改。", placement: "bottom" },
    { target: "[data-syp-tour='previewUrl']", title: "查看链接", content: "预览规则固定为 /[user]/[repo]/blob/[branch]/[docpath]，查看链接为仓库中该 .md 的 blob 地址。", placement: "bottom" },
    { target: "[data-syp-tour='pageType']", title: "发布格式", content: "发布格式保持默认，无需调整。", placement: "bottom" },
    { target: "[data-syp-tour='picbedService']", title: "图片发布", content: "图床默认选「当前平台」，图片上传到仓库根目录的 public/images，文章引用绝对路径 /images/<图片名>。", placement: "bottom" },
    { target: "[data-syp-tour='validate']", title: "验证并保存", content: "验证令牌、仓库与分支后保存，再回到快速发布发布文章。", placement: "top" },
  ],
}