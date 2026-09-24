/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { platformDocUrl, siteUrl } from "~/src/utils/site"

export const wordpressdotcomHelpConfig: PageHelpConfig = {
  pageId: "platform-config/wordpress_Wordpressdotcom",
  helpUrl: platformDocUrl("wordpress-wordpressdotcom"),
  summary:
    "通过 MetaWeblog XML-RPC 协议把思源笔记发布到 WordPress.com 站点。账号使用 WordPress.com 的登录用户名与密码（不是 Token）；「平台首页」填站点地址，API 地址由该地址自动推导；正文默认按 HTML 发布，查看文章链接模板为 /?p=[postid]；文章「分类」可在本页选择（验证后下拉列出站点已有分类）。访问该站点有两条通路，任选其一：「跨域代理地址」填入你自备的跨域代理服务（无需额外网络条件），或留空由思源宿主自身的网络通道直连站点（需当前网络能打开该站点）。",
  fields: {
    home: {
      tip: "你的 WordPress.com 站点地址，如 https://yoursite.wordpress.com；填写后会据此类推出 MetaWeblog API 地址。注意：该站点在部分网络环境下无法直接访问，需要能打开它的网络环境（如代理）。",
      placeholder: "https://your-site.wordpress.com",
    },
    apiUrl: {
      tip: "MetaWeblog API 地址，默认由站点地址推导（WordPress 通常为首页下的 /xmlrpc.php）。核对无误后一般无需修改。",
      placeholder: "https://your-site.wordpress.com/xmlrpc.php",
    },
    username: { tip: "WordPress.com 的登录用户名（不是昵称或显示名）。", placeholder: "you@example.com" },
    password: {
      tip: "WordPress.com 的登录密码（MetaWeblog 按账号密码鉴权，不使用 Token）。",
      placeholder: "your-application-password",
    },
    previewUrl: {
      tip: "查看文章链接模板，默认 /?p=[postid]，与 WordPress.com 的默认文章地址一致；若站点启用了自定义永久链接，可改成实际形态。",
      placeholder: "/?p=[postid]",
    },
    pageType: { tip: "正文提交格式，默认 HTML；WordPress.com 按原样接收正文，保持默认即可。" },
    corsAnywhereUrl: {
      tip:
        "跨域代理地址（可选）。填入你自备的跨域代理服务后，发布请求经它转发，**无需额外网络条件**即可访问 WordPress.com；" +
        "留空则改由思源宿主自身的网络通道直连站点，此时需当前网络能正常打开该站点。两条通路任选其一。" +
        "代理可用 cors-anywhere 自建或部署到 Cloudflare Workers，插件不内置公共代理地址，部署源码需邮件索取。",
      placeholder: "https://your-cors-proxy.example.com",
      link: siteUrl("guide/cors-proxy"),
      linkText: "如何配置 CORS 代理？",
    },
    picbedService: {
      tip:
        "图片发布方式：可选「当前平台」（图片随文章提交到 WordPress.com 媒体库）、「PicGo 强烈推荐」（改用你配置的 PicGo）、" +
        "或「不使用」按原图地址引用（需公网可访问）。",
    },
  },
  faq: [
    {
      q: "验证失败或提示账号错误？",
      a: "确认用户名是 WordPress.com 的登录用户名、密码是登录密码（该平台不使用 Token）；再确认站点地址与 API 地址正确。",
    },
    {
      q: "网络不通 / 连不上站点，该怎么办？",
      a: "本平台提供两条通路，按你的网络情况任选其一：① 在「跨域代理地址」填入你自备的跨域代理服务，发布请求经它转发，不需要额外网络条件；② 留空，由思源宿主自身的网络通道直连站点，此时需要当前网络能正常打开你的 WordPress.com 站点（可先用浏览器确认）。",
    },
    {
      q: "为什么没有「发布目录」？",
      a: "WordPress.com 的文章直接发布到站点，不涉及目录概念，因此配置页不提供该行。文章「分类」可以在本页选择：点「验证」后下拉列出站点已有分类，可多选。",
    },
    {
      q: "图片要怎么发布？",
      a: "按需选择图床：「当前平台」随文章提交到站点媒体库；「PicGo 强烈推荐」先在上层设置里配置好 PicGo；「不使用」则按原图地址引用。",
    },
    {
      q: "查看文章链接打不开？",
      a: "查看链接按 /?p=[postid] 拼出。若站点启用了自定义永久链接，请在「查看规则」里改成实际形态。",
    },
    {
      q: "更新与删除会怎样？",
      a: "点「更新」会覆盖站点上的同一篇文章；「删除」会移除该文章。两者都要求 API 地址与鉴权仍然有效。",
    },
  ],
  tour: [
    { target: "[data-syp-tour='home']", title: "站点首页", content: "填写你的 WordPress.com 站点地址，API 地址会据此推导。", placement: "bottom" },
    { target: "[data-syp-tour='apiUrl']", title: "API 地址", content: "MetaWeblog API 地址，通常为站点首页下的 /xmlrpc.php，核对无误即可。", placement: "bottom" },
    { target: "[data-syp-tour='username']", title: "用户名", content: "填写 WordPress.com 的登录用户名。", placement: "bottom" },
    { target: "[data-syp-tour='password']", title: "密码", content: "填写 WordPress.com 的登录密码，该平台不使用 Token。", placement: "bottom" },
    { target: "[data-syp-tour='previewUrl']", title: "查看链接", content: "查看文章链接模板默认 /?p=[postid]；启用自定义永久链接时改成实际形态。", placement: "bottom" },
    { target: "[data-syp-tour='pageType']", title: "发布格式", content: "正文默认按 HTML 提交，保持默认即可。", placement: "bottom" },
    { target: "[data-syp-tour='picbedService']", title: "图片发布", content: "按需选择图床：当前平台 / PicGo / 不使用。", placement: "bottom" },
    {
      target: "[data-syp-tour='corsProxy']",
      title: "跨域代理地址",
      content: "可选。填入你自备的跨域代理服务后，发布请求经它转发，无需额外网络条件；留空则由思源宿主自身的网络通道直连站点，需当前网络能打开该站点。",
      placement: "top",
    },
    { target: "[data-syp-tour='validate']", title: "验证并保存", content: "填写完成后点「验证并保存」，验证连通性通过即可开始发布。", placement: "top" },
  ],
}