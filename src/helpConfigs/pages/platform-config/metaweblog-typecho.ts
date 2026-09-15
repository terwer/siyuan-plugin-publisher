/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const typechoHelpConfig: PageHelpConfig = {
  pageId: "platform-config/metaweblog_Typecho",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过 MetaWeblog XML-RPC 协议把思源笔记发布到自建的 Typecho 博客。账号使用 Typecho 的登录用户名与密码（不是 Token）；「平台首页」填博客地址，API 地址由该地址自动推导；正文默认按 HTML 发布，查看文章链接模板为 /index.php/archives/[postid]；Typecho 无发布目录概念，因此没有「发布目录」行。",
  fields: {
    home: {
      tip: "你的 Typecho 博客首页地址，如 https://blog.example.com；填写后会据此类推出 MetaWeblog API 地址。",
    },
    apiUrl: {
      tip: "MetaWeblog API 地址，默认由博客首页推导（Typecho 通常为首页下的 /action/xmlrpc）。核对无误后一般无需修改。",
    },
    username: { tip: "Typecho 后台的登录用户名（不是昵称或显示名）。" },
    password: {
      tip: "Typecho 后台的登录密码（MetaWeblog 按账号密码鉴权，不使用 Token）。",
    },
    previewUrl: {
      tip: "查看文章链接模板，默认 /index.php/archives/[postid]，与 Typecho 的文章地址一致；若你的站点启用了地址重写，可改成实际形态。",
    },
    pageType: { tip: "正文提交格式，默认 HTML；Typecho 按原样接收正文，保持默认即可。" },
    picbedService: {
      tip:
        "图片发布方式：可选「当前平台」（图片随文章提交到 Typecho 站点）、「PicGo 强烈推荐」（改用你配置的 PicGo）、" +
        "或「不使用」按原图地址引用（需公网可访问）。",
    },
  },
  faq: [
    {
      q: "验证失败或提示账号错误？",
      a: "确认用户名是 Typecho 后台的登录用户名、密码是登录密码（该平台不使用 Token）；再确认 API 地址确实是站点的 XML-RPC 端点。",
    },
    {
      q: "为什么没有「发布目录」？",
      a: "Typecho 通过 MetaWeblog 发布时不暴露分类目录选择，文章直接进入站点，因此配置页不提供该行。",
    },
    {
      q: "图片要怎么发布？",
      a: "按需选择图床：「当前平台」随文章提交到站点；「PicGo 强烈推荐」先在上层设置里配置好 PicGo；「不使用」则按原图地址引用。",
    },
    {
      q: "查看文章链接打不开？",
      a: "查看链接按 /index.php/archives/[postid] 拼出。若你的 Typecho 启用了伪静态或自定义永久链接，请在「查看规则」里改成实际形态。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会覆盖站点上的同一篇文章；「删除」会移除该文章。两者都要求 API 地址与鉴权仍然有效。",
    },
  ],
  tour: [
    { target: "[data-syp-tour='home']", title: "博客首页", content: "填写你的 Typecho 博客首页地址，API 地址会据此推导。", placement: "bottom" },
    { target: "[data-syp-tour='apiUrl']", title: "API 地址", content: "MetaWeblog API 地址，通常为博客首页下的 /action/xmlrpc，核对无误即可。", placement: "bottom" },
    { target: "[data-syp-tour='username']", title: "用户名", content: "填写 Typecho 后台的登录用户名。", placement: "bottom" },
    { target: "[data-syp-tour='password']", title: "密码", content: "填写 Typecho 后台的登录密码，该平台不使用 Token。", placement: "bottom" },
    { target: "[data-syp-tour='previewUrl']", title: "查看链接", content: "查看文章链接模板默认 /index.php/archives/[postid]；启用伪静态时改成实际形态。", placement: "bottom" },
    { target: "[data-syp-tour='pageType']", title: "发布格式", content: "正文默认按 HTML 提交，保持默认即可。", placement: "bottom" },
    { target: "[data-syp-tour='picbedService']", title: "图片发布", content: "按需选择图床：当前平台 / PicGo / 不使用。", placement: "bottom" },
    { target: "[data-syp-tour='validate']", title: "验证并保存", content: "填写完成后点「验证并保存」，验证连通性通过即可开始发布。", placement: "top" },
  ],
}