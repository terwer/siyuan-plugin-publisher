/**
 * 文档站点的部署配置 —— 切换域名只改这一个文件。
 *
 * 使用方式：
 *   - GitHub Pages 默认：`SITE_ORIGIN` 保持默认即可，`SITE_BASE` 与仓库名一致；
 *   - 绑定自有域名：改 `SITE_ORIGIN`，并把 `SITE_BASE` 设为 `/`；
 *   - 本地预览：`pnpm docs:dev`（base 会被忽略，路径自动适配）。
 *
 * 插件内的「查看完整帮助文档」链接、sitemap 与站点 canonical 都由这里推导，
 * 因此换域名不需要再去改 35 篇平台帮助配置。
 */

/** 站点根地址，末尾不带斜杠 */
export const SITE_ORIGIN = "https://terwer.github.io"

/** 站点子路径，GitHub Pages 项目页为 `/<repo>/`；自有域名填 `/` */
export const SITE_BASE = "/siyuan-plugin-publisher/"

/** 仓库地址 */
export const REPO_URL = "https://github.com/terwer/siyuan-plugin-publisher"

/** 拼接完整站点地址（供 sitemap / canonical / 文档内绝对链接使用） */
export function siteUrl(path = "/"): string {
  const base = SITE_BASE.endsWith("/") ? SITE_BASE : `${SITE_BASE}/`
  const rel = path.startsWith("/") ? path.slice(1) : path
  return `${SITE_ORIGIN}${base}${rel}`
}

/** 站点部署后的根地址（带末尾斜杠） */
export const SITE_HOME = siteUrl("/")