/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const cnblogsHelpConfig: PageHelpConfig = {
  pageId: "platform-config/metaweblog_Cnblogs",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "将思源笔记发布到博客园。使用 MetaWeblog XML-RPC 协议。",
  fields: {
    home: { tip: "你的博客园博客首页，如 https://cnblogs.com/yourname" },
    apiUrl: {
      tip: "博客园 MetaWeblog API 地址：https://rpc.cnblogs.com/metaweblog/yourblogname",
      link: "https://siyuan.wiki/s/20230908183639-btcnnmj",
      linkText: "如何获取 API 地址？",
    },
    username: { tip: "博客园登录用户名" },
    password: {
      tip: "博客园 API Token（在设置 → 开放 API 中生成），不是登录密码",
      link: "https://siyuan.wiki/s/20230908183639-btcnnmj",
    },
  },
  faq: [
    { q: "提示「用户名或密码错误」？", a: "确认是否使用了 API Token 而非登录密码，Token 生成了吗？" },
    { q: "图片上传失败？", a: "博客园推荐使用 Bundled 图床（平台内置），或配置 PicGo。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "首页地址",
      content: "填写你的博客园博客首页地址，如 https://cnblogs.com/yourname。发布后文章链接会基于此地址生成。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "填写博客园的 MetaWeblog API 端点地址。格式为 https://rpc.cnblogs.com/metaweblog/yourblogname。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "用户名",
      content: "填写你的博客园登录用户名。注意不是昵称或显示名。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='password']",
      title: "API Token",
      content: "这里填的是博客园 API Token，不是你的登录密码。在博客园后台 → 设置 → 开放 API 中生成。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "填写完成后点击「验证并保存」，系统会测试 API 连通性。验证通过后平台即配置完成，可以开始发布。",
      placement: "top",
    },
  ],
}