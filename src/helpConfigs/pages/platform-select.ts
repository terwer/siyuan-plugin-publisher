/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { siteUrl } from "~/src/utils/site"

export const platformSelectHelpConfig: PageHelpConfig = {
  pageId: "platform-select",
  helpUrl: siteUrl("guide/settings"),
  summary: "选择要配置的发布平台。支持 API 授权、网页 Cookie 授权、文件系统和静态站点等多种类型。",
}