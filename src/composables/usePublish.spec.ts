/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import { Post } from "zhi-blog-api"
import { SiyuanAttr } from "zhi-siyuan-api"
import { usePublish } from "~/src/composables/usePublish.ts"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

const mockUpdatePlatformMetadata = vi.hoisted(() => vi.fn())
const mockSetSingleBlockAttr = vi.hoisted(() => vi.fn())
const mockPushErrMsg = vi.hoisted(() => vi.fn())
const mockGetPublishApi = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/usePlatformMetadataStore.ts", () => ({
  usePlatformMetadataStore: () => ({
    updatePlatformMetadata: mockUpdatePlatformMetadata,
  }),
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    isStorageViaSiyuanApi: vi.fn(() => false),
    kernelApi: {
      setSingleBlockAttr: mockSetSingleBlockAttr,
      pushErrMsg: mockPushErrMsg,
    },
    blogApi: {
      getPost: vi.fn(),
    },
  }),
}))

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({
    getPublishApi: mockGetPublishApi,
  }),
}))

vi.mock("~/src/composables/useVueI18n.ts", () => ({
  useVueI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("element-plus", () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const createPublishCfg = (setting: Record<string, any>): IPublishCfg => {
  const cfg = {
    posidKey: "custom-custom_Yuqueweb-post-id",
    blogName: "语雀网页版",
    home: "https://www.yuque.com",
  } as any

  const dynCfg = {
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Custom_Yuqueweb,
    platformKey: "custom_Yuqueweb",
    platformName: "语雀网页版",
    authMode: AuthMode.WEBSITE,
    isSys: false,
  } as DynamicConfig

  return {
    setting: setting as any,
    cfg,
    dynCfg,
  } as IPublishCfg
}

describe("usePublish.doSinglePublish", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it("persists the updated slug and changed postid after a successful edit", async () => {
    const oldPostid = JSON.stringify({
      id: "269293899",
      slug: "old-slug",
      bookId: "25033491",
      bookSlug: "note",
      login: "terwer",
      format: "markdown",
    })
    const newPostid = JSON.stringify({
      id: "269293899",
      slug: "new-slug",
      bookId: "25033491",
      bookSlug: "note",
      login: "terwer",
      format: "markdown",
    })
    const setting: Record<string, any> = {
      "20260511000000-test": {
        "custom-custom_Yuqueweb-post-id": oldPostid,
        [SiyuanAttr.Custom_slug]: "old-slug",
      },
    }
    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue(setting as any)
    store.updateSetting = vi.fn().mockImplementation(async (nextSetting: any) => {
      Object.assign(setting, nextSetting)
    })

    mockGetPublishApi.mockResolvedValue({
      preEditPost: vi.fn(async (post: Post) => post),
      editPost: vi.fn(async (_postid: string, post: Post) => {
        post.postid = newPostid
        return true
      }),
      getPreviewUrl: vi.fn(async () => "https://www.yuque.com/terwer/note/new-slug"),
    })

    const doc = new Post()
    doc.title = "新标题"
    doc.wp_slug = "new-slug"
    doc.markdown = "正文 marker"

    const result = await usePublish().doSinglePublish(
      "custom_Yuqueweb",
      "20260511000000-test",
      createPublishCfg(setting),
      doc
    )

    expect(result.status).toBe(true)
    expect(setting["20260511000000-test"]).toMatchObject({
      "custom-custom_Yuqueweb-post-id": newPostid,
      [SiyuanAttr.Custom_slug]: "new-slug",
    })
    expect(store.updateSetting).toHaveBeenCalledWith(setting)
    expect(mockSetSingleBlockAttr).toHaveBeenCalled()
  })

  it("returns user-friendly image warnings and diagnostic details separately", async () => {
    const setting: Record<string, any> = {
      "20260511000000-test": {},
    }
    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue(setting as any)
    store.updateSetting = vi.fn().mockImplementation(async (nextSetting: any) => {
      Object.assign(setting, nextSetting)
    })

    mockGetPublishApi.mockResolvedValue({
      preEditPost: vi.fn(async (post: Post) => {
        ;(post as any).imageUploadErrors = ["image.png 同步失败(使用平台图床): 语雀图片上传失败，请确认 Cookie 有效。"]
        ;(post as any).imageUploadErrorDetails = [
          "image.png 同步失败(使用平台图床): Error: Cannot find module '/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js'",
        ]
        return post
      }),
      newPost: vi.fn(async () =>
        JSON.stringify({
          id: "269293900",
          slug: "image-test",
          bookId: "25033491",
          bookSlug: "note",
          login: "terwer",
          format: "markdown",
        })
      ),
      getPreviewUrl: vi.fn(async () => "https://www.yuque.com/terwer/note/image-test"),
    })

    const doc = new Post()
    doc.title = "图片测试"
    doc.wp_slug = "image-test"
    doc.markdown = "正文 marker"

    const result = await usePublish().doSinglePublish(
      "custom_Yuqueweb",
      "20260511000000-test",
      createPublishCfg(setting),
      doc
    )

    expect(result.status).toBe(true)
    expect(result.errMsg).toContain("语雀图片上传失败")
    expect(result.errDetails).toContain("Cannot find module")
    expect(result.errDetails).toContain("/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js")
  })
})
