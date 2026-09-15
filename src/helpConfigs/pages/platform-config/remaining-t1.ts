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
 * 原先在此登记的平台已全部拆分为独立 help 配置（含 fields/faq/tour），
 * 本数组现为空。保留为「尚未拆分平台」的登记点：后续新增/待补平台继续按
 * `{ pageId, helpUrl }` 追加即可，registry 会优先命中独立配置。
 */
export const remainingT1HelpConfigs: PageHelpConfig[] = [
  // 已全部拆分（见 pages/platform-config/ 下同名文件）：
  // github_Vitepress / github_Astro
  // gitlab_Gitlabhexo / gitlab_Gitlabhugo / gitlab_Gitlabjekyll / gitlab_Gitlabvuepress
  //   / gitlab_Gitlabvuepress2 / gitlab_Gitlabvitepress / gitlab_Gitlabastro
  // metaweblog_Typecho / metaweblog_Jvue / metaweblog_Metaweblog
  // wordpress_Wordpressdotcom
]
