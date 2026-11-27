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
import { CoverSource, Post } from "zhi-blog-api"
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
    // timestamp 策略依赖 Date.now()，冻结时间才能断言两次调用结果一致
    vi.spyOn(Date, "now").mockReturnValue(1795054800000)

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

const createCoverPost = () => {
  const post = new Post()
  post.title = "Halo Web 封面测试"
  post.markdown = "## 正文"
  post.html = "<h2>正文</h2>"
  post.wp_slug = "halo-web-cover"
  post.dateCreated = new Date("2026-11-18T00:00:00Z")
  post.cover = "http://siyuan/assets/cover.png"
  post.coverSource = CoverSource.TitleImage
  return post
}

const haloContent = () => {
  return { snapshotName: "head-1", raw: "旧正文", content: "<p>旧正文</p>", rawType: "markdown" }
}

describe("HalowebWebAdaptor 封面与更新链路", () => {
  it("newPost 把解析出的封面链接写入 spec.cover", async () => {
    const { api, webFetch } = createAdaptor()
    let created: any
    webFetch.mockImplementation(async (url: string, _headers: any, body: string, method: string) => {
      if (String(url).endsWith("/publish")) {
        return { metadata: { name: "post-1" } }
      }
      if (String(url).includes("/apis/api.console.halo.run/v1alpha1/posts") && method === "POST") {
        created = JSON.parse(body)
        return { metadata: { name: "post-1" }, spec: { slug: "halo-web-cover" } }
      }
      return {}
    })

    await api.newPost(createCoverPost())

    expect(created.post.spec.cover).toBe("http://siyuan/assets/cover.png")
  })

  it("editPost 单次提交 post+content，并写入封面链接", async () => {
    const { api, webFetch } = createAdaptor()
    let updated: any
    let updateCount = 0
    webFetch.mockImplementation(async (url: string, _headers: any, body: string, method: string) => {
      const target = String(url)
      if (target.endsWith("/head-content")) {
        return haloContent()
      }
      if (target.endsWith("/publish")) {
        return { metadata: { name: "post-1" } }
      }
      if (target.includes("/apis/api.console.halo.run/v1alpha1/posts/post-1") && method === "PUT") {
        updated = JSON.parse(body)
        updateCount++
        return { metadata: { name: "post-1" } }
      }
      if (target.includes("/apis/content.halo.run/v1alpha1/posts/post-1")) {
        return {
          metadata: { name: "post-1" },
          spec: {
            title: "旧标题",
            slug: "old-slug",
            cover: "",
            excerpt: { autoGenerate: true, raw: "" },
            categories: [],
            tags: [],
          },
        }
      }
      return {}
    })
    const postid = JSON.stringify({ name: "post-1", slug: "old-slug", year: "2026", month: "11", day: "18" })

    await expect(api.editPost(postid, createCoverPost())).resolves.toBe(true)

    expect(updateCount).toBe(1)
    expect(updated.post.spec.cover).toBe("http://siyuan/assets/cover.png")
    expect(updated.content.rawType).toBe("markdown")
  })
})
