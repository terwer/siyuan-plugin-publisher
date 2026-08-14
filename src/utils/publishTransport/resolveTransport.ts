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
}

/**
 * XML / multipart / JSON 共用的传输通道解析（plugin-first）。
 *
 * loopback/私网目标在有代理条件（`isUseSiyuanProxy || forceProxy`）时走
 * `siyuan-forward-proxy`：思源内核默认模式允许 forwardProxy 访问本机服务，
 * 而 middleware-fetch 是远端 CORS 代理，无法访问 localhost/私网目标。
 * 无代理条件时回退 `middleware-fetch`。
 */
function resolvePublishTransport(ctx: PublishTransportResolveContext): PublishTransportChannel {
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
