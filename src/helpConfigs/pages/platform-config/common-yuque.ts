/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const yuqueHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Yuque",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "发布到语雀知识库。需要语雀专业会员才能使用 API 发布。",
  fields: {
    home: { tip: "你的语雀主页地址，如 https://www.yuque.com/yourname" },
    token: {
      tip: "语雀 API Token，在语雀设置 → 访问令牌中生成",
      link: "https://www.yuque.com/settings/tokens",
      linkText: "前往生成 Token",
    },
  },
  faq: [
    { q: "提示「权限不足」？", a: "语雀 API 发布需要专业会员。免费版可尝试语雀网页版（Cookie 模式）。" },
    { q: "知识库选择为空？", a: "确认 Token 正确生成，且账号下有可写的知识库。" },
  ],
}