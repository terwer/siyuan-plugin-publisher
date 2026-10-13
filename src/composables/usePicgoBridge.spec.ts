/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

const mockGetBlockAttrs = vi.hoisted(() => vi.fn(async () => ({})))
const mockGetImageBlocksByID = vi.hoisted(() => vi.fn(async () => [] as unknown[]))
const mockGetPost = vi.hoisted(() => vi.fn(async () => ({ markdown: "from siyuan" })))
const mockGetPublisherPicgoManager = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    siyuanConfig: { apiUrl: "" },
    kernelApi: {
      getBlockAttrs: mockGetBlockAttrs,
      getImageBlocksByID: mockGetImageBlocksByID,
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
    fieldErrors: [],
  }),
}))

import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"

describe("usePicgoBridge.handlePicgo", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the markdown without touching the picgo runtime when the post has no images", async () => {
    mockGetImageBlocksByID.mockResolvedValueOnce([])
    const { handlePicgo } = usePicgoBridge()

    const md = await handlePicgo("page-1", "plain markdown")

    expect(md).toBe("plain markdown")
    expect(mockGetImageBlocksByID).toHaveBeenCalledWith("page-1")
    expect(mockGetPublisherPicgoManager).not.toHaveBeenCalled()
    expect(mockGetBlockAttrs).not.toHaveBeenCalled()
  })

  it("reads the post from siyuan when no markdown is provided and there are no images", async () => {
    mockGetImageBlocksByID.mockResolvedValueOnce([])
    mockGetPost.mockResolvedValueOnce({ markdown: "from siyuan" })
    const { handlePicgo } = usePicgoBridge()

    const md = await handlePicgo("page-1")

    expect(mockGetPost).toHaveBeenCalledWith("page-1")
    expect(md).toBe("from siyuan")
    expect(mockGetPublisherPicgoManager).not.toHaveBeenCalled()
  })

  it("uploads through the picgo runtime when the post contains images", async () => {
    mockGetImageBlocksByID.mockResolvedValueOnce([{ id: "block-1" }])
    mockGetBlockAttrs.mockResolvedValueOnce({ box: "nb" })
    const uploadMarkdownImages = vi.fn(async () => ({
      flag: true,
      hasImages: true,
      mdContent: "![a](https://bed/a.png)",
      errmsg: "",
    }))
    mockGetPublisherPicgoManager.mockResolvedValueOnce({ uploadMarkdownImages })
    const { handlePicgo } = usePicgoBridge()

    const md = await handlePicgo("page-1", "![a](assets/a.png)")

    expect(uploadMarkdownImages).toHaveBeenCalledWith("page-1", { box: "nb" }, "![a](assets/a.png)")
    expect(md).toBe("![a](https://bed/a.png)")
  })
})
