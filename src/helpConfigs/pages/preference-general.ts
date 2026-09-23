/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { siteUrl } from "~/src/utils/site"

export const preferenceGeneralHelpConfig: PageHelpConfig = {
  pageId: "preference-general",
  helpUrl: siteUrl("guide/settings"),
  summary: "全局偏好设置，影响所有平台的发布行为。",
  fields: {
    showDocQuickMenu: { tip: "开启后在思源文档菜单中显示快速发布入口" },
  },
}