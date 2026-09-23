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
  faq: [
    {
      q: "为什么我在平台上改的正文，下次发布后被覆盖了？",
      a: "发布工具每次都会获取思源里最新编辑的正文进行覆盖发布。因此请在思源里改，不要在平台上直接改正文——平台上的改动会在下次发布时被覆盖。",
    },
    {
      q: "配置异常导致插件完全用不了，怎么恢复？",
      a: "备份并删除 [工作空间]/data/storage/syp/sy-p-plus-cfg.json，该文件会在首次使用时自动重新初始化。建议先关闭思源再操作，避免运行中已读取旧数据又覆盖回去。注意：这会清掉全部平台账号配置，能用的情况下请勿执行。",
    },
  ],
}