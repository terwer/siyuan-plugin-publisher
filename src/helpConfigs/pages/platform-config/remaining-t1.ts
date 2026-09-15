/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

/**
 * 剩余 T1 平台帮助配置（仅 helpUrl，field/tour 按需追加）
 *
 * 这些平台先提供基本的 helpUrl 指向文档，字段提示与引导步骤按需补充。
 * 后续各平台可单独拆分为独立文件，扩展 field/tour/faq。
 */
export const remainingT1HelpConfigs: PageHelpConfig[] = [
  // === Github ===
  // github_Hugo / github_Jekyll / github_Quartz / github_Vuepress / github_Vuepress2 / github_Vitepress
  // / github_Astro 已拆分为独立 help 配置

  // === Gitlab ===
  // gitlab_Gitlabhexo / gitlab_Gitlabhugo / gitlab_Gitlabjekyll / gitlab_Gitlabvuepress
  // / gitlab_Gitlabvuepress2 / gitlab_Gitlabvitepress / gitlab_Gitlabastro 已拆分为独立 help 配置

  // === Metaweblog ===
  { pageId: "platform-config/metaweblog_Typecho", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/metaweblog_Jvue", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/metaweblog_Metaweblog", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },

  // === Wordpress ===
  { pageId: "platform-config/wordpress_Wordpressdotcom", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
]
