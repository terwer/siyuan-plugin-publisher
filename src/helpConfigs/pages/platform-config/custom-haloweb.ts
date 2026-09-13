/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const halowebHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Haloweb",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "通过 Cookie 授权发布到 Halo 2.20+。需要在站点地址中填写你的 Halo 博客首页 URL，登录后读取 Cookie 即可发布。",
  fields: {
    home: {
      tip: "你的 Halo 2.20+ 博客首页地址。填写完整 URL（如 https://yourhalo.com）后，登录和 Cookie 读取将自动解析到正确的地址。",
    },
    apiUrl: { tip: "通常和首页地址相同。除非你的 Halo 后台使用了独立域名，否则保持默认。" },
    password: {
      tip:
        "Cookie 授权：点「1 去登录」登录 Halo 后台，关闭登录窗口保存登录态后点「2 自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。Cookie 过期或切换账号后需要重新读取。",
    },
    previewUrl: {
      tip: "查看文章链接模板，默认 /archives/{slug}，与 Halo 的文章固定链接一致，通常保持默认。",
    },
    pageType: { tip: "Halo 网页版默认使用 HTML 发布，通常保持默认。" },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片作为 Halo 附件上传；也可选「不使用」按原图地址引用（需公网可访问），" +
        "或选「PicGo 强烈推荐」改用你配置的 PicGo。",
    },
  },
  faq: [
    { q: "提示「Invalid URL」？", a: "先填写站点地址（完整 URL），再点击登录或读取 Cookie。" },
    { q: "Halo 版本要求？", a: "需要 Halo 2.20 及以上版本。" },
    { q: "Cookie 验证失败？", a: "确认浏览器已登录 Halo 后台，或重新读取 Cookie。登录状态失效后接口会返回登录页，表现为配置验证异常。" },
    { q: "图片该选什么图床？", a: "Halo 网页版使用平台内置图片链路，默认 Bundled 即可。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "站点首页",
      content: "填写 Halo 2.20+ 博客首页完整地址。登录和 Cookie 读取会基于这个地址自动解析。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "通常和首页地址相同，无需修改。只有后台使用独立域名时才需要单独填写。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先登录 Halo 后台，再读取 Cookie。切换账号或登录过期后需要重新读取验证。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "Halo 网页版使用平台内置图片上传，保持 Bundled 配置即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "点击验证，确认站点地址、Cookie 和分类读取都可用后再保存配置。",
      placement: "top",
    },
  ],
}