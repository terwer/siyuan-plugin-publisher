/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { isLoopbackOrLocalTargetUrl } from "~/src/utils/publishTransport/publishTargetUtil.ts"

interface PluginFirstProxyContext {
  url: string
  forceProxy: boolean
  isUseSiyuanProxy: boolean
  canUsePluginFetch: boolean
}

/**
 * 是否可走思源 forwardProxy（插件直传优先；loopback/私网禁止）。
 */
export function shouldUseSiyuanForwardProxy(ctx: PluginFirstProxyContext): boolean {
  if (ctx.canUsePluginFetch) {
    return false
  }
  if (isLoopbackOrLocalTargetUrl(ctx.url)) {
    return false
  }
  return ctx.isUseSiyuanProxy || ctx.forceProxy
}

export { isLoopbackOrLocalTargetUrl }
