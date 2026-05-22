/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { isLoopbackOrLocalTargetUrl } from "~/src/utils/publishTransport/publishTargetUtil.ts"
import { shouldUseSiyuanForwardProxy } from "~/src/utils/publishTransport/resolveRules.ts"

type PublishTransportChannel = "plugin-node-fetch" | "siyuan-forward-proxy" | "middleware-fetch"

interface PublishTransportResolveContext {
  url: string
  forceProxy: boolean
  isInSiyuanOrSiyuanNewWin: boolean
  isUseSiyuanProxy: boolean
  canUsePluginFetch: boolean
}

/**
 * XML / multipart / JSON 共用的传输通道解析（plugin-first；loopback 禁 forwardProxy）。
 */
function resolvePublishTransport(ctx: PublishTransportResolveContext): PublishTransportChannel {
  if (ctx.canUsePluginFetch) {
    return "plugin-node-fetch"
  }
  if (isLoopbackOrLocalTargetUrl(ctx.url)) {
    return "middleware-fetch"
  }
  if (
    shouldUseSiyuanForwardProxy({
      url: ctx.url,
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
