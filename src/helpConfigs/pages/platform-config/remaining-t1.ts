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
 * 这些平台已进入 V2 Bridge，只需要基本的 helpUrl 指向文档。
 * 后续各平台可单独拆分为独立文件，扩展 field/tour/faq。
 */
export const remainingT1HelpConfigs: PageHelpConfig[] = [
  // === Github ===
  // github_Hugo 已拆分为独立 help 配置 github-hugo.ts
  { pageId: "platform-config/github_Jekyll", helpUrl: "https://siyuan.wiki/s/20230908183451-fjs2nr0" },
  { pageId: "platform-config/github_Quartz", helpUrl: "https://siyuan.wiki/s/20230908182140-8riar0r" },
  { pageId: "platform-config/github_Vuepress", helpUrl: "https://siyuan.wiki/s/20230908183534-29f49bz" },
  { pageId: "platform-config/github_Vuepress2", helpUrl: "https://siyuan.wiki/s/20230908183739-2x156oj" },
  { pageId: "platform-config/github_Vitepress", helpUrl: "https://siyuan.wiki/s/20230914173253-mx2gaxd" },
  { pageId: "platform-config/github_Astro", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },

  // === Gitlab ===
  { pageId: "platform-config/gitlab_Gitlabhexo", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/gitlab_Gitlabhugo", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/gitlab_Gitlabjekyll", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/gitlab_Gitlabvuepress", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/gitlab_Gitlabvuepress2", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/gitlab_Gitlabvitepress", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/gitlab_Gitlabastro", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },

  // === Metaweblog ===
  { pageId: "platform-config/metaweblog_Typecho", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/metaweblog_Jvue", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },
  { pageId: "platform-config/metaweblog_Metaweblog", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },

  // === Wordpress ===
  { pageId: "platform-config/wordpress_Wordpressdotcom", helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0" },

  // === Custom V2 Bridge ===
  // custom_Bilibili 已拆分为独立 help 配置 custom-bilibili.ts
]
