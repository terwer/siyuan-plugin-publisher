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
import { MediaObject, Post } from "zhi-blog-api"

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
    const result = await createAdaptor(
      JSON.stringify({
        bookId: "123",
        bookSlug: "docs",
        login: "terwer",
      })
    ).validatePublish()

    expect(result).toEqual({ canPublish: true })
  })
})


describe("YuquewebWebAdaptor.logoutWebAuth", () => {
  it("sends DELETE /api/accounts/logout with csrf token, login, Cookie, ajax header, and logout Referer", async () => {
    const adaptor = createAdaptor(undefined, {
      password: "yuque_session=test-session; yuque_ctoken=test-ctoken",
      metadata: { login: "test-login" },
    })
    const webFetch = vi.fn().mockResolvedValue({ data: true })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    await expect(adaptor.logoutWebAuth()).resolves.toBe(true)

    expect(webFetch).toHaveBeenCalledTimes(1)
    expect(webFetch.mock.calls[0][0]).toBe("https://www.yuque.com/api/accounts/logout")
    expect(webFetch.mock.calls[0][2]).toBe("")
    expect(webFetch.mock.calls[0][3]).toBe("DELETE")
    expect(webFetch.mock.calls[0][1][0]).toMatchObject({
      Cookie: "yuque_session=test-session; yuque_ctoken=test-ctoken",
      Accept: "application/json",
      Origin: "https://www.yuque.com",
      Referer: "https://www.yuque.com/logout",
      "X-Requested-With": "XMLHttpRequest",
      "x-csrf-token": "test-ctoken",
      "x-login": "test-login",
    })
  })

  it("loads login from metadata request when cfg.metadata.login is missing", async () => {
    const adaptor = createAdaptor(undefined, {
      password: "yuque_session=test-session; yuque_ctoken=test-ctoken",
      metadata: {},
    })
    const webFetch = vi
      .fn()
      .mockResolvedValueOnce({ data: { id: 1, login: "loaded-login", name: "Loaded" } })
      .mockResolvedValueOnce({ data: true })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    await expect(adaptor.logoutWebAuth()).resolves.toBe(true)

    expect(webFetch.mock.calls[0][0]).toBe("https://www.yuque.com/api/mine")
    expect(webFetch.mock.calls[1][0]).toBe("https://www.yuque.com/api/accounts/logout")
    expect(webFetch.mock.calls[1][1][0]).toMatchObject({ "x-login": "loaded-login" })
  })

  it("fails clearly when yuque_ctoken is missing and does not send logout request", async () => {
    const adaptor = createAdaptor(undefined, {
      password: "yuque_session=test-session",
      metadata: { login: "test-login" },
    })
    const webFetch = vi.fn()
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    await expect(adaptor.logoutWebAuth()).rejects.toThrow("当前 Cookie 缺少 yuque_ctoken")
    expect(webFetch).not.toHaveBeenCalled()
  })

  it("fails clearly when login cannot be resolved and does not fake x-login", async () => {
    const adaptor = createAdaptor(undefined, {
      password: "yuque_session=test-session; yuque_ctoken=test-ctoken",
      metadata: {},
    })
    const webFetch = vi.fn().mockResolvedValue({ data: { id: 1, login: "" } })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    await expect(adaptor.logoutWebAuth()).rejects.toThrow("无法获取当前登录名")
    expect(webFetch).toHaveBeenCalledTimes(1)
    expect(webFetch.mock.calls[0][0]).toBe("https://www.yuque.com/api/mine")
  })
})

describe("YuquewebWebAdaptor image upload diagnostics", () => {
  it("keeps sanitized forwardProxy diagnostics when image upload fails", async () => {
    const adaptor = createAdaptor(undefined, { password: "cookie=session-secret; ctoken=secret-token" })
    vi.spyOn(adaptor as any, "webFormFetch").mockImplementation(
      async (_url: string, _headers: any[], _formData: BodyInit, _forceProxy: boolean, options: any) => {
        Object.assign(options.diagnostic, {
          stage: "forward-proxy",
          transport: "siyuan-forward-proxy",
          status: 403,
          responseBodyPreview:
            '{"message":"forbidden","Cookie":"session-secret","Authorization":"Bearer secret-token","ctoken":"secret-token","ticket":"secret-ticket"}',
        })
        const error = new Error("forbidden Cookie=session-secret Authorization=Bearer secret-token")
        ;(error as any).status = 403
        ;(error as any).diagnostic = options.diagnostic
        throw error
      }
    )

    const mediaObject = new MediaObject("image.png", "image/png", new Uint8Array([1, 2, 3]))

    await expect(adaptor.newMediaObject(mediaObject)).rejects.toMatchObject({
      name: "YuquewebRequestError",
      message: "语雀图片上传失败，请确认 Cookie 有效、图片文件可读取后重试。",
      status: 403,
    })

    try {
      await adaptor.newMediaObject(mediaObject)
    } catch (error: any) {
      expect(error.cause).toBeInstanceOf(Error)
      expect(error.diagnosticMessage).toContain('"stage": "forward-proxy"')
      expect(error.diagnosticMessage).toContain('"transport": "siyuan-forward-proxy"')
      expect(error.diagnosticMessage).toContain('"status": 403')
      expect(error.diagnosticMessage).toContain('"fileName": "image.png"')
      expect(error.diagnosticMessage).toContain('"fileType": "image/png"')
      expect(error.diagnosticMessage).toContain('"fileSize": 3')
      expect(error.diagnosticMessage).toContain("<redacted>")
      expect(error.diagnosticMessage).not.toContain("session-secret")
      expect(error.diagnosticMessage).not.toContain("secret-token")
      expect(error.diagnosticMessage).not.toContain("secret-ticket")
    }
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

  it("confirms updated images when Yuque detail content stores image URL inside encoded Lake card data", async () => {
    const imageUrl = "https://cdn.nlark.com/yuque/0/2026/png/26260900/test.png"
    const encodedImageUrl = encodeURIComponent(imageUrl)
    const adaptor = createAdaptor()
    const webFetch = vi
      .fn()
      .mockResolvedValueOnce({
        data: {
          id: "269293899",
          book_id: "25033491",
          title: "图片标题",
          slug: "image-slug",
          body: `# 图片标题\n\n![测试图片](${imageUrl})`,
          format: "markdown",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: "269293899",
          title: "图片标题",
          slug: "image-slug",
          content: `<!doctype lake><p><card type="inline" name="image" value="data:%7B%22src%22%3A%22${encodedImageUrl}%22%7D"></card></p>`,
          format: "lake",
        },
      })
    vi.spyOn(adaptor as any, "webFetch").mockImplementation(webFetch)

    const post = new Post()
    post.title = "图片标题"
    post.wp_slug = "image-slug"
    post.markdown = `# 图片标题\n\n![测试图片](${imageUrl})`

    await expect(
      adaptor.editPost(
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
    ).resolves.toBe(true)
  })
})
