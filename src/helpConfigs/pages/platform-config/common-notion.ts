/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const notionHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Notion",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过 API Token 发布到 Notion 页面。Notion 使用 API Token（非 Cookie），页面归属到所选根页面，图片以 PicGo 外部链接图床发布为外部图片块。",
  fields: {
    home: { tip: "Notion 平台首页，通常固定为 https://www.notion.so/，保持默认。" },
    apiUrl: { tip: "Notion API 地址，通常固定为 https://api.notion.com/v1，保持默认。" },
    token: {
      tip: "Notion API Token，在 Notion 集成（my-integrations）中创建，需勾选 Read content、Update content、Insert content 三项权限。",
      link: "https://www.notion.so/my-integrations",
      linkText: "前往创建 Token",
    },
    previewUrl: { tip: "Notion 文章预览规则，固定为 /[postid]，不可修改；查看链接为 https://www.notion.so/<postid>。" },
    pageType: { tip: "Notion 默认使用 Markdown 内容发布。" },
    knowledgeSpace: { tip: "选择文章的根页面（父页面）。Notion 暂不支持修改已发布页面所属根页面。" },
    picbedService: { tip: "Notion 无内置图片上传，使用 PicGo 外部链接图床；图片以外部 image 块嵌入页面。" },
  },
  faq: [
    {
      q: "Token 验证失败？",
      a: "确认创建 Notion 集成 Token 时勾选了 Read content、Update content、Insert content 三项权限，并将集成授权给目标根页面。",
    },
    {
      q: "为什么不能修改已发布页面的根页面？",
      a: "这是 Notion 平台限制。需要移动时先删除该文档，再选择新的根页面重新发布。",
    },
    {
      q: "图片要选什么图床？",
      a: "Notion 无内置上传，选择「PicGo」。图片会先上传到外部图床，并以外部 image 块嵌入 Notion 页面。",
    },
    {
      q: "查看链接打开后提示登录 / 无权限？",
      a: "Notion 页面默认私有，需要 Notion 账号访问权限。发布成功且链接正确即为正常现象，非插件缺陷。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='token']",
      title: "API Token",
      content: "在 Notion 集成中创建 Token 并授权（读、更新、插入三项权限），然后填入。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "选择根页面",
      content: "验证通过后选择文章写入的根页面（父页面）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='previewUrl']",
      title: "查看链接",
      content: "Notion 预览规则固定为 /[postid]，查看链接为 https://www.notion.so/<postid>。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "发布格式",
      content: "Notion 默认按 Markdown 内容发布。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "Notion 无内置上传，使用 PicGo 外部链接图床，图片以外部 image 块嵌入。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证 Token、根页面和图床配置连通后保存，再进行发布。",
      placement: "top",
    },
  ],
}
