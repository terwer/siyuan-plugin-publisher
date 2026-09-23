/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { siteUrl } from "~/src/utils/site"

/**
 * 全局兜底帮助配置
 *
 * 当 pageId 无专属配置时使用。
 * 指向通用帮助文档索引。
 */
export const DEFAULT_PAGE_HELP_CONFIG: PageHelpConfig = {
  pageId: "_default",
  helpUrl: siteUrl("guide/usage"),
  summary: "Publisher 发布工具帮助文档。查看完整文档获取详细使用说明。",
}