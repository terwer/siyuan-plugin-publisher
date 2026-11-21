/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

const mockGetBlockAttrs = vi.hoisted(() => vi.fn(async () => ({ box: "nb" }) as Record<string, any>))
const mockGetPost = vi.hoisted(() => vi.fn(async () => ({ markdown: "from siyuan" })))
const mockGetPublisherPicgoManager = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    siyuanConfig: { apiUrl: "http://kernel" },
    kernelApi: {
      getBlockAttrs: mockGetBlockAttrs,
    },
    blogApi: {
      getPost: mockGetPost,
    },
  }),
}))

vi.mock("~/src/composables/usePublisherPicgoManager.ts", () => ({
  getPublisherPicgoManager: mockGetPublisherPicgoManager,
  formatPublisherPicgoError: (error: unknown) => ({
    summary: String((error as any)?.message ?? error),
    details: "",
    fieldErrors: (error as any)?.errors ?? [],
  }),
}))

import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"

const databaseTableMarkdown =
  "|图片|主键|\n| --- | --- |\n|![cat.png](assets/cat.png)|测试行|"

describe("usePicgoBridge.handlePicgo", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetBlockAttrs.mockResolvedValue({ box: "nb" })
    mockGetPost.mockResolvedValue({ markdown: "from siyuan" })
  })

  it("returns the markdown without touching the picgo runtime when the post has no local images", async () => {
    const { handlePicgo } = usePicgoBridge()

    const md = await handlePicgo("page-1", "plain markdown")

    expect(md).toBe("plain markdown")
    expect(mockGetPublisherPicgoManager).not.toHaveBeenCalled()
    expect(mockGetBlockAttrs).not.toHaveBeenCalled()
  })

  it("reads the post from siyuan when no markdown is provided and there are no images", async () => {
    mockGetPost.mockResolvedValueOnce({ markdown: "from siyuan" })
    const { handlePicgo } = usePicgoBridge()

    const md = await handlePicgo("page-1")

    expect(mockGetPost).toHaveBeenCalledWith("page-1")
    expect(md).toBe("from siyuan")
    expect(mockGetPublisherPicgoManager).not.toHaveBeenCalled()
  })

  it("uploads database resource images by passing the publish markdown to the fixed picgo library", async () => {
    const uploadMarkdownImages = vi.fn(async () => ({
      flag: true,
      hasImages: true,
      mdContent: databaseTableMarkdown.replace("assets/cat.png", "https://bed/cat.png"),
      errmsg: "",
    }))
    mockGetPublisherPicgoManager.mockResolvedValueOnce({ uploadMarkdownImages })
    const { handlePicgo } = usePicgoBridge()

    const md = await handlePicgo("page-1", databaseTableMarkdown)

    expect(mockGetBlockAttrs).toHaveBeenCalledWith("page-1")
    expect(uploadMarkdownImages).toHaveBeenCalledWith("page-1", { box: "nb" }, databaseTableMarkdown)
    expect(md).toContain("https://bed/cat.png")
    expect(md).not.toContain("assets/cat.png")
  })

  it("surfaces the picgo upload error when the library reports a failed image", async () => {
    const uploadMarkdownImages = vi.fn(async () => ({
      flag: false,
      hasImages: true,
      mdContent: databaseTableMarkdown,
      errmsg: "upload failed",
    }))
    mockGetPublisherPicgoManager.mockResolvedValueOnce({ uploadMarkdownImages })
    const { handlePicgo } = usePicgoBridge()

    await expect(handlePicgo("page-1", databaseTableMarkdown)).rejects.toThrow("upload failed")
  })
})
