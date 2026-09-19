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
type XmlrpcTransport =
  | "plugin-node-fetch"
  | "siyuan-forward-proxy"
  | "middleware-fetch"
  | "electron-session-fetch"
  | "cors-proxy-fetch"

interface XmlrpcTransportContext {
  /** 平台适配器要求强制代理（如 WordPress.com） */
  forceProxy: boolean
  /** 外链浏览器等场景经思源 API 存储 */
  isUseSiyuanProxy: boolean
  /** 插件宿主是否具备 win.require + bundled node-fetch */
  canUsePluginFetch: boolean
  /** CORS 受限平台（如 Telegra.ph）；与 isHostSessionFetch 构成一对处境开关 */
  isCorsProxy?: boolean
  /**
   * 用户已配置跨域代理地址。
   *
   * 配置后即走该代理，**与是否具备宿主会话直传无关**：跨域代理服务本身可直连，
   * 不需要额外网络条件；地址由用户自备（不内置共享地址）。
   */
  hasCorsProxyUrl?: boolean
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
  corsProxyFetch: (url: string, xmlBody: string) => Promise<unknown>
}

/**
 * MetaWeblog XML-RPC 传输选型。
 *
 * 优先级（与 {@link createFormUploadClient} 共用 publishTransport 规则）：
 * 1. **cors-proxy-fetch** — 平台声明 CORS 受限**且用户已配置跨域代理地址**（经用户自备代理转发）
 * 2. **electron-session-fetch** — 平台声明宿主会话直传且宿主具备该能力（经宿主自身的网络栈直连）
 * 3. **middleware-fetch** — 其余 `isCorsProxy`（未配代理地址时的既有行为）
 * 4. **plugin-node-fetch** — 有插件直传能力时一律直连，禁止套思源 forwardProxy（Electron/V2、本地 WP、公网博客园均适用）
 * 5. **siyuan-forward-proxy** — 无直传能力且 `isUseSiyuanProxy || forceProxy` 时（loopback/私网目标也可：思源内核默认模式允许访问本机）
 * 6. **middleware-fetch** — 浏览器 + CORS 中间件回退（无代理条件时）
 *
 * 前两条分别对应两个**互相独立**的平台声明，各自表达一件事，不互相绑定：
 * - `isCorsProxy` 表达「CORS 受限，需经用户自备的跨域代理」（与 JSON / multipart 侧同义）
 * - `isHostSessionFetch` 表达「经宿主自身的网络栈直连」（是否需要额外网络条件因平台而异）
 *
 * 因此某平台是否"需要额外网络条件"、是否"要走代理"，完全由它自己声明哪一项决定，
 * 不存在「开了 A 就一定 B」的隐含关系。任一能力缺失都按后续优先级回退，不硬失败。
 *
 * SSRF 防护由内核 `SSRFSafeDialer` 兜底（`--safe-mode` 时内核拒绝 loopback/私网并返回错误）。
 */
function resolveXmlrpcTransport(ctx: XmlrpcTransportContext): XmlrpcTransport {
  if (ctx.isCorsProxy && ctx.hasCorsProxyUrl) {
    return "cors-proxy-fetch"
  }
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
    case "cors-proxy-fetch":
      raw = await handlers.corsProxyFetch(request.url, request.xmlBody)
      break
  }
  return normalizeXmlrpcResponseText(raw)
}

export type { XmlrpcTransport, XmlrpcTransportContext, XmlrpcTransportHandlers, XmlrpcTransportRequest }
export { resolveXmlrpcTransport, executeXmlrpcTransport }
