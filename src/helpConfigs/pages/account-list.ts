/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { siteUrl } from "~/src/utils/site"

export const accountListHelpConfig: PageHelpConfig = {
  pageId: "account-list",
  helpUrl: siteUrl("guide/settings"),
  summary: "管理已添加的平台账号。可以查看、编辑验证状态，或删除不需要的账号。",
}