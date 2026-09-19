/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import baseWebApiSource from "~/src/adaptors/web/base/baseWebApi.ts?raw"
import baseBlogApiSource from "~/src/adaptors/api/base/baseBlogApi.ts?raw"

const forbiddenInJsonFetch = [
  "resolveJsonFetchTransport",
  "resolvePublishTransport",
  "runJsonFetchTransport",
  "PluginFetchUtil.canUsePluginFetch",
  "shouldUseSiyuanForwardProxy",
  "isLoopbackOrLocalTargetUrl",
  "pluginNodeFetch:",
  "siyuanForwardProxy:",
  "corsMiddleware:",
  "Using legency",
  "Using cors",
]

function readMethodBody(source: string, methodName: string): string {
  const start = source.indexOf(`public async ${methodName}`)
  expect(start).toBeGreaterThan(-1)
  const slice = source.slice(start, start + 2500)
  const end = slice.indexOf("\n  }")
  return slice.slice(0, end > 0 ? end : slice.length)
}

describe("base json fetch facade", () => {
  it("BaseWebApi.webFetch delegates only to json fetch client", () => {
    const body = readMethodBody(baseWebApiSource, "webFetch")
    expect(body).toContain("jsonFetchClient.fetch")
    for (const token of forbiddenInJsonFetch) {
      expect(body).not.toContain(token)
    }
  })

  it("BaseBlogApi.apiFetch delegates only to json fetch client", () => {
    const body = readMethodBody(baseBlogApiSource, "apiFetch")
    expect(body).toContain("jsonFetchClient.fetch")
    for (const token of forbiddenInJsonFetch) {
      expect(body).not.toContain(token)
    }
  })
})
