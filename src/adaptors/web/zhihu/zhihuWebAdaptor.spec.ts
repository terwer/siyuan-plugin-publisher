/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { ZhihuWebAdaptor } from "~/src/adaptors/web/zhihu/zhihuWebAdaptor.ts"
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"

const createAdaptor = (username = "", password = "test") =>
  new ZhihuWebAdaptor(new PublisherAppInstance(), new ZhihuConfig(username, password))

const columnContribution = (id: string, title: string) => ({
  column: {
    id,
    title,
    url: `https://zhuanlan.zhihu.com/${id}`,
  },
})

describe("ZhihuWebAdaptor.getCategories", () => {
  it("uses the logged-in account's url_token for columns even when the configured username is wrong (#1713)", async () => {
    const adaptor = createAdaptor("wrong-username")
    const webFetch = vi.fn(async (url: string) => {
      if (url.includes("/api/v4/me?")) {
        return { uid: "1", name: "唐有炜", url_token: "terwer" }
      }
      if (url.includes("/members/terwer/column-contributions")) {
        return { data: [columnContribution("c1", "专栏一")] }
      }
      return { data: [] }
    })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    const categories = await adaptor.getCategories()

    expect(categories.map((item) => item.categoryId)).toEqual(["c1"])
    expect(webFetch.mock.calls.map(([url]) => url)).not.toContainEqual(
      expect.stringContaining("/members/wrong-username/column-contributions")
    )
  })

  it("falls back to the configured username when /api/v4/me is unavailable", async () => {
    const adaptor = createAdaptor("terwer")
    const webFetch = vi.fn(async (url: string) => {
      if (url.includes("/api/v4/me?")) {
        throw new Error("network error")
      }
      if (url.includes("/members/terwer/column-contributions")) {
        return { data: [columnContribution("c2", "专栏二")] }
      }
      return { data: [] }
    })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    const categories = await adaptor.getCategories()

    expect(categories.map((item) => item.categoryId)).toEqual(["c2"])
  })

  it("returns no categories without a username or url_token", async () => {
    const adaptor = createAdaptor("")
    vi.spyOn(adaptor as any, "webFetch").mockResolvedValue({})

    await expect(adaptor.getCategories()).resolves.toEqual([])
  })
})

describe("ZhihuWebAdaptor.getUsersBlogs", () => {
  it("returns the resolved username as metadata so validation can auto-fill the hidden field", async () => {
    const adaptor = createAdaptor("stale-username")
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(async (url: string) => {
      if (url.includes("/api/v4/me?")) {
        return { uid: "1", url_token: "terwer" }
      }
      return { data: [columnContribution("c1", "专栏一")] }
    })

    const userBlogs = await adaptor.getUsersBlogs()

    expect(userBlogs[0].metadataMap).toEqual({ username: "terwer" })
  })
})

describe("ZhihuWebAdaptor.getMetaData", () => {
  it("fills an empty username from the logged-in account's url_token", async () => {
    const adaptor = createAdaptor("")
    vi.spyOn(adaptor as any, "webFetch").mockResolvedValue({
      uid: "1",
      name: "唐有炜",
      url_token: "terwer",
      avatar_url: "https://pic1.zhimg.com/avatar.jpg",
    })

    const metadata = await adaptor.getMetaData()

    expect(metadata.flag).toBe(true)
    expect((adaptor as any).cfg.username).toBe("terwer")
  })

  it("replaces a stale configured username with the logged-in account's url_token", async () => {
    const adaptor = createAdaptor("stale-user")
    vi.spyOn(adaptor as any, "webFetch").mockResolvedValue({
      uid: "1",
      name: "唐有炜",
      url_token: "terwer",
    })

    await adaptor.getMetaData()

    expect((adaptor as any).cfg.username).toBe("terwer")
  })
})
