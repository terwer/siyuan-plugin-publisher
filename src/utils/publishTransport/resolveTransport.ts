/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { shouldUseSiyuanForwardProxy } from "~/src/utils/publishTransport/resolveRules.ts"

type PublishTransportChannel = "plugin-node-fetch" | "siyuan-forward-proxy" | "middleware-fetch"

interface PublishTransportResolveContext {
  forceProxy: boolean
  isInSiyuanOrSiyuanNewWin: boolean
  isUseSiyuanProxy: boolean
  canUsePluginFetch: boolean
  /**
   * 平台要求强制走新 CORS 代理（CORS 受限平台，如 Telegra.ph）。
   * true 时优先级最高，绕过 plugin-node-fetch / siyuan-forward-proxy，一律走 middleware-fetch。
   */
  isCorsProxy?: boolean
}

/**
 * XML / multipart / JSON 共用的传输通道解析。
 *
 * 优先级（isCorsProxy 最高，用于 CORS 受限平台）：
 * 1. **middleware-fetch** — `isCorsProxy` 为 true（CORS 代理直连远端，不可达域名也必须走代理）
 * 2. **plugin-node-fetch** — 有插件直传能力时直连
 * 3. **siyuan-forward-proxy** — `isUseSiyuanProxy || forceProxy`（loopback/私网目标也可，内核默认模式允许访问本机）
 * 4. **middleware-fetch** — 无代理条件回退
 */
function resolvePublishTransport(ctx: PublishTransportResolveContext): PublishTransportChannel {
  if (ctx.isCorsProxy) {
    return "middleware-fetch"
  }
  if (ctx.canUsePluginFetch) {
    return "plugin-node-fetch"
  }
  if (
    shouldUseSiyuanForwardProxy({
      forceProxy: ctx.forceProxy,
      isUseSiyuanProxy: ctx.isUseSiyuanProxy,
      canUsePluginFetch: false,
    })
  ) {
    return "siyuan-forward-proxy"
  }
  return "middleware-fetch"
}

export type { PublishTransportChannel, PublishTransportResolveContext }
export { resolvePublishTransport }
