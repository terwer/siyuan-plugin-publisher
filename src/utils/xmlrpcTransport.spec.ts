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
      },
      { url: publicUrl, xmlBody: "<xml/>", forceProxy: false }
    )
    expect(pluginNodeFetch).toHaveBeenCalled()
    expect(text).toContain("methodResponse")
  })
})
