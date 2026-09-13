/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const yuquewebHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Yuqueweb",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "通过 Cookie 授权发布到语雀网页版，无需语雀专业会员，使用浏览器登录态即可发布。",
  fields: {
    home: { tip: "语雀网页版站点地址，固定为 https://www.yuque.com，通常无需修改。" },
    apiUrl: { tip: "语雀网页版接口地址，与站点地址一致，通常无需修改。" },
    password: {
      tip:
        "Cookie 授权：点「去登录」登录语雀，关闭登录窗口保存登录态后点「自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。Cookie 过期后重新读取。",
    },
    previewUrl: {
      tip: "查看文章链接模板，支持 {login}、{bookSlug}、{slug} 占位符，默认 /{login}/{bookSlug}/{slug}，通常保持默认。",
    },
    pageType: { tip: "正文提交格式，语雀网页版按 Markdown 提交正文，保持默认的 Markdown。" },
    blogid: { tip: "要发布到的语雀知识库；验证通过后会读取当前登录账号可写的知识库列表。" },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片作为语雀附件上传；也可选「不使用」按原图地址引用（需公网可访问）。" +
        "语雀网页版不支持 PicGo。",
    },
  },
  faq: [
    { q: "Cookie 读取失败？", a: "确认已登录语雀，关闭登录窗口后点「自动读取 Cookie」重新获取。" },
    { q: "和 API 模式有什么区别？", a: "Cookie 模式无需专业会员，但依赖浏览器登录状态；API 模式更稳定但受语雀会员策略限制。" },
    { q: "发布失败但配置能验证？", a: "优先检查目标知识库写入权限和 Cookie 是否过期，再重新读取 Cookie 后验证。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "点「去登录」登录语雀，关闭登录窗口保存登录态，再点「自动读取 Cookie」。Cookie 过期后需要重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "选择知识库",
      content: "验证后选择要发布到的知识库。若列表为空，先确认登录账号是否有写入权限。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "图片默认上传到语雀附件（当前平台）。没有特殊图床需求时保持默认即可。",
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
