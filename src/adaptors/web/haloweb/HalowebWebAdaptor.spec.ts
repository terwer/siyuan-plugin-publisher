/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { AliasTranslator } from "zhi-common"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { HalowebConfig } from "~/src/adaptors/web/haloweb/HalowebConfig.ts"
import { HalowebWebAdaptor } from "~/src/adaptors/web/haloweb/HalowebWebAdaptor.ts"

const createAdaptor = () => {
  const cfg = new HalowebConfig("http://localhost:8091")
  cfg.apiUrl = "http://localhost:8091"
  const api = new HalowebWebAdaptor(new PublisherAppInstance(), cfg)
  const webFetch = vi.fn()
  vi.spyOn(api as any, "webFetch").mockImplementation(webFetch)
  return { api, webFetch }
}

describe("HalowebWebAdaptor.getDefaultSlug", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("新建文章按站点 Short UUID 策略生成别名", async () => {
    const { api, webFetch } = createAdaptor()
    webFetch.mockResolvedValue({ postSlugGenerationStrategy: "shortUUID" })

    const slug = await api.getDefaultSlug("Halo 网页版策略测试")

    expect(slug).toMatch(/^[0-9a-zA-Z]{8}$/)
    expect(webFetch).toHaveBeenCalledTimes(1)
    expect(String(webFetch.mock.calls[0][0])).toContain("/actuator/globalinfo")
    expect(webFetch.mock.calls[0][3]).toBe("GET")
  })

  it("新建文章按站点 UUID 策略生成标准 v4 UUID", async () => {
    const { api, webFetch } = createAdaptor()
    webFetch.mockResolvedValue({ postSlugGenerationStrategy: "UUID" })

    const slug = await api.getDefaultSlug("Halo 网页版策略测试")

    expect(slug).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it("同一适配器实例只读取一次站点策略", async () => {
    const { api, webFetch } = createAdaptor()
    webFetch.mockResolvedValue({ postSlugGenerationStrategy: "timestamp" })

    const first = await api.getDefaultSlug("标题")
    const second = await api.getDefaultSlug("标题")

    expect(first).toBe(second)
    expect(webFetch).toHaveBeenCalledTimes(1)
  })

  it("旧版没有策略或读取失败时回退按标题生成", async () => {
    const { api, webFetch } = createAdaptor()
    webFetch.mockResolvedValue({ siteTitle: "旧版 Halo" })
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("fallback-slug")

    await expect(api.getDefaultSlug("标题")).resolves.toBe("fallback-slug")
  })

  it("读取站点策略异常时回退按标题生成", async () => {
    const { api, webFetch } = createAdaptor()
    webFetch.mockRejectedValue(new Error("globalinfo unavailable"))
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("fallback-slug")

    await expect(api.getDefaultSlug("标题")).resolves.toBe("fallback-slug")
  })
})
