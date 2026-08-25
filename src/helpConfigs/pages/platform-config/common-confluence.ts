/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

/**
 * Confluence 配置页帮助
 */
export const confluenceHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Confluence",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary:
    "将思源笔记发布到 Atlassian Confluence。使用个人访问令牌（Personal Access Token, PAT）鉴权，发布到指定「空间」，可选挂载到「父页面」下。Confluence 支持平台自带图片上传（以附件形态管理）。",
  fields: {
    home: { tip: "Confluence 站点首页地址，例如 http://localhost:8090（Atom/Jira 服务器地址）" },
    apiUrl: { tip: "Confluence API 地址，通常与平台首页一致（如 http://localhost:8090），在修改首页后自动同步" },
    password: {
      tip: "个人访问令牌（PAT），在 Confluence 的 Personal Access Tokens 页面生成后填入",
      link: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
      linkText: "如何生成 Confluence 个人访问令牌？",
    },
    parentPageId: { tip: "可选：将页面挂载到指定父页面下；不选择则作为顶层页面发布" },
    knowledgeSpace: { tip: "选择目标空间（Space），保存前会拉取账号可访问的空间列表" },
  },
  faq: [
    {
      q: "如何生成 Confluence 个人访问令牌（PAT）？",
      a: "登录 Confluence 后访问「个人访问令牌」页面（/plugins/personalaccesstokens/usertokens.action），点击创建令牌并复制。令牌只在创建时展示一次，请在插件中填入并保存。",
    },
    {
      q: "提示「请求 Confluence API 异常」怎么办？",
      a: "通常是令牌无效、地址不可达，或平台端文章已不存在。请确认「平台首页/API 地址」可达且令牌有效；若平台端文章已被手动删除，快速发布删除失败后可使用「强制删除」仅解除本地关联。",
    },
    {
      q: "发布后文章在哪里？",
      a: "发布到所选的「空间」下。未选父页面时为顶层页面；选择父页面后会挂载到该父页面下。可点「查看文章」打开页面地址。",
    },
    {
      q: "支持图片上传吗？",
      a: "支持。Confluence 使用平台自带附件能力上传图片，发布后图片以附件（ri:attachment）形式挂载到页面下，无需额外的图床。",
    },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "平台首页",
      content: "填写 Confluence 站点首页地址，例如 http://localhost:8090。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "填写 Confluence API 地址，修改首页后会自动同步。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='token']",
      title: "鉴权令牌",
      content: "填写从 Confluence「个人访问令牌」页面生成的 PAT。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "空间",
      content: "选择目标空间（Space），点击「验证」后会拉取账号可访问的空间列表。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图床服务",
      content: "默认使用当前平台（Confluence 自带附件）上传图片；也可选择 PicGo 等图床方案。",
      placement: "top",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "点击「验证」测试连通性并拉取空间列表，验证通过后再保存。",
      placement: "top",
    },
  ],
}
