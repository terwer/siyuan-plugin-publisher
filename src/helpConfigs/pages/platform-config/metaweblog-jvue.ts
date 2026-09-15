/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const jvueHelpConfig: PageHelpConfig = {
  pageId: "platform-config/metaweblog_Jvue",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过 MetaWeblog XML-RPC 协议把思源笔记发布到 Jvue 博客。账号使用 Jvue 的登录用户名与密码（不是 Token）；「平台首页」填博客地址，「API 地址」填站点的 MetaWeblog 端点；正文默认按 Markdown 发布，查看文章链接模板固定为 /post/[postid].html（不支持修改）；Jvue 无发布目录概念，因此没有「发布目录」行。",
  fields: {
    home: { tip: "你的 Jvue 博客首页地址，如 https://blog.example.com。", placeholder: "https://your-jvue.com" },
    apiUrl: {
      tip: "站点的 MetaWeblog API 端点地址（Jvue 需显式填写，不由首页自动推导），通常为站点下提供 XML-RPC 的接口地址。",
      placeholder: "https://your-jvue.com/action/xmlrpc",
    },
    username: { tip: "Jvue 后台的登录用户名（不是昵称或显示名）。", placeholder: "your-jvue-name" },
    password: {
      tip: "Jvue 后台的登录密码（MetaWeblog 按账号密码鉴权，不使用 Token）。",
      placeholder: "your-jvue-password",
    },
    previewUrl: {
      tip: "查看文章链接模板，固定为 /post/[postid].html，与 Jvue 的文章地址一致；该平台固定使用此规则，不支持修改。",
      placeholder: "/post/[postid].html",
    },
    pageType: { tip: "正文提交格式，默认 Markdown，保持默认即可。" },
    picbedService: {
      tip:
        "图片发布方式：可选「当前平台」（图片随文章提交到 Jvue 站点）、「PicGo 强烈推荐」（改用你配置的 PicGo）、" +
        "或「不使用」按原图地址引用（需公网可访问）。",
    },
  },
  faq: [
    {
      q: "验证失败或提示账号错误？",
      a: "确认用户名是 Jvue 后台的登录用户名、密码是登录密码（该平台不使用 Token）；再确认 API 地址是站点真正提供 MetaWeblog 的端点。",
    },
    {
      q: "API 地址要不要手动填？",
      a: "要。与 Typecho 不同，Jvue 的 API 地址不会从博客首页自动推导，需填入站点提供 XML-RPC 的接口地址。",
    },
    {
      q: "图片要怎么发布？",
      a: "按需选择图床：「当前平台」随文章提交到站点；「PicGo 强烈推荐」先在上层设置里配置好 PicGo；「不使用」则按原图地址引用。",
    },
    {
      q: "查看链接能改吗？",
      a: "不能。Jvue 的查看文章链接固定为 /post/[postid].html，配置页不提供修改。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会覆盖站点上的同一篇文章；「删除」会移除该文章。两者都要求 API 地址与鉴权仍然有效。",
    },
  ],
  tour: [
    { target: "[data-syp-tour='home']", title: "博客首页", content: "填写你的 Jvue 博客首页地址。", placement: "bottom" },
    { target: "[data-syp-tour='apiUrl']", title: "API 地址", content: "填写站点的 MetaWeblog 端点，该平台需显式填写，不由首页推导。", placement: "bottom" },
    { target: "[data-syp-tour='username']", title: "用户名", content: "填写 Jvue 后台的登录用户名。", placement: "bottom" },
    { target: "[data-syp-tour='password']", title: "密码", content: "填写 Jvue 后台的登录密码，该平台不使用 Token。", placement: "bottom" },
    { target: "[data-syp-tour='previewUrl']", title: "查看链接", content: "查看文章链接固定为 /post/[postid].html，不支持修改。", placement: "bottom" },
    { target: "[data-syp-tour='pageType']", title: "发布格式", content: "正文默认按 Markdown 提交，保持默认即可。", placement: "bottom" },
    { target: "[data-syp-tour='picbedService']", title: "图片发布", content: "按需选择图床：当前平台 / PicGo / 不使用。", placement: "bottom" },
    { target: "[data-syp-tour='validate']", title: "验证并保存", content: "填写完成后点「验证并保存」，验证连通性通过即可开始发布。", placement: "top" },
  ],
}