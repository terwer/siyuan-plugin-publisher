/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const metaweblogHelpConfig: PageHelpConfig = {
  pageId: "platform-config/metaweblog_Metaweblog",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "「Metaweblog 通用」用于接入任何实现了 MetaWeblog XML-RPC 协议、但插件尚未单独适配的博客。账号使用该博客的后台登录用户名与密码（不是 Token）；「平台首页」填博客地址，「API 地址」需要你按站点实际的 XML-RPC 端点手动填写（通用入口不会自动推导）；正文默认按 HTML 提交；查看链接模板默认留空，需要你按该站的文章地址形态填写；该入口不提供「发布目录」行。",
  fields: {
    home: {
      tip: "你的博客首页地址，如 https://blog.example.com。通用入口不会据此推导 API 地址，两者需要分别填写。",
      placeholder: "https://your-blog.com",
    },
    apiUrl: {
      tip: "该博客的 MetaWeblog XML-RPC 端点，需要按站点实际情况填写，通用入口不会自动推导。常见形态为站点下的 /xmlrpc.php 或 /action/xmlrpc，具体以所用博客系统为准。",
      placeholder: "https://your-blog.com/xmlrpc.php",
    },
    username: {
      tip: "该博客后台的登录用户名（不是昵称或显示名）；部分系统也接受用于远程发布的专用账号。",
      placeholder: "your-blog-name",
    },
    password: {
      tip: "该博客后台的登录密码。MetaWeblog 按账号密码鉴权，不使用 Token；若站点开启了独立的应用密码/远程发布密码，请填该密码。",
      placeholder: "your-blog-password",
    },
    previewUrl: {
      tip: "查看文章链接模板，默认留空，需要你按该站文章地址的实际形态填写，[postid] 会被替换为文章 ID。例如 /?p=[postid]、/archives/[postid]、/index.php/archives/[postid] 都是常见形态。",
      placeholder: "/?p=[postid]",
    },
    pageType: {
      tip: "正文提交格式，默认 HTML；MetaWeblog 按原样接收正文，站点支持 Markdown 时也可切换。",
    },
    picbedService: {
      tip:
        "图片发布方式：可选「当前平台」（图片随文章提交到该博客）、「PicGo 强烈推荐」（改用你配置的 PicGo）、" +
        "或「不使用」按原图地址引用（需公网可访问）。",
    },
  },
  faq: [
    {
      q: "这个入口和「博客园」「Typecho」等有什么区别？",
      a: "那些是插件的专用适配入口，会预设好各自的 API 地址形态与查看链接模板。「Metaweblog 通用」不预设这些，需要你按站点实际情况填写，适用于尚未单独适配的 MetaWeblog 博客。",
    },
    {
      q: "API 地址填什么？",
      a: "填该博客的 MetaWeblog XML-RPC 端点。不同博客系统路径不同，常见为站点下的 /xmlrpc.php 或 /action/xmlrpc；可在博客系统的官方文档里确认远程发布端点。",
    },
    {
      q: "验证失败或提示账号错误？",
      a: "确认用户名是后台登录用户名、密码是登录密码（该协议不使用 Token）；再确认 API 地址是可访问的 XML-RPC 端点。若站点要求独立的应用密码，请改用应用密码。",
    },
    {
      q: "为什么没有「发布目录」？",
      a: "通用入口通过 MetaWeblog 发布时不暴露分类目录选择，文章直接进入站点，因此配置页不提供该行。",
    },
    {
      q: "查看文章链接打不开？",
      a: "查看链接按「查看规则」拼出，而该规则默认留空。请按本站文章地址的实际形态填写，例如 /?p=[postid] 或 /index.php/archives/[postid]。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "博客首页",
      content: "先填你的博客地址；通用入口不会据此推导 API 地址，下一步要单独填。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "按本站实际的 XML-RPC 端点手动填写。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "用户名",
      content: "填写该博客后台的登录用户名。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='password']",
      title: "密码",
      content: "填写后台登录密码，该协议不使用 Token。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='previewUrl']",
      title: "查看链接",
      content: "该规则默认留空，按本站文章地址形态填入。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "发布格式",
      content: "正文默认按 HTML 提交，保持默认即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "按需选择图床：当前平台 / PicGo / 不使用。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "填写完成后点「验证并保存」，验证连通性通过即可开始发布。",
      placement: "top",
    },
  ],
}
