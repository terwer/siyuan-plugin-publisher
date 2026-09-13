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
  summary: "通过 Cookie 授权发布到简书。图片默认上传到简书；已发布文章暂不支持更换笔记本。",
  fields: {
    home: { tip: "默认是简书首页 https://www.jianshu.com，通常保持默认。" },
    apiUrl: { tip: "默认是简书 API 地址，通常保持默认。" },
    password: {
      tip:
        "Cookie 授权：点「1 去登录」登录简书，关闭登录窗口保存登录态后点「2 自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。切换账号或登录过期后需要重新读取。",
    },
    previewUrl: { tip: "查看文章链接模板，默认 /p/[postid]，与简书文章地址一致，通常保持默认。" },
    pageType: { tip: "正文提交格式，简书默认使用 Markdown 发布，保持默认的 Markdown。" },
    blogid: {
      tip: "要发布到的简书笔记本（如「随笔」）。已发布文章暂不支持更换笔记本；需要移动时删除原文后重新选择笔记本发布。",
    },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片随文章上传到简书；也可选「不使用」按原图地址引用（需公网可访问）。" +
        "简书网页版未提供 PicGo 选项。",
    },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认浏览器已登录简书并能打开创作中心，再重新读取 Cookie。" },
    { q: "图片该选什么图床？", a: "默认「当前平台」即可，图片随文章上传到简书。" },
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
      content: "简书使用平台内置图片上传，默认保持“当前平台 推荐”（Bundled）。",
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
