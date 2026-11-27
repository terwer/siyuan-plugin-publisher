/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { Post } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { NotionApiAdaptor } from "~/src/adaptors/api/notion/notionApiAdaptor.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"

interface ApiCall {
  url: string
  method: string
  params: any
}

const markdownWithParagraphs = (count: number): string =>
  Array.from({ length: count }, (_, index) => `第 ${index + 1} 段`).join("\n\n")

const makePost = (markdown: string): Post => {
  const post = new Post()
  post.title = "Notion 长文测试"
  post.description = markdown
  return post
}

/**
 * 用内存里的 apiFetch 代替真实 Notion 请求，记录每次调用的 URL、方法和请求体。
 */
const createAdaptor = (options?: { rateLimitFirstAppend?: boolean }) => {
  const cfg = new NotionConfig("test-token")
  cfg.blogid = "root-page-id"
  const api = new NotionApiAdaptor(new PublisherAppInstance(), cfg)
  const calls: ApiCall[] = []
  let appendCount = 0
  let rateLimited = false

  const apiFetch = vi.fn(async (url: string, _headers: any, body: string | undefined, method: string) => {
    const params = body ? JSON.parse(body) : undefined
    calls.push({ url, method, params })

    if (url.endsWith("/pages") && method === "POST") {
      return { object: "page", id: "page-1", url: "https://www.notion.so/abcdef123" }
    }
    if (url.endsWith("/blocks/page-1/children") && method === "PATCH") {
      appendCount += 1
      if (options?.rateLimitFirstAppend && appendCount === 1 && !rateLimited) {
        rateLimited = true
        const error = new Error("rate limited") as Error & { status?: number }
        error.status = 429
        throw error
      }
      return { object: "list", results: params.children }
    }
    if (url.endsWith("/pages/page-1") && method === "PATCH") {
      return { object: "page", archived: true }
    }
    throw new Error(`unexpected Notion request: ${method} ${url}`)
  })
  ;(api as any).apiFetch = apiFetch

  return { api, calls, apiFetch }
}

afterEach(() => {
  vi.useRealTimers()
})

describe("NotionApiAdaptor long article blocks", () => {
  it("creates the page with the first 100 blocks and appends the rest in order", async () => {
    const { api, calls } = createAdaptor()
    const postid = await api.newPost(makePost(markdownWithParagraphs(250)))

    const createCall = calls.find((call) => call.url.endsWith("/pages") && call.method === "POST")!
    expect(createCall.params.children).toHaveLength(100)

    const appendCalls = calls.filter((call) => call.url.endsWith("/blocks/page-1/children"))
    expect(appendCalls.map((call) => call.params.children.length)).toEqual([100, 50])

    const submittedBlocks = [...createCall.params.children, ...appendCalls.flatMap((call) => call.params.children)]
    expect(submittedBlocks).toHaveLength(250)
    expect(submittedBlocks[0].paragraph.rich_text[0].text.content).toBe("第 1 段")
    expect(submittedBlocks[249].paragraph.rich_text[0].text.content).toBe("第 250 段")
    expect(postid).toBe("page-1_abcdef123")
  })

  it("keeps a 100-block article in the page creation request", async () => {
    const { api, calls } = createAdaptor()
    await api.newPost(makePost(markdownWithParagraphs(100)))

    expect(calls.filter((call) => call.url.endsWith("/children"))).toHaveLength(0)
    expect(calls.find((call) => call.url.endsWith("/pages"))!.params.children).toHaveLength(100)
  })

  it("appends the 101st block separately", async () => {
    const { api, calls } = createAdaptor()
    await api.newPost(makePost(markdownWithParagraphs(101)))

    const appendCalls = calls.filter((call) => call.url.endsWith("/children"))
    expect(appendCalls).toHaveLength(1)
    expect(appendCalls[0].params.children).toHaveLength(1)
  })

  it("archives the partial page when an append fails", async () => {
    const { api, calls, apiFetch } = createAdaptor()
    let appendCount = 0
    apiFetch.mockImplementation(async (url: string, _headers: any, body: string | undefined, method: string) => {
      const params = body ? JSON.parse(body) : undefined
      calls.push({ url, method, params })
      if (url.endsWith("/pages") && method === "POST") {
        return { object: "page", id: "page-1", url: "https://www.notion.so/abcdef123" }
      }
      if (url.endsWith("/blocks/page-1/children") && method === "PATCH") {
        appendCount += 1
        if (appendCount === 2) {
          throw new Error("Notion append failed")
        }
        return { object: "list", results: params.children }
      }
      if (url.endsWith("/pages/page-1") && method === "PATCH") {
        return { object: "page", archived: true }
      }
      throw new Error(`unexpected Notion request: ${method} ${url}`)
    })

    await expect(api.newPost(makePost(markdownWithParagraphs(250)))).rejects.toThrow("Notion append failed")

    const archiveCall = calls.find(
      (call) => call.url.endsWith("/pages/page-1") && call.method === "PATCH" && call.params.archived
    )
    expect(archiveCall).toBeTruthy()
  })

  it("retries a rate-limited batch before failing the publish", async () => {
    vi.useFakeTimers()
    const { api, calls } = createAdaptor({ rateLimitFirstAppend: true })
    const promise = api.newPost(makePost(markdownWithParagraphs(101)))

    await vi.runAllTimersAsync()
    await expect(promise).resolves.toBe("page-1_abcdef123")
    vi.useRealTimers()

    const appendCalls = calls.filter((call) => call.url.endsWith("/blocks/page-1/children"))
    expect(appendCalls).toHaveLength(2)
  })
})
