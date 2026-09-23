/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import PluginFetchUtil from "~/src/utils/PluginFetchUtil.ts"
import {
  createJsonFetchClient,
  jsonFetchTransportTestExports,
} from "~/src/utils/jsonFetchClient.ts"

const {
  resolveJsonFetchTransport,
  buildRequestBody,
  buildPluginRequestHeaders,
  encodeBufferAsResponseBody,
  isBodyInit,
} = jsonFetchTransportTestExports

const publicUrl = "https://api.example.com/v1"
const localUrl = "http://127.0.0.1:8090/api"

const baseDeps = {
  appInstance: { moduleBase: "/", win: {} } as any,
  isUseSiyuanProxy: true,
  isInSiyuanOrSiyuanNewWin: () => true,
  siyuanForwardProxyFetch: vi.fn(async () => ({ via: "proxy" })),
  middlewareFetch: vi.fn(async () => ({ via: "middleware" })),
}

function mockPluginFetchResponse(options: {
  status?: number
  body?: string | Uint8Array
  contentType?: string
}) {
  const bytes =
    typeof options.body === "string"
      ? new TextEncoder().encode(options.body)
      : (options.body ?? new Uint8Array())
  const headers = new Headers()
  if (options.contentType) {
    headers.set("content-type", options.contentType)
  }
  return {
    status: options.status ?? 200,
    headers,
    arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    text: async () => new TextDecoder().decode(bytes),
  }
}

describe("buildRequestBody", () => {
  it("keeps string body as-is", () => {
    expect(buildRequestBody("POST", '{"a":1}', "application/json")).toBe('{"a":1}')
  })

  it("stringifies plain object only for application/json", () => {
    expect(buildRequestBody("POST", { a: 1 }, "application/json")).toBe('{"a":1}')
    expect(buildRequestBody("POST", { a: 1 }, "text/plain")).toEqual({ a: 1 })
  })

  it("does not JSON.stringify FormData or other BodyInit", () => {
    const formData = new FormData()
    formData.append("file", "x")
    expect(buildRequestBody("POST", formData, "multipart/form-data")).toBe(formData)
    expect(isBodyInit(formData)).toBe(true)

    const params = new URLSearchParams({ q: "1" })
    expect(buildRequestBody("POST", params, "application/x-www-form-urlencoded")).toBe(params)

    const blob = new Blob(["hi"], { type: "text/plain" })
    expect(buildRequestBody("POST", blob, "text/plain")).toBe(blob)
  })
})

describe("buildPluginRequestHeaders", () => {
  it("omits Content-Type for FormData so boundary can be set by fetch", () => {
    const formData = new FormData()
    const headers = buildPluginRequestHeaders({ Authorization: "x" }, "multipart/form-data", formData)
    expect(headers.Authorization).toBe("x")
    expect(headers["Content-Type"]).toBeUndefined()
    expect(headers["content-type"]).toBeUndefined()
  })

  it("sets Content-Type for JSON bodies", () => {
    const headers = buildPluginRequestHeaders({}, "application/json", '{"a":1}')
    expect(headers["Content-Type"]).toBe("application/json")
  })
})

describe("encodeBufferAsResponseBody", () => {
  it("encodes binary as base64 for responseEncoding=base64", () => {
    const buf = Buffer.from("hello")
    expect(encodeBufferAsResponseBody(buf, "base64")).toBe(buf.toString("base64"))
  })
})

describe("resolveJsonFetchTransport", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("plugin fetch is always first priority even with forceProxy", () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(true)
    expect(
      resolveJsonFetchTransport(baseDeps, {
        url: publicUrl,
        headers: [{}],
        forceProxy: true,
      })
    ).toBe("plugin-node-fetch")
  })

  it("uses forwardProxy for loopback without plugin when proxy flags set", () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(false)
    expect(
      resolveJsonFetchTransport(
        { ...baseDeps, isInSiyuanOrSiyuanNewWin: () => false, isUseSiyuanProxy: true },
        { url: localUrl, headers: [{}], forceProxy: true }
      )
    ).toBe("siyuan-forward-proxy")
  })

  it("falls back to middleware-fetch for loopback without proxy flags", () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(false)
    expect(
      resolveJsonFetchTransport(
        { ...baseDeps, isInSiyuanOrSiyuanNewWin: () => true, isUseSiyuanProxy: false },
        { url: localUrl, headers: [{}], forceProxy: false }
      )
    ).toBe("middleware-fetch")
  })
})

describe("createJsonFetchClient plugin-node-fetch", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("parses JSON success response for responseEncoding=text", async () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(true)
    vi.spyOn(PluginFetchUtil, "getPluginNodeFetch").mockReturnValue(
      vi.fn(async () =>
        mockPluginFetchResponse({
          body: '{"ok":true,"n":1}',
          contentType: "application/json; charset=utf-8",
        })
      ) as any
    )

    const client = createJsonFetchClient(baseDeps)
    const result = await client.fetch({
      url: publicUrl,
      headers: [{}],
      method: "POST",
      params: { q: 1 },
    })
    expect(result).toEqual({ ok: true, n: 1 })
  })

  it("returns base64 body and response contentType for responseEncoding=base64", async () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(true)
    const raw = Buffer.from("binary-payload")
    vi.spyOn(PluginFetchUtil, "getPluginNodeFetch").mockReturnValue(
      vi.fn(async () =>
        mockPluginFetchResponse({
          body: raw,
          contentType: "image/png",
        })
      ) as any
    )

    const client = createJsonFetchClient(baseDeps)
    const result = await client.fetch({
      url: publicUrl,
      headers: [{}],
      method: "GET",
      responseEncoding: "base64",
    })
    expect(result).toEqual({
      body: raw.toString("base64"),
      status: 200,
      contentType: "image/png",
    })
  })

  it("does not stringify FormData in plugin fetch", async () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(true)
    const doFetch = vi.fn(async (_url: string, init: RequestInit) => {
      expect(init.body).toBeInstanceOf(FormData)
      const headers = init.headers as Record<string, string>
      expect(headers["Content-Type"]).toBeUndefined()
      return mockPluginFetchResponse({ body: "{}", contentType: "application/json" })
    })
    vi.spyOn(PluginFetchUtil, "getPluginNodeFetch").mockReturnValue(doFetch as any)

    const formData = new FormData()
    formData.append("k", "v")
    const client = createJsonFetchClient(baseDeps)
    await client.fetch({
      url: publicUrl,
      headers: [{}],
      method: "POST",
      params: formData,
      contentType: "multipart/form-data",
    })
    expect(doFetch).toHaveBeenCalled()
  })
})

describe("createJsonFetchClient other transports", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("routes to middlewareFetch when resolver selects middleware-fetch", async () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(false)
    const middlewareFetch = vi.fn(async () => ({ via: "middleware" }))
    const client = createJsonFetchClient({
      ...baseDeps,
      isUseSiyuanProxy: false,
      isInSiyuanOrSiyuanNewWin: () => true,
      middlewareFetch,
    })
    const result = await client.fetch({
      url: publicUrl,
      headers: [{}],
      method: "GET",
    })
    expect(middlewareFetch).toHaveBeenCalled()
    expect(result).toEqual({ via: "middleware" })
  })

  it("preserves diagnostic transport/status/preview on plugin HTTP error", async () => {
    vi.spyOn(PluginFetchUtil, "canUsePluginFetch").mockReturnValue(true)
    vi.spyOn(PluginFetchUtil, "getPluginNodeFetch").mockReturnValue(
      vi.fn(async () =>
        mockPluginFetchResponse({
          status: 403,
          body: '{"message":"forbidden","token":"secret"}',
          contentType: "application/json",
        })
      ) as any
    )

    const diagnostic: Record<string, unknown> = { stage: "web-fetch" }
    const buildDiagnosticPreview = vi.fn((input: unknown) => String(input).slice(0, 200))
    const client = createJsonFetchClient({
      ...baseDeps,
      buildDiagnosticPreview,
      attachDiagnosticError: (e, d) => {
        ;(e as any).diagnostic = d
      },
    })

    await expect(
      client.fetch({
        url: publicUrl,
        headers: [{}],
        diagnostic: diagnostic as any,
      })
    ).rejects.toMatchObject({ status: 403 })

    expect(diagnostic.transport).toBe("plugin-node-fetch")
    expect(diagnostic.status).toBe(403)
    expect(diagnostic.responseBodyPreview).toContain("forbidden")
    expect(buildDiagnosticPreview).toHaveBeenCalled()
  })
})
