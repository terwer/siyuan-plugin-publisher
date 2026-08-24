/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const haloHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Halo",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary:
    "通过 Halo API 发布到 Halo 2.x 博客。V2 已验证配置、发布、更新、删除、带图发布与查看链接。Halo API 平台仅支持 Halo 2.9（2.20+ 已调整 API 策略，需改用「Halo网页版」）。账号使用用户名与密码，图片由内置图床上传到 Halo 附件，发布后文章地址形如 https://<host>/archives/<slug>。",
  fields: {
    home: { tip: "Halo 站点首页地址，通常与 API 地址一致，如 https://yourhalo.com。" },
    apiUrl: { tip: "Halo 站点 API 地址，通常与首页地址相同，如 https://yourhalo.com。" },
    username: { tip: "Halo 登录用户名（非令牌）。在 Halo 后台下发文章与附件需要该账号权限。" },
    password: {
      tip: "Halo 登录密码（非令牌），与用户名一起用于 API 认证。",
      link: "https://siyuan.wiki/s/20230908183639-btcnnmj",
    },
    previewUrl: { tip: "Halo 文章预览规则，默认 /archives/{slug}；查看链接为 https://<host>/archives/<slug>，可修改。" },
    pageType: { tip: "Halo V2 默认按 HTML 内容发布。" },
    picbedService: { tip: "Halo 支持内置图床，选择「当前平台」可将图片上传到 Halo 附件（/upload/）。" },
  },
  faq: [
    {
      q: "验证通过但发布失败？",
      a: "确认首页/API 地址可访问（http 或 https 保持一致），用户名与密码正确，账号有发文与上传附件权限。",
    },
    {
      q: "Halo 版本要求？",
      a: "Halo API 平台仅支持 Halo 2.9。Halo 2.20+ 已调整 API 策略，请改用「Halo网页版」平台。",
    },
    {
      q: "图片要怎么发布？",
      a: "选择「当前平台」图床，图片会上传到 Halo 附件，文章中展示为 /upload/<图片名> 地址。",
    },
    {
      q: "查看链接打不开？",
      a: "确认预览规则（默认为 /archives/{slug}）与文章 slug 匹配，且文章已发布为非草稿状态再访问。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "首页地址",
      content: "Halo 站点首页地址，通常与 API 地址一致。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "Halo 站点 API 地址，通常与首页地址相同。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "用户名",
      content: "Halo 登录用户名，用于 API 认证（非令牌）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='password']",
      title: "密码",
      content: "Halo 登录密码，与用户名一起用于 API 认证（非令牌）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='previewUrl']",
      title: "查看链接",
      content: "预览规则默认 /archives/{slug}，查看链接为 https://<host>/archives/<slug>。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "发布格式",
      content: "Halo V2 默认按 HTML 内容发布。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "选择「当前平台」图床，图片上传到 Halo 附件（/upload/）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证用户名、密码与站点连通后保存，再进行发布。",
      placement: "top",
    },
  ],
}
