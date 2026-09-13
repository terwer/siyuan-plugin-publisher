/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const bilibiliHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Bilibili",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "通过 Cookie 授权发布到哔哩哔哩专栏（opus）。图片默认走平台上传；以 Markdown 发布，可选择文集。",
  fields: {
    home: { tip: "默认是哔哩哔哩专栏地址 https://www.bilibili.com/opus，通常保持默认。" },
    apiUrl: { tip: "默认是哔哩哔哩 API 地址 https://api.bilibili.com，通常保持默认。" },
    password: {
      tip:
        "Cookie 授权：点「1 去登录」登录哔哩哔哩，关闭登录窗口保存登录态后点「2 自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。切换账号或登录过期后需重新读取。",
    },
    previewUrl: {
      tip: "查看文章链接模板，默认 /[postid]，对应 B 站专栏地址 https://www.bilibili.com/opus/<id>，通常保持默认。",
    },
    pageType: { tip: "正文提交格式，哔哩哔哩默认使用 Markdown 发布，保持默认的 Markdown。" },
    blogid: {
      tip: "要发布到的哔哩哔哩文集（如「远方的灯塔」）；验证通过后会列出可用文集。未选择时发布为独立专栏。",
    },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片走哔哩哔哩平台上传；也可选「不使用」按原图地址引用（需公网可访问）。" +
        "哔哩哔哩网页版未提供 PicGo 选项。",
    },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认浏览器已登录哔哩哔哩且账号可访问创作中心（member.bilibili.com），再重新读取 Cookie。" },
    { q: "图片该选什么图床？", a: "默认「当前平台」即可。哔哩哔哩使用平台图片上传，不依赖本机 PicGo 服务。" },
    { q: "发布后在 B 站哪里查看？", a: "发布成功后点“查看文章”打开 https://www.bilibili.com/opus/<id>，也可在 B 站创作中心 → 专栏管理查看。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先登录哔哩哔哩，再读取 Cookie。登录过期或切换账号后需重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "发布格式",
      content: "哔哩哔哩默认按 Markdown 内容发布，通常保持默认即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "哔哩哔哩使用平台图片上传，默认保持“当前平台 推荐”（Bundled）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "文集",
      content: "选择文章归入的哔哩哔哩文集（如“远方的灯塔”）；未选择时发布为独立专栏。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证 Cookie 和平台连通性后保存配置，再进行发布。",
      placement: "top",
    },
  ],
}
