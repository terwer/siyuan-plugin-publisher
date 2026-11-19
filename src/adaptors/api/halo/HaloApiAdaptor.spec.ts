/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { Post } from "zhi-blog-api"
import { AliasTranslator } from "zhi-common"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import {
  HALO_BASIC_AUTH_DISABLED_MESSAGE,
  HaloApiAdaptor,
} from "~/src/adaptors/api/halo/HaloApiAdaptor.ts"

const createAdaptor = () => {
  const cfg = new HaloConfig("admin", "password")
  cfg.home = "http://localhost:8090"
  cfg.apiUrl = "http://localhost:8090"
  const api = new HaloApiAdaptor(new PublisherAppInstance(), cfg)

  const apiFetch = vi.fn()
  ;(api as any).apiFetch = apiFetch
  return { api, apiFetch }
}

const createPost = () => {
  const post = new Post()
  post.title = "Halo Basic Auth 测试"
  post.markdown = "## 正文"
  post.html = "<h2>正文</h2>"
  post.wp_slug = "halo-basic-auth"
  post.dateCreated = new Date("2026-11-18T00:00:00Z")
  return post
}

describe("HaloApiAdaptor Basic Auth 提示", () => {
  it("checkAuth 在 Basic Auth 可用时通过，并请求受保护的列表接口", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({ page: 1, size: 1, total: 0, items: [] })

    await expect(api.checkAuth()).resolves.toBe(true)

    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(String(apiFetch.mock.calls[0][0])).toContain(
      "/apis/api.console.halo.run/v1alpha1/posts?page=1&size=1"
    )
  })

  it("checkAuth 把重定向到登录页的 HTML 转成可操作的 Basic Auth 提示", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue("<!doctype html><html><head><title>登录</title></head></html>")

    await expect(api.checkAuth()).rejects.toThrow(HALO_BASIC_AUTH_DISABLED_MESSAGE)
  })

  it("checkAuth 把 401 problem 响应转成可操作的 Basic Auth 提示", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({ type: "about:blank", title: "Unauthorized", status: 401 })

    await expect(api.checkAuth()).rejects.toThrow(HALO_BASIC_AUTH_DISABLED_MESSAGE)
  })

  it("getCategories 遇到非 JSON 响应时给出 Basic Auth 提示，而不是在 items 上抛 TypeError", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({})

    await expect(api.getCategories()).rejects.toThrow(HALO_BASIC_AUTH_DISABLED_MESSAGE)
  })

  it("getCategories 在正常响应下仍按原逻辑返回分类", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({
      items: [{ spec: { slug: "default", displayName: "默认分类", description: "默认分类" } }],
    })

    const categories = await api.getCategories()

    expect(categories).toHaveLength(1)
    expect(categories[0].categoryId).toBe("default")
    expect(categories[0].categoryName).toBe("默认分类")
  })

  it("newPost 在未开启 Basic Auth 时抛出可操作提示，而不是泛化的 Halo 文章发布失败", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue("<!doctype html><html><body>login</body></html>")

    await expect(api.newPost(createPost())).rejects.toThrow(HALO_BASIC_AUTH_DISABLED_MESSAGE)
  })

  it("editPost 不吞掉 Basic Auth 提示", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue("<!doctype html><html><body>login</body></html>")
    const postid = JSON.stringify({
      name: "post-1",
      slug: "post-1",
      year: "2026",
      month: "11",
      day: "18",
    })

    await expect(api.editPost(postid, createPost())).rejects.toThrow(HALO_BASIC_AUTH_DISABLED_MESSAGE)
  })
})

describe("HaloApiAdaptor.getDefaultSlug", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("新建文章按站点 Short UUID 策略生成别名", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({ postSlugGenerationStrategy: "shortUUID" })

    const slug = await api.getDefaultSlug("Halo 策略测试")

    expect(slug).toMatch(/^[0-9a-zA-Z]{8}$/)
    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(String(apiFetch.mock.calls[0][0])).toContain("/actuator/globalinfo")
    expect(apiFetch.mock.calls[0][3]).toBe("GET")
  })

  it("同一适配器实例只读取一次站点策略", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({ postSlugGenerationStrategy: "timestamp" })
    // timestamp 策略依赖 Date.now()，冻结时间才能断言两次调用结果一致
    vi.spyOn(Date, "now").mockReturnValue(1795054800000)

    const first = await api.getDefaultSlug("标题")
    const second = await api.getDefaultSlug("标题")

    expect(first).toBe(second)
    expect(apiFetch).toHaveBeenCalledTimes(1)
  })

  it("旧版没有策略时回退按标题生成，不阻断发布", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockResolvedValue({ siteTitle: "旧版 Halo" })
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("fallback-slug")

    await expect(api.getDefaultSlug("标题")).resolves.toBe("fallback-slug")
  })

  it("读取站点策略失败时回退按标题生成", async () => {
    const { api, apiFetch } = createAdaptor()
    apiFetch.mockRejectedValue(new Error("globalinfo unavailable"))
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("fallback-slug")

    await expect(api.getDefaultSlug("标题")).resolves.toBe("fallback-slug")
  })
})
