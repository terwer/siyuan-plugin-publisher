/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

interface PluginFirstProxyContext {
  forceProxy: boolean
  isUseSiyuanProxy: boolean
  canUsePluginFetch: boolean
}

/**
 * 是否可走思源 forwardProxy（插件直传优先）。
 *
 * loopback/私网目标不再绝对禁止：思源内核 3.7.3 默认模式（非 `--safe-mode`）
 * 下 forwardProxy 允许访问本机服务（SSRF 防护由内核 `SSRFSafeDialer` 兜底，
 * SafeMode 时内核拒绝并返回错误）。middleware-fetch 是远端 CORS 代理，无法访问
 * localhost/私网目标，故有代理条件时应优先 forwardProxy。
 */
export function shouldUseSiyuanForwardProxy(ctx: PluginFirstProxyContext): boolean {
  if (ctx.canUsePluginFetch) {
    return false
  }
  return ctx.isUseSiyuanProxy || ctx.forceProxy
}
