/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { YuquewebConfig } from "~/src/adaptors/web/yuqueweb/YuquewebConfig.ts"
import { YuquewebWebAdaptor } from "~/src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import zhCN from "~/src/locales/zh_CN.ts"
import { Post } from "zhi-blog-api"

const createAdaptor = (blogid?: any, extra: Record<string, any> = {}) => {
  const cfg = new YuquewebConfig("cookie=value")
  cfg.blogid = blogid
  Object.assign(cfg, extra)
  return new YuquewebWebAdaptor(new PublisherAppInstance(), cfg)
}

describe("YuquewebWebAdaptor.validatePublish", () => {
  it("blocks publishing when no knowledge base is selected", async () => {
    const result = await createAdaptor("").validatePublish()

    expect(result).toEqual({
      canPublish: false,
      reason: zhCN["setting.yuqueweb.publishValidation.selectKnowledgeBase"],
    })
  })

  it("blocks publishing when selected knowledge-base metadata is incomplete", async () => {
    const result = await createAdaptor(JSON.stringify({ bookId: "123", bookSlug: "docs" })).validatePublish()

    expect(result).toEqual({
      canPublish: false,
      reason: zhCN["setting.yuqueweb.publishValidation.selectKnowledgeBase"],
    })
  })

  it("allows publishing when selected knowledge-base metadata is complete", async () => {
    const result = await createAdaptor(JSON.stringify({ bookId: "123", bookSlug: "docs", login: "terwer" })).validatePublish()

    expect(result).toEqual({ canPublish: true })
  })
})

describe("YuquewebWebAdaptor document read/update", () => {
  it("reads document details by id plus book_id as the primary path and maps content to markdown", async () => {
    const adaptor = createAdaptor()
    const webFetch = vi.fn().mockResolvedValue({
      data: {
        id: "269293899",
        title: "已更新标题",
        slug: "updated-slug",
        content: "<!doctype lake><p>已更新正文</p>",
      },
    })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    const post = await adaptor.getPost(
      JSON.stringify({
        id: "269293899",
        slug: "old-slug",
        bookId: "25033491",
        bookSlug: "note",
        login: "terwer",
        format: "markdown",
      })
    )

    expect(webFetch).toHaveBeenCalledTimes(1)
    expect(webFetch.mock.calls[0][0]).toBe(
      "https://www.yuque.com/api/docs/269293899?book_id=25033491&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false"
    )
    expect(post.title).toBe("已更新标题")
    expect(post.wp_slug).toBe("updated-slug")
    expect(post.markdown).toBe("<!doctype lake><p>已更新正文</p>")
    expect(post.description).toBe("<!doctype lake><p>已更新正文</p>")
  })

  it("falls back to slug plus book_id only when id detail reading fails", async () => {
    const adaptor = createAdaptor()
    const webFetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 404, message: "Not Found" })
      .mockResolvedValueOnce({
        data: {
          id: "269293899",
          title: "回退读取标题",
          slug: "updated-slug",
          content: "回退读取正文",
        },
      })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    const post = await adaptor.getPost(
      JSON.stringify({
        id: "269293899",
        slug: "updated-slug",
        bookId: "25033491",
        bookSlug: "note",
        login: "terwer",
        format: "markdown",
      })
    )

    expect(webFetch.mock.calls.map((call) => call[0])).toEqual([
      "https://www.yuque.com/api/docs/269293899?book_id=25033491&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false",
      "https://www.yuque.com/api/docs/updated-slug?book_id=25033491&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false",
    ])
    expect(post.markdown).toBe("回退读取正文")
  })

  it("updates the same doc, confirms by id plus book_id, and stores the returned slug in postid", async () => {
    const adaptor = createAdaptor()
    const webFetch = vi
      .fn()
      .mockResolvedValueOnce({
        data: {
          id: "269293899",
          book_id: "25033491",
          title: "新标题",
          slug: "new-slug",
          body: "# 新标题\n\n正文 marker",
          format: "markdown",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: "269293899",
          title: "新标题",
          slug: "new-slug",
          content: "<!doctype lake><h1>新标题</h1><p>正文 marker</p>",
          format: "lake",
        },
      })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    const post = new Post()
    post.title = "新标题"
    post.wp_slug = "new-slug"
    post.markdown = "# 新标题\n\n正文 marker"

    const result = await adaptor.editPost(
      JSON.stringify({
        id: "269293899",
        slug: "old-slug",
        bookId: "25033491",
        bookSlug: "note",
        login: "terwer",
        format: "markdown",
      }),
      post
    )

    expect(result).toBe(true)
    expect(webFetch.mock.calls[0][0]).toBe("https://www.yuque.com/api/docs/269293899")
    expect(webFetch.mock.calls[0][3]).toBe("PUT")
    expect(JSON.parse(webFetch.mock.calls[0][2])).toMatchObject({
      book_id: 25033491,
      type: "Doc",
      format: "markdown",
      title: "新标题",
      slug: "new-slug",
      body: "# 新标题\n\n正文 marker",
      status: 1,
    })
    expect(webFetch.mock.calls[1][0]).toBe(
      "https://www.yuque.com/api/docs/269293899?book_id=25033491&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false"
    )
    expect(JSON.parse(post.postid)).toMatchObject({
      id: "269293899",
      slug: "new-slug",
      bookId: "25033491",
      bookSlug: "note",
      login: "terwer",
      format: "markdown",
      url: "https://www.yuque.com/terwer/note/new-slug",
    })
  })
})
