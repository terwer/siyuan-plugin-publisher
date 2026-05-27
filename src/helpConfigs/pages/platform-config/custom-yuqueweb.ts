/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const yuquewebHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Yuqueweb",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "通过 Cookie 授权发布到语雀。无需会员即可使用，需要在浏览器中先登录语雀。",
  fields: {
    cookie: { tip: "自动从浏览器读取，也可手动粘贴。登录语雀后读取验证。" },
    knowledgeBase: { tip: "选择要发布到的语雀知识库" },
  },
  faq: [
    { q: "Cookie 读取失败？", a: "确认已在浏览器中登录语雀，点击「自动读取」重新获取。" },
    { q: "和 API 模式有什么区别？", a: "Cookie 模式无需专业会员，但依赖浏览器登录状态。" },
  ],
}