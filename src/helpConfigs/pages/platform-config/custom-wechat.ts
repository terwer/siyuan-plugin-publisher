/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const wechatHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Wechat",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "通过登录公众号后台的 Cookie 发布到微信公众号。V2 支持配置、发布、更新、删除与平台素材库图片上传（Bundled）；以 HTML 内容发布。",
  fields: {
    home: { tip: "默认是公众号后台 https://mp.weixin.qq.com，通常保持默认。" },
    apiUrl: { tip: "默认是公众号后台接口地址，通常保持默认。" },
    cookie: { tip: "先在浏览器登录公众号后台（mp.weixin.qq.com），再自动读取或手动粘贴 Cookie。登录过期或切换账号后需重新读取。" },
    previewUrl: { tip: "公众号文章编辑页 URL 模板，一般保持默认。" },
    pageType: { tip: "公众号 V2 通过 HTML 内容发布。" },
    picbedService: { tip: "公众号默认使用平台素材库上传图片（当前平台 推荐）。" },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认已用公众号管理员账号登录 mp.weixin.qq.com（微信扫码登录），再重新读取 Cookie。" },
    { q: "图片该选什么图床？", a: "选择“当前平台 推荐”（Bundled）。公众号通过素材库接口上传图片，不依赖本机 PicGo 服务。" },
    { q: "发布成功但内容为空？", a: "公众号以 HTML 内容发布。若文档为纯 Markdown 且未转换为 HTML，请确认文档能正确渲染为 HTML 后再发布。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先用公众号管理员微信在浏览器登录 mp.weixin.qq.com，再读取 Cookie。登录过期或切换账号后需重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "发布格式",
      content: "公众号默认按 HTML 内容发布，通常保持默认即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "公众号 V2 使用平台素材库上传图片，默认保持“当前平台 推荐”（Bundled）。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证 Cookie 和公众号后台连通性后保存配置，再进行发布。",
      placement: "top",
    },
  ],
}
