/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { siteUrl } from "~/src/utils/site"

/**
 * 平台配置页通用帮助（兜底）
 *
 * 当某个平台没有专属帮助配置时，显示此通用内容。
 */
export const platformConfigDefaultHelpConfig: PageHelpConfig = {
  pageId: "platform-config/_default",
  helpUrl: siteUrl("platforms/"),
  summary: "填写平台 API 认证信息，验证通过后即可发布。不同平台需要的字段不同，请参考具体平台文档。",
  fields: {
    home: { tip: "平台首页地址，用于预览已发布的文章链接" },
    apiUrl: { tip: "API 接口地址，通常是平台的开放 API URL" },
    username: { tip: "平台登录用户名" },
    // 鉴权行三种分支（密码 / Token / Cookie）都绑同一个配置属性 password，故此处只有一个键
    password: { tip: "平台鉴权口令，按平台要求填密码、Token 或 Cookie（不是登录密码）" },
  },
  faq: [
    {
      q: "发布格式该选 Markdown 还是 HTML？",
      a: "按平台要求选：博客园用 Markdown；知乎、CSDN 目前只能选 HTML。选错常表现为标题被替换或发布异常。",
    },
    {
      q: "图片要选哪种图床？",
      a: "平台自带图片服务（知乎、CSDN、微信公众号）选「当前平台」；静态博客（GitHub/GitLab 系）与 Notion、语雀、掘金需要配置图床；MetaWeblog 系（博客园、Typecho、WordPress）两者都支持，配了图床优先用图床。",
    },
    {
      q: "Cookie 授权类平台怎么配置？",
      a: "按顺序：① 点「去登录」并用平台账号登录；② 关闭登录窗口（此步才会保存登录态）；③ 点「自动读取 Cookie」；④ 检查并补齐其他必填字段；⑤ 点「验证」。顺序颠倒或跳过关闭窗口这一步，会导致读不到 Cookie。",
    },
  ],
}