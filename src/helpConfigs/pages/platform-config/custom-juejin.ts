/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const juejinHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Juejin",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过 Cookie 授权发布到掘金。V2 已验证配置、发布、更新、删除和原生图片上传（字节 veImageX 直传，Bundled）；默认使用 Markdown 内容发布。",
  fields: {
    home: { tip: "默认是掘金首页 https://juejin.cn，通常保持默认。" },
    apiUrl: { tip: "默认是掘金 API 地址 https://api.juejin.cn，通常保持默认。" },
    cookie: { tip: "先在浏览器登录掘金，再自动读取或手动粘贴 Cookie。切换账号或登录过期后需要重新读取。" },
    knowledgeSpace: { tip: "掘金分类（如“后端”）。发布前需选择一个分类；未选择时回退默认分类“后端”。" },
    pageType: { tip: "掘金 V2 默认使用 Markdown 发布，且会带上掘金要求的标签（默认“程序员”）与摘要。" },
    picbedService: { tip: "掘金 V2 已验证原生图片上传；默认“当前平台 推荐”（Bundled），外链图片原样保留，PicGo 双通道并存。" },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认浏览器已登录掘金并能打开掘金编辑器，再重新读取 Cookie。" },
    { q: "发布时报“必须选择一个分类/标签”或“摘要参数错误”？", a: "掘金要求分类、标签和摘要；未配置时会自动回退默认分类“后端”、默认标签“程序员”与默认摘要，但建议在文档里显式设置。" },
    { q: "图片该选什么图床？", a: "选择“当前平台 推荐”（Bundled）。掘金已验证原生 veImageX 直传，外链图片原样保留不转存；不依赖本机 PicGo 服务。" },
    { q: "文章一直显示“审核中”？", a: "掘金新文章初始处于审核（audit=1），需平台放行（audit=2）后才对外可见，与图片上传机制无关。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先登录掘金，再读取 Cookie。登录过期或切换账号后需要重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "分类选择",
      content: "选择发布目标分类。掘金发布需要分类，未选择会用默认分类“后端”。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "掘金 V2 已验证原生图片上传，默认保持“当前平台 推荐”（Bundled），外链图片保留，PicGo 双通道并存。",
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
