/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 图片读取通道判定（所有发布平台共用）。
 *
 * 浏览器宿主（例如浏览器访问 Docker/远程部署的思源）里，页面自身的 `fetch`
 * 会携带当前登录会话；把同源图片地址交给思源内核 `forwardProxy` 代为请求，
 * 内层请求不带浏览器会话 Cookie，思源开启「访问授权码」时会返回
 * `{"code":-1,"msg":"Auth failed [session]"}`。
 *
 * 因此同源图片一律由页面直接读取，跨源图片才继续走发布传输层。
 */

function resolvePageHref(pageHref?: string): string | undefined {
  if (pageHref) {
    return pageHref
  }
  if (typeof window === "undefined") {
    return undefined
  }
  return window.location?.href || undefined
}

/**
 * 目标地址是否与当前页面同源（相对地址按当前页面解析）。
 *
 * @param url - 图片地址，可为相对地址
 * @param pageHref - 当前页面地址，缺省取 `window.location.href`（便于单测注入）
 */
export function isSameOriginWithPage(url: string, pageHref?: string): boolean {
  const base = resolvePageHref(pageHref)
  if (!url || !base) {
    return false
  }

  try {
    return new URL(url, base).origin === new URL(base).origin
  } catch {
    return false
  }
}

/**
 * 读取思源本地图片时是否由页面直接读取。
 *
 * - 桌面端思源（主窗口/挂件/新窗口）沿用既有直读逻辑；
 * - 浏览器宿主里，与页面同源的图片由页面直读，保留浏览器登录态。
 */
export function shouldReadImageDirectly(
  url: string,
  options: { inSiyuanDesktop: boolean; pageHref?: string }
): boolean {
  if (options.inSiyuanDesktop) {
    return true
  }
  return isSameOriginWithPage(url, options.pageHref)
}
