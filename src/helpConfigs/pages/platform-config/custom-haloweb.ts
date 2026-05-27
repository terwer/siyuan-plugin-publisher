/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const halowebHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Haloweb",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "通过 Cookie 授权发布到 Halo 2.20+。需要在站点地址中填写你的 Halo 博客首页 URL。",
  fields: {
    home: {
      tip: "你的 Halo 2.20+ 博客首页地址。填写完整 URL 后，登录和 Cookie 读取将自动解析到正确的地址。",
    },
    apiUrl: { tip: "通常和首页地址相同" },
  },
  faq: [
    { q: "提示「Invalid URL」？", a: "先填写站点地址（完整 URL），再点击登录或读取 Cookie。" },
    { q: "Halo 版本要求？", a: "需要 Halo 2.20 及以上版本。" },
  ],
}