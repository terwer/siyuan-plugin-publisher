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
  summary: "通过 Cookie 授权发布到掘金。图片默认走掘金原生上传；默认使用 Markdown 发布。",
  fields: {
    home: { tip: "默认是掘金首页 https://juejin.cn，通常保持默认。" },
    apiUrl: { tip: "默认是掘金 API 地址 https://api.juejin.cn，通常保持默认。" },
    password: {
      tip:
        "Cookie 授权：点「1 去登录」登录掘金，关闭登录窗口保存登录态后点「2 自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。切换账号或登录过期后需要重新读取。",
    },
    previewUrl: { tip: "查看文章链接模板，默认 /post/[postid]，与掘金文章地址一致，通常保持默认。" },
    pageType: { tip: "正文提交格式，掘金默认使用 Markdown 发布，且会带上掘金要求的标签（默认「程序员」）与摘要。" },
    blogid: {
      tip: "要发布到的掘金分类（如「后端」）；验证通过后会列出可用分类。未选择时回退默认分类「后端」。",
    },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片走掘金原生上传（veImageX 直传），外链图片原样保留不转存；" +
        "也可选「不使用」按原图地址引用，或选「PicGo 强烈推荐」改用你配置的 PicGo。",
    },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认浏览器已登录掘金并能打开掘金创作中心，再重新读取 Cookie。" },
    { q: "发布时报“必须选择一个分类/标签”或“摘要参数错误”？", a: "掘金要求分类、标签和摘要；未配置时会自动回退默认分类“后端”、默认标签“程序员”与默认摘要，但建议在文档里显式设置。" },
    { q: "图片该选什么图床？", a: "默认「当前平台」即可，图片走掘金原生直传，外链图片原样保留不转存，不依赖本机 PicGo 服务；需要走 PicGo 时选「PicGo 强烈推荐」。" },
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
      content: "掘金使用平台原生图片上传，默认保持“当前平台 推荐”（Bundled），外链图片保留，PicGo 双通道并存。",
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
