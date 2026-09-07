/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const yuquewebHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Yuqueweb",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "通过 Cookie 授权发布到语雀网页版。适合没有语雀专业会员但已在浏览器登录的账号。",
  fields: {
    cookie: { tip: "自动从浏览器读取，也可手动粘贴。登录语雀后读取验证。" },
    knowledgeSpace: { tip: "选择要发布到的语雀知识库。Cookie 模式允许根据当前登录账号读取可写知识库。" },
    previewUrl: { tip: "语雀网页版预览地址默认使用 /{login}/{bookSlug}/{slug}，通常保持默认。" },
    picbedService: { tip: "语雀网页版使用平台内置图片链路，优先使用默认 Bundled 图床。" },
  },
  faq: [
    { q: "Cookie 读取失败？", a: "确认已在浏览器中登录语雀，点击「自动读取」重新获取。" },
    { q: "和 API 模式有什么区别？", a: "Cookie 模式无需专业会员，但依赖浏览器登录状态；API 模式更稳定但受语雀会员策略限制。" },
    { q: "发布失败但配置能验证？", a: "优先检查目标知识库写入权限和 Cookie 是否过期，再重新读取 Cookie 后验证。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先在浏览器登录语雀，再自动读取 Cookie。Cookie 过期后需要重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "选择知识库",
      content: "验证后选择要发布到的知识库。若列表为空，先确认浏览器登录账号是否有写入权限。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "语雀网页版使用内置图片链路。没有特殊图床需求时保持默认即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "点击验证，确认 Cookie 和知识库读取都可用后再保存配置。",
      placement: "top",
    },
  ],
}