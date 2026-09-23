/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 文档站点地址 —— 切换域名只改这一个文件。
 *
 * 站点的部署配置是 `docs/.vitepress/site.mts`，这里保留同一份取值供插件运行时使用：
 * 插件不能 import 站点侧的构建期模块，因此两处取值需要保持一致。
 * 换域名时同时改这两个文件的 `SITE_ORIGIN` / `SITE_BASE` 即可。
 */

/** 站点根地址，末尾不带斜杠 */
export const SITE_ORIGIN = "https://terwer.github.io"

/** 站点子路径；自有域名填 `/` */
export const SITE_BASE = "/siyuan-plugin-publisher/"

/** 站点首页 */
export function siteHome(): string {
  const base = SITE_BASE.endsWith("/") ? SITE_BASE : `${SITE_BASE}/`
  return `${SITE_ORIGIN}${base}`
}

/** 拼接站点内的任意路径 */
export function siteUrl(path = "/"): string {
  const rel = path.startsWith("/") ? path.slice(1) : path
  return `${siteHome()}${rel}`
}

/** 某个平台的配置指南地址（对应 docs/platforms/<slug>.md） */
export function platformDocUrl(slug: string): string {
  return siteUrl(`platforms/${slug}`)
}