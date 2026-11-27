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
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { CsdnWebAdaptor } from "~/src/adaptors/web/csdn/csdnWebAdaptor.ts"
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"

const KERNEL_BASE = "http://127.0.0.1:6806"
const CSDN_COVER = "https://i-blog.csdnimg.cn/direct/uploaded-cover.png"

const uploadCredential = () => ({
  provider: "obs",
  accessId: "access-id",
  policy: "policy",
  signature: "signature",
  callbackBody: "callback-body",
  callbackBodyType: "application/json",
  callbackUrl: "https://bizapi.csdn.net/callback",
  filePath: "direct/blog_cover.png",
  host: "https://obs.example.com/upload",
  customParam: {
    rtype: "markdown",
    watermark: "false",
    templateName: "standard",
    filePath: "direct/blog_cover.png",
    isAudit: "false",
    "x-image-app": "direct_blog_coverimage",
    type: "image",
    "x-image-suffix": "png",
    username: "tester",
  },
})

const createPost = (): Post => {
  const post = new Post()
  post.title = "CSDN 封面测试"
  post.markdown = "## 正文"
  post.html = "<h2>正文</h2>"
  post.shortDesc = "摘要"
  post.mt_keywords = "测试"
  post.categories = []
  post.postid = ""
  return post
}

const createAdaptor = () => {
  const cfg = new CsdnConfig("", "cookie", "https://api.terwer.space/api/middleware")
  const api = new CsdnWebAdaptor(new PublisherAppInstance(), cfg)
  const webFetch = vi.fn()
  const webFormFetch = vi.fn()
  vi.spyOn(api as any, "webFetch").mockImplementation(webFetch)
  vi.spyOn(api as any, "webFormFetch").mockImplementation(webFormFetch)
  vi.spyOn((api as any).baseExtendApi, "getSiyuanApiBaseUrl").mockReturnValue(KERNEL_BASE)
  vi.spyOn(CsdnUtils, "processPrismjs").mockImplementation(async (_adaptor: any, html: string) => html)
  return { api, webFetch, webFormFetch }
}

interface CapturedRequest {
  url: string
  body: any
}

const installTransport = (webFetch: any, webFormFetch: any, saved: CapturedRequest[], existingCover = "") => {
  webFetch.mockImplementation(async (url: string, _headers: any, params: any) => {
    if (String(url).includes("/resource-api/v1/image/direct/upload/signature")) {
      saved.push({ url: String(url), body: params ? JSON.parse(params) : undefined })
      return { code: 200, msg: "success", data: uploadCredential() }
    }
    if (String(url).includes("/v3/mdeditor/saveArticle")) {
      saved.push({ url: String(url), body: params ? JSON.parse(params) : undefined })
      return { code: 200, data: { id: 123 } }
    }
    if (String(url).includes("/v3/editor/getArticle")) {
      return {
        code: 200,
        data: {
          article_id: "42",
          title: "CSDN 封面测试",
          tags: "测试",
          categories: "",
          cover_images: existingCover ? [existingCover] : [],
        },
      }
    }
    throw new Error(`unexpected request: ${url}`)
  })
  webFormFetch.mockResolvedValue({
    code: 200,
    data: { imageUrl: CSDN_COVER, targetObjectKey: "direct/blog_cover.png" },
  })
}

const savedArticle = (saved: CapturedRequest[]) => saved.find((item) => item.url.includes("/saveArticle"))?.body
const signedUpload = (saved: CapturedRequest[]) =>
  saved.find((item) => item.url.includes("/upload/signature"))?.body

describe("CsdnWebAdaptor 封面", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("已有 CSDN 图床封面时直接写入 cover_images/cover_type", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved)

    const post = createPost()
    post.cover = CSDN_COVER
    await api.addPost(post)

    expect(savedArticle(saved)?.cover_images).toEqual([CSDN_COVER])
    expect(savedArticle(saved)?.cover_type).toBe(1)
    expect(webFormFetch).not.toHaveBeenCalled()
  })

  it("思源内核封面经封面专用通道上传后再写入 cover_images", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved)
    vi.spyOn((api as any).baseExtendApi, "readFileToBase64").mockResolvedValue({
      imageName: "cover.png",
      mimeType: "image/png",
      imageBase64: Buffer.from([1, 2, 3]).toString("base64"),
    })

    const post = createPost()
    post.cover = `${KERNEL_BASE}/assets/cover.png`
    await api.addPost(post)

    expect(signedUpload(saved)).toMatchObject({
      appName: "direct_blog_coverimage",
      imageTemplate: "",
      imageSuffix: "png",
    })
    expect(savedArticle(saved)?.cover_images).toEqual([CSDN_COVER])
    expect(savedArticle(saved)?.cover_type).toBe(1)
  })

  it("公网封面链接直接使用，不重复上传", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved)

    const post = createPost()
    post.cover = "https://cdn.example.com/cover.jpg"
    await api.addPost(post)

    expect(savedArticle(saved)?.cover_images).toEqual(["https://cdn.example.com/cover.jpg"])
    expect(webFormFetch).not.toHaveBeenCalled()
  })

  it("没有封面时不下发 cover_images/cover_type", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved)

    await api.addPost(createPost())

    expect(savedArticle(saved)).not.toHaveProperty("cover_images")
    expect(savedArticle(saved)).not.toHaveProperty("cover_type")
  })

  it("更新时清空封面会显式下发 cover_type=0", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved)

    const post = createPost() as Post & { featuredImageCleared?: boolean }
    post.featuredImageCleared = true
    await api.editPost("42", post)

    expect(savedArticle(saved)?.cover_images).toEqual([])
    expect(savedArticle(saved)?.cover_type).toBe(0)
  })

  it("更新时没有新的封面来源，回读并重发平台已有封面", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    const existingCover = "https://i-blog.csdnimg.cn/direct/existing-cover.png"
    installTransport(webFetch, webFormFetch, saved, existingCover)

    await api.editPost("42", createPost())

    expect(savedArticle(saved)?.cover_images).toEqual([existingCover])
    expect(savedArticle(saved)?.cover_type).toBe(1)
  })

  it("更新时清空封面不回读平台封面", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved, "https://i-blog.csdnimg.cn/direct/existing-cover.png")

    const post = createPost() as Post & { featuredImageCleared?: boolean }
    post.featuredImageCleared = true
    await api.editPost("42", post)

    expect(savedArticle(saved)?.cover_images).toEqual([])
    expect(savedArticle(saved)?.cover_type).toBe(0)
  })

  it("getPost 回读平台封面，供更新时保留", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const existingCover = "https://i-blog.csdnimg.cn/direct/existing-cover.png"
    installTransport(webFetch, webFormFetch, [], existingCover)

    const post = await api.getPost("42")

    expect(post.cover).toBe(existingCover)
  })

  it("封面处理失败不阻断正文发布，并记录原因", async () => {
    const { api, webFetch, webFormFetch } = createAdaptor()
    const saved: CapturedRequest[] = []
    installTransport(webFetch, webFormFetch, saved)
    webFormFetch.mockRejectedValue(new Error("storage unavailable"))
    vi.spyOn((api as any).baseExtendApi, "readFileToBase64").mockResolvedValue({
      imageName: "cover.png",
      mimeType: "image/png",
      imageBase64: Buffer.from([1, 2, 3]).toString("base64"),
    })

    const post = createPost()
    post.cover = `${KERNEL_BASE}/assets/cover.png`
    await api.addPost(post)

    expect(savedArticle(saved)).toBeTruthy()
    expect(savedArticle(saved)).not.toHaveProperty("cover_images")
    expect((post as any).featuredImageError).toContain("封面图上传失败")
  })

  it("CSDN 配置声明封面能力，运行时合并后仍然生效", () => {
    const cfg = new CsdnConfig("", "cookie")
    expect(cfg.coverEnabled).toBe(true)
    expect(cfg.featuredImageEnabled).toBe(true)
  })
})
