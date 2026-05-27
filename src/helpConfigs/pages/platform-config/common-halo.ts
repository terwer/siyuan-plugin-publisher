/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const haloHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Halo",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "发布到 Halo 2.x 博客系统。使用 Halo API 进行发布和管理。",
  fields: {
    apiUrl: { tip: "Halo 站点 API 地址，通常和首页地址相同，如 https://yourhalo.com" },
    token: {
      tip: "Halo 个人令牌，在 Halo 后台 → 用户管理 → 生成个人令牌",
      link: "https://siyuan.wiki/s/20230908183639-btcnnmj",
    },
  },
  faq: [
    { q: "Halo 版本要求？", a: "需要 Halo 2.0 及以上版本，不兼容 1.x。" },
    { q: "图片上传失败？", a: "确认 Halo 附件存储配置正确，磁盘空间充足。" },
  ],
}