/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import FormDataHostUtil from "~/src/utils/FormDataHostUtil.ts"
import {
  createFormUploadClient,
  formUploadTransportTestExports,
} from "~/src/utils/formUploadClient.ts"

const { resolveFormUploadTransport } = formUploadTransportTestExports

const publicUrl = "https://upload.example.com/api"
const localUrl = "http://127.0.0.1:8090/upload"

const baseResolveCtx = {
  url: publicUrl,
  forceProxy: false,
  isInSiyuanOrSiyuanNewWin: true,
  isUseSiyuanProxy: true,
}

describe("resolveFormUploadTransport", () => {
  it("plugin fetch is always first priority even with forceProxy", () => {
    expect(
      resolveFormUploadTransport({
        ...baseResolveCtx,
        forceProxy: true,
        canUsePluginFetch: true,
      })
    ).toBe("plugin-node-fetch")
  })

  it("plugin fetch wins over middleware intent (no useCors override)", () => {
    expect(
      resolveFormUploadTransport({
        ...baseResolveCtx,
        forceProxy: true,
        isInSiyuanOrSiyuanNewWin: false,
        canUsePluginFetch: true,
      })
    ).toBe("plugin-node-fetch")
  })

  it("never uses forwardProxy for loopback without plugin", () => {
    expect(
      resolveFormUploadTransport({
        url: localUrl,
        forceProxy: true,
        isInSiyuanOrSiyuanNewWin: false,
        isUseSiyuanProxy: true,
        canUsePluginFetch: false,
      })
    ).toBe("middleware-fetch")
  })

  it("loopback without plugin does not return plugin-node-fetch", () => {
    const transport = resolveFormUploadTransport({
      url: localUrl,
      forceProxy: false,
      isInSiyuanOrSiyuanNewWin: true,
      isUseSiyuanProxy: false,
      canUsePluginFetch: false,
    })
    expect(transport).not.toBe("plugin-node-fetch")
    expect(transport).toBe("middleware-fetch")
  })

  it("uses forwardProxy for public host without plugin when proxy flags set", () => {
    expect(
      resolveFormUploadTransport({
        url: publicUrl,
        forceProxy: true,
        isInSiyuanOrSiyuanNewWin: false,
        isUseSiyuanProxy: false,
        canUsePluginFetch: false,
      })
    ).toBe("siyuan-forward-proxy")
  })

  it("uses middleware-fetch in siyuan without plugin and without proxy flags", () => {
    expect(
      resolveFormUploadTransport({
        url: publicUrl,
        forceProxy: false,
        isInSiyuanOrSiyuanNewWin: true,
        isUseSiyuanProxy: false,
        canUsePluginFetch: false,
      })
    ).toBe("middleware-fetch")
  })
})

describe("createFormUploadClient", () => {
  const getFormDataFetchSpy = vi.spyOn(FormDataHostUtil, "getFormDataFetch")

  beforeEach(() => {
    getFormDataFetchSpy.mockReset()
    getFormDataFetchSpy.mockReturnValue(
      vi.fn(async () => '{"ok":true}') as ReturnType<typeof FormDataHostUtil.getFormDataFetch>
    )
  })

  afterEach(() => {
    getFormDataFetchSpy.mockRestore()
  })

  it("lazy-loads getFormDataFetch only for plugin-node-fetch", async () => {
    const appInstance = {
      moduleBase: "/plugins/siyuan-plugin-publisher/",
      win: { require: vi.fn(() => vi.fn(async () => "{}")) },
    } as any
    const client = createFormUploadClient({
      appInstance,
      isUseSiyuanProxy: true,
      isInSiyuanOrSiyuanNewWin: () => true,
      forwardProxyFormPost: vi.fn(async () => ({ body: '{"via":"proxy"}' })),
      middlewareFormPost: vi.fn(async () => ({ via: "middleware" })),
    })
    await client.postJson({
      url: publicUrl,
      headers: [{}],
      formData: new FormData(),
      forceProxy: false,
    })
    expect(getFormDataFetchSpy).toHaveBeenCalledTimes(1)
  })

  it("does not call getFormDataFetch when forwardProxy is selected", async () => {
    const appInstance = { moduleBase: "/", win: {} } as any
    const client = createFormUploadClient({
      appInstance,
      isUseSiyuanProxy: false,
      isInSiyuanOrSiyuanNewWin: () => false,
      forwardProxyFormPost: vi.fn(async () => ({ body: '{"via":"proxy"}' })),
      middlewareFormPost: vi.fn(),
    })
    const json = await client.postJson({
      url: publicUrl,
      headers: [{}],
      formData: new FormData(),
      forceProxy: true,
    })
    expect(getFormDataFetchSpy).not.toHaveBeenCalled()
    expect(json).toEqual({ via: "proxy" })
  })

  it("does not call getFormDataFetch for loopback without plugin", async () => {
    const appInstance = { moduleBase: "/", win: {} } as any
    const middlewareFormPost = vi.fn(async () => ({ via: "middleware" }))
    const client = createFormUploadClient({
      appInstance,
      isUseSiyuanProxy: false,
      isInSiyuanOrSiyuanNewWin: () => true,
      forwardProxyFormPost: vi.fn(),
      middlewareFormPost,
    })
    await client.postJson({
      url: localUrl,
      headers: [{}],
      formData: new FormData(),
    })
    expect(getFormDataFetchSpy).not.toHaveBeenCalled()
    expect(middlewareFormPost).toHaveBeenCalled()
  })
})
