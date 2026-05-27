/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const preferenceGeneralHelpConfig: PageHelpConfig = {
  pageId: "preference-general",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "全局偏好设置，影响所有平台的发布行为。",
  fields: {
    showDocQuickMenu: { tip: "开启后在思源文档菜单中显示快速发布入口" },
    useV2UI: { tip: "使用新版 V2 界面，体验更流畅的发布流程" },
  },
}