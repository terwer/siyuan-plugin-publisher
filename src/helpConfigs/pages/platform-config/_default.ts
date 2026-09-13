/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

/**
 * 平台配置页通用帮助（兜底）
 *
 * 当某个平台没有专属帮助配置时，显示此通用内容。
 */
export const platformConfigDefaultHelpConfig: PageHelpConfig = {
  pageId: "platform-config/_default",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "填写平台 API 认证信息，验证通过后即可发布。不同平台需要的字段不同，请参考具体平台文档。",
  fields: {
    home: { tip: "平台首页地址，用于预览已发布的文章链接" },
    apiUrl: { tip: "API 接口地址，通常是平台的开放 API URL" },
    username: { tip: "平台登录用户名" },
    // 鉴权行三种分支（密码 / Token / Cookie）都绑同一个配置属性 password，故此处只有一个键
    password: { tip: "平台鉴权口令，按平台要求填密码、Token 或 Cookie（不是登录密码）" },
  },
}