/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

/**
 * Telegraph 配置页帮助（覆盖匿名 / 登录发布两种模式）
 */
export const telegraphHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Telegraph",
  helpUrl: "https://siyuan.wiki/s/20240312153728-paen10j",
  summary:
    "将思源笔记发布到 Telegra.ph。支持两种模式：匿名发布（无需账号，仅用生成的 Uuid 与 Hash）与登录发布（需账号的 Access Token）。Telegraph 为 CORS 受限平台，必须填写你自己的 CORS 代理地址。",
  fields: {
    home: { tip: "Telegra.ph 平台首页，通常固定为 https://telegra.ph" },
    apiUrl: {
      tip: "Telegra.ph 接口地址，通常固定为 https://edit.telegra.ph",
    },
    username: { tip: "作者名，显示在文章详情，可自行设置，默认为空" },
    password: { tip: "Uuid：匿名模式验证后自动获取，登录模式需从浏览器工具读取 tph_uuid" },
    saveHash: { tip: "Hash：验证后自动保存，或登录模式手动填写 save hash" },
    corsAnywhereUrl: {
      tip: "Telegraph 为 CORS 受限平台，必须填写你自己的 CORS 代理地址，否则无法访问",
      link: "https://siyuan.wiki/s/20240312153728-paen10j",
      linkText: "如何配置 CORS 代理？",
    },
  },
  faq: [
    {
      q: "匿名发布和登录发布有什么区别？",
      a: "匿名发布无需 Telegraph 账号，验证时自动获取 Uuid 与 Hash 即可发布，文章匿名；登录发布需要你自己的 Access Token，文章归入你的账号。",
    },
    {
      q: "提示「需要配置 CORS 代理地址」？",
      a: "Telegraph 需要通过跨域代理才能访问。请在「跨域代理地址」配置项填写你自己的代理地址，参考文档：https://siyuan.wiki/s/20240312153728-paen10j",
    },
    {
      q: "切换设备后发布失败？",
      a: "Telegraph 的 Uuid/Hash 与设备绑定，切换设备（含从 PC 到浏览器环境）需要重新验证并获取新 Uuid/Hash。",
    },
    {
      q: "支持图片上传吗？",
      a: "暂不支持。Telegra.ph 不提供平台图片上传，建议配合本地或图床方案。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "平台首页",
      content: "填写 Telegra.ph 平台首页，通常固定为 https://telegra.ph。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "接口地址",
      content: "填写 Telegra.ph 接口地址，通常固定为 https://edit.telegra.ph。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "作者",
      content: "填写显示在文章详情的作者名，可自行设置，默认为空。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='password']",
      title: "Uuid",
      content: "匿名模式点击验证后自动获取，登录模式需从浏览器开发者工具读取 tph_uuid。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='corsProxy']",
      title: "跨域代理地址",
      content: "Telegraph 需要通过跨域代理才能访问。这里填写你自己的代理地址，留空则此平台无法使用。",
      placement: "top",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "填写完成后点击「验证」，系统会测试连通性并自动获取 Uuid/Hash。验证通过后即可发布。",
      placement: "top",
    },
  ],
}
