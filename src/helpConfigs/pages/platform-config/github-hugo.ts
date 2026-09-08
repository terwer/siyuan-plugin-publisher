/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const hugoHelpConfig: PageHelpConfig = {
  pageId: "platform-config/github_Hugo",
  helpUrl: "https://siyuan.wiki/s/20230908182946-itm4luf",
  summary:
    "通过 GitHub API 将文章发布到 Hugo 静态博客仓库。账号使用 GitHub Token（PAT）；图片选「当前平台」图床上传到仓库 static/images，文章内引用为绝对路径 /images/<图片名>（Hugo 构建时把 static/ 原样复制到站点根，构建产物即可正确显示，这是官方推荐的引用方式）；查看链接为站点文章地址（/post/<slug>.html）。",
  fields: {
    home: { tip: "GitHub 首页地址，默认 https://github.com。" },
    apiUrl: { tip: "GitHub API 地址，默认 https://api.github.com，通常无需修改。" },
    username: { tip: "GitHub 用户名（owner），用于拼出仓库地址。token 需对该仓库有 push 权限。" },
    password: {
      tip: "GitHub 个人访问令牌（PAT，Token）。在 GitHub Settings → Developer settings → Personal access tokens 生成，需勾选 repo 权限。",
      link: "https://github.com/settings/tokens",
      linkText: "Token 生成地址",
    },
    githubRepo: { tip: "Hugo 博客仓库名，与用户名组成 <user>/<repo>，例如 hugo-blog。" },
    githubBranch: { tip: "发布到的分支，默认 main，需与仓库实际分支一致。" },
    defaultPath: { tip: "Hugo 文章存储目录，默认 content/post。发布后的 .md 会写入该目录。" },
    mdFilenameRule: { tip: "文章文件名规则，默认 [slug].md。" },
    previewPostUrl: { tip: "站点文章预览规则，默认 /post/[postid].html，发布后「查看文章」链接按此合成。注意：「YAML永久链接」写入的 url 是固定的 /post/<文章别名>.html，不读这条规则。" },
    previewUrl: { tip: "GitHub blob 预览规则，默认 /[user]/[repo]/blob/[branch]/[docpath]。" },
    pageType: { tip: "Hugo 默认按 Markdown 内容发布。" },
    picbedService: { tip: "Hugo 图片会提交到博客仓库。选择「当前平台」图床，图片上传到仓库 static/images，文章中引用为绝对路径 /images/<图片名>（Hugo 构建时 static/ 原样复制到站点根）。" },
    yamlLinkEnabled: {
      tip: "开启后在 Front Matter 写入 url 字段，取值固定为 /post/<文章别名>.html，用于锁定文章在站点的访问地址。关闭则不写 url，文章地址由主题的 permalink 配置与文件路径决定。",
    },
    blogid: {
      tip: "发布目录，只读，与「存储目录」保持一致（当前 content/post）：文章 .md 提交到该目录。",
    },
    imageStorePath: {
      tip: "选「当前平台」图床时图片提交到仓库的位置，默认 static/images。",
    },
    imageLinkPath: {
      tip: "文章内图片引用前缀，默认 images，即引用为 /images/<图片名> 的站点根绝对路径（Hugo 构建时把 static/ 原样复制到站点根）；填 ./images 或 ../images 则改为相对文章路径引用。",
    },
    dynYamlCfg: {
      tip: "YAML 预设配置（JSON 片段），发布时最后合并进文章 Front Matter，用于补充主题需要的自定义字段；同名键会覆盖前面自动生成的字段。",
    },
    defaultMsg: { tip: "提交到仓库的 commit message，文章与图片的每次提交都会带上它。" },
    author: { tip: "commit 作者名，会写入仓库的提交记录，建议填自己的 GitHub 用户名或显示名。" },
    email: { tip: "commit 作者邮箱，会写入仓库的提交记录。" },
    site: {
      tip: "作者主页地址，默认由「平台首页 + 用户名」拼出；Hugo 的文章 Front Matter 不写作者字段，此处仅作账号信息。",
    },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认 Token 有对目标仓库的 push 权限，仓库名与分支填写正确，存储目录已存在。Token 权限不足会在发布时收到 401/403。",
    },
    {
      q: "图片要怎么发布？",
      a: "选择「当前平台」图床，图片会上传到仓库的 static/images 目录（默认），文章中引用为绝对路径 /images/<图片名> 地址。Hugo 构建时把 static/ 目录原样复制到站点根，因此构建产物中该绝对路径能正确显示，这也是官方推荐的引用方式。",
    },
    {
      q: "查看链接打不开？",
      a: "查看链接为站点文章地址（默认 /post/<postid>.html）。开启「YAML 永久链接」会在 front matter 写入 url 字段锁定地址，取值固定为 /post/<文章别名>.html，不跟随「文章预览规则」；若关闭，则地址由主题的 permalink 配置与文章在 content 下的路径决定。确认预览规则与主题实际生成的地址一致，不一致时按主题规则修改预览规则即可。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会重新提交该文章并产生一次新提交；「删除」会从仓库移除对应 .md 文件，需要重新发布才能再次出现在站点。",
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
      content: "Hugo 默认按 Markdown 内容发布。",
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
