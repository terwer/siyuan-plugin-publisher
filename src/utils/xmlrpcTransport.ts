/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { shouldUseSiyuanForwardProxy } from "~/src/utils/publishTransport/resolveRules.ts"
import { normalizeXmlrpcResponseText } from "~/src/utils/xmlrpcResponseUtil.ts"

/** MetaWeblog XML-RPC 传输通道（与 JSON `apiFetch`、multipart `FormUploadTransport` 解耦） */
type XmlrpcTransport = "plugin-node-fetch" | "siyuan-forward-proxy" | "middleware-fetch" | "electron-session-fetch"

interface XmlrpcTransportContext {
  /** 平台适配器要求强制代理（如 WordPress.com） */
  forceProxy: boolean
  /** 外链浏览器等场景经思源 API 存储 */
  isUseSiyuanProxy: boolean
  /** 插件宿主是否具备 win.require + bundled node-fetch */
  canUsePluginFetch: boolean
  /** CORS 受限平台要求强制走新 CORS 代理，优先级最高 */
  isCorsProxy?: boolean
  /**
   * 平台要求走宿主会话直传（Electron `session.fetch`，即 Chromium 网络栈）。
   * 适用于按客户端特征拒绝 Node fetch、但宿主内访问正常的站点。
   */
  isHostSessionFetch?: boolean
  /** 宿主是否具备宿主会话直传能力（非 Electron 宿主不具备） */
  canUseHostSessionFetch?: boolean
}

interface XmlrpcTransportRequest {
  url: string
  xmlBody: string
  forceProxy: boolean
}

interface XmlrpcTransportHandlers {
  pluginNodeFetch: (url: string, xmlBody: string) => Promise<unknown>
  siyuanForwardProxy: (url: string, xmlBody: string) => Promise<unknown>
  middlewareFetch: (url: string, xmlBody: string, forceProxy: boolean) => Promise<unknown>
  hostSessionFetch: (url: string, xmlBody: string) => Promise<unknown>
}

/**
 * MetaWeblog XML-RPC 传输选型。
 *
 * 优先级（与 {@link createFormUploadClient} 共用 publishTransport 规则）：
 * 1. **electron-session-fetch** — 平台声明走宿主会话直传且宿主具备该能力时（按客户端特征受限的站点）
 * 2. **middleware-fetch** — `isCorsProxy`（CORS 受限平台，如 Telegra.ph）
 * 3. **plugin-node-fetch** — 有插件直传能力时一律直连，禁止套思源 forwardProxy（Electron/V2、本地 WP、公网博客园均适用）
 * 4. **siyuan-forward-proxy** — 无直传能力且 `isUseSiyuanProxy || forceProxy` 时（loopback/私网目标也可：思源内核默认模式允许访问本机）
 * 5. **middleware-fetch** — 浏览器 + CORS 中间件回退（无代理条件时）
 *
 * 平台声明了宿主会话直传但宿主不具备该能力时，**不硬失败**，按后续优先级回退。
 *
 * SSRF 防护由内核 `SSRFSafeDialer` 兜底（`--safe-mode` 时内核拒绝 loopback/私网并返回错误）。
 */
function resolveXmlrpcTransport(ctx: XmlrpcTransportContext): XmlrpcTransport {
  if (ctx.isHostSessionFetch && ctx.canUseHostSessionFetch) {
    return "electron-session-fetch"
  }
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
      canUsePluginFetch: ctx.canUsePluginFetch,
    })
  ) {
    return "siyuan-forward-proxy"
  }
  return "middleware-fetch"
}

async function executeXmlrpcTransport(
  transport: XmlrpcTransport,
  handlers: XmlrpcTransportHandlers,
  request: XmlrpcTransportRequest
): Promise<string> {
  let raw: unknown
  switch (transport) {
    case "plugin-node-fetch":
      raw = await handlers.pluginNodeFetch(request.url, request.xmlBody)
      break
    case "siyuan-forward-proxy":
      raw = await handlers.siyuanForwardProxy(request.url, request.xmlBody)
      break
    case "middleware-fetch":
      raw = await handlers.middlewareFetch(request.url, request.xmlBody, request.forceProxy)
      break
    case "electron-session-fetch":
      raw = await handlers.hostSessionFetch(request.url, request.xmlBody)
      break
  }
  return normalizeXmlrpcResponseText(raw)
}

export type { XmlrpcTransport, XmlrpcTransportContext, XmlrpcTransportHandlers, XmlrpcTransportRequest }
export { resolveXmlrpcTransport, executeXmlrpcTransport }
