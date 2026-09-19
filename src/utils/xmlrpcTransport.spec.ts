/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { executeXmlrpcTransport, resolveXmlrpcTransport } from "~/src/utils/xmlrpcTransport.ts"

const publicUrl = "https://rpc.cnblogs.com/metaweblog/"
const xml = `<?xml version="1.0"?><methodResponse></methodResponse>`

describe("resolveXmlrpcTransport", () => {
  it("prefers the user-provided CORS proxy when the platform declares CORS and an address is set", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isCorsProxy: true,
        hasCorsProxyUrl: true,
        isHostSessionFetch: true,
        canUseHostSessionFetch: true,
      })
    ).toBe("cors-proxy-fetch")
  })

  it("uses the CORS proxy for a CORS-only platform when an address is set", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isCorsProxy: true,
        hasCorsProxyUrl: true,
        canUseHostSessionFetch: true,
      })
    ).toBe("cors-proxy-fetch")
  })

  it("falls back to the host session channel when no CORS proxy address is configured", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isCorsProxy: true,
        hasCorsProxyUrl: false,
        isHostSessionFetch: true,
        canUseHostSessionFetch: true,
      })
    ).toBe("electron-session-fetch")
  })

  it("keeps a CORS platform on its existing channel when no address is configured", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isCorsProxy: true,
        hasCorsProxyUrl: false,
        canUseHostSessionFetch: true,
      })
    ).toBe("middleware-fetch")
  })

  it("prefers the host session channel when the platform declares it and the host supports it", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isHostSessionFetch: true,
        canUseHostSessionFetch: true,
      })
    ).toBe("electron-session-fetch")
  })

  it("falls back to the existing channel when the host lacks the host session capability", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isHostSessionFetch: true,
        canUseHostSessionFetch: false,
      })
    ).toBe("plugin-node-fetch")
  })

  it("does not change other platforms when the host session channel is not declared", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        canUseHostSessionFetch: true,
      })
    ).toBe("plugin-node-fetch")
  })

  it("keeps CORS-restricted platforms on the middleware channel", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: true,
        isCorsProxy: true,
        canUseHostSessionFetch: true,
      })
    ).toBe("middleware-fetch")
  })

  it("prefers plugin-node-fetch when plugin can direct fetch", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: true,
        isUseSiyuanProxy: true,
        canUsePluginFetch: true,
      })
    ).toBe("plugin-node-fetch")
  })

  it("uses forward-proxy outside plugin when proxy flags set", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: true,
        canUsePluginFetch: false,
      })
    ).toBe("siyuan-forward-proxy")
  })

  it("uses forward-proxy for loopback targets when proxy flags set", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: true,
        isUseSiyuanProxy: true,
        canUsePluginFetch: false,
      })
    ).toBe("siyuan-forward-proxy")
  })

  it("falls back to middleware-fetch for loopback without proxy flags", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: false,
      })
    ).toBe("middleware-fetch")
  })

  it("falls back to middleware-fetch in plain browser without proxy flags", () => {
    expect(
      resolveXmlrpcTransport({
        forceProxy: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: false,
      })
    ).toBe("middleware-fetch")
  })
})

describe("executeXmlrpcTransport", () => {
  it("always returns normalized XML text", async () => {
    const pluginNodeFetch = vi.fn(async () => xml)
    const text = await executeXmlrpcTransport(
      "plugin-node-fetch",
      {
        pluginNodeFetch,
        siyuanForwardProxy: vi.fn(),
        middlewareFetch: vi.fn(),
        hostSessionFetch: vi.fn(),
        corsProxyFetch: vi.fn(),
      },
      { url: publicUrl, xmlBody: "<xml/>", forceProxy: false }
    )
    expect(pluginNodeFetch).toHaveBeenCalled()
    expect(text).toContain("methodResponse")
  })

  it("routes through the host session channel when selected", async () => {
    const hostSessionFetch = vi.fn(async () => xml)
    const text = await executeXmlrpcTransport(
      "electron-session-fetch",
      {
        pluginNodeFetch: vi.fn(),
        siyuanForwardProxy: vi.fn(),
        middlewareFetch: vi.fn(),
        hostSessionFetch,
        corsProxyFetch: vi.fn(),
      },
      { url: publicUrl, xmlBody: "<xml/>", forceProxy: false }
    )
    expect(hostSessionFetch).toHaveBeenCalled()
    expect(text).toContain("methodResponse")
  })

  it("routes through the user-provided CORS proxy when selected", async () => {
    const corsProxyFetch = vi.fn(async () => xml)
    const text = await executeXmlrpcTransport(
      "cors-proxy-fetch",
      {
        pluginNodeFetch: vi.fn(),
        siyuanForwardProxy: vi.fn(),
        middlewareFetch: vi.fn(),
        hostSessionFetch: vi.fn(),
        corsProxyFetch,
      },
      { url: publicUrl, xmlBody: "<xml/>", forceProxy: false }
    )
    expect(corsProxyFetch).toHaveBeenCalled()
    expect(text).toContain("methodResponse")
  })
})
