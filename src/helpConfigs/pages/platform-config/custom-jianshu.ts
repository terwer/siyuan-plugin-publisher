/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const jianshuHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Jianshu",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "通过 Cookie 授权发布到简书。V2 已验证配置、发布、更新、删除；图片使用简书平台内置图床（Bundled）。",
  fields: {
    home: { tip: "默认是简书首页 https://www.jianshu.com，通常保持默认。" },
    apiUrl: { tip: "默认是简书 API 地址，通常保持默认。" },
    cookie: { tip: "先登录简书，再自动读取或手动粘贴 Cookie。切换账号或登录过期后需要重新读取。" },
    knowledgeSpace: { tip: "简书笔记本（如“随笔”）。由于平台限制，已发布文档暂不支持编辑所属笔记本。" },
    pageType: { tip: "简书 V2 默认使用 Markdown 发布。" },
    picbedService: { tip: "简书 V2 已验证平台内置图片链路；默认 Bundled，PicGo 不适用。" },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认浏览器已登录简书并能打开创作中心，再重新读取 Cookie。" },
    { q: "图片该选什么图床？", a: "选择“当前平台 推荐”（Bundled）。简书通过平台图床上传图片。" },
    {
      q: "为什么不能修改所属笔记本？",
      a: "简书平台限制，已发布文档暂不支持直接编辑笔记本。需要移动时，删除原文后重新选择笔记本发布。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先登录简书，再读取 Cookie。登录过期或切换账号后需要重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "笔记本选择",
      content: "选择发布目标笔记本。简书平台限制下，已发布文档暂不支持编辑所属笔记本。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "简书 V2 已验证平台内置图片上传，默认保持“当前平台 推荐”（Bundled）。",
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
