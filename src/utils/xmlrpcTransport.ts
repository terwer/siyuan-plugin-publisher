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
  /** CORS 受限平台（如 Telegra.ph） */
  isCorsProxy?: boolean
  /**
   * 平台声明其 XML-RPC 可经**用户自备的跨域代理**发出。
   *
   * 独立于 {@link isCorsProxy}：后者是各平台既有的「走共享中间件」语义，
   * 本开关只对显式声明的平台生效，避免改变其他平台既有的通道选择。
   */
  isCorsXmlrpcProxy?: boolean
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
 * 1. **cors-proxy-fetch** — 平台**显式声明** `isCorsXmlrpcProxy` 且用户已配置跨域代理地址（用户自备、可直连）
 * 2. **electron-session-fetch** — 平台声明宿主会话直传且宿主具备该能力（用户未配代理时的通路）
 * 3. **middleware-fetch** — 其余 `isCorsProxy`（各平台既有语义，如 Telegra.ph，保持不变）
 * 4. **plugin-node-fetch** — 有插件直传能力时一律直连，禁止套思源 forwardProxy（Electron/V2、本地 WP、公网博客园均适用）
 * 5. **siyuan-forward-proxy** — 无直传能力且 `isUseSiyuanProxy || forceProxy` 时（loopback/私网目标也可：思源内核默认模式允许访问本机）
 * 6. **middleware-fetch** — 浏览器 + CORS 中间件回退（无代理条件时）
 *
 * 前两条是**声明式**的：只有显式声明的平台会命中，其余平台（含 Telegra.ph）的通道选择完全不变。
 * 二者构成互补的两条通路：**用户配了跨域代理就走代理**（无需额外网络条件），
 * **没配就走宿主会话直传**（需要能访问站点本身）。任一能力缺失都按后续优先级回退，不硬失败。
 *
 * SSRF 防护由内核 `SSRFSafeDialer` 兜底（`--safe-mode` 时内核拒绝 loopback/私网并返回错误）。
 */
function resolveXmlrpcTransport(ctx: XmlrpcTransportContext): XmlrpcTransport {
  if (ctx.isCorsXmlrpcProxy && ctx.hasCorsProxyUrl) {
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
  }  if (
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
