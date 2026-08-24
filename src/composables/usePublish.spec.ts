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
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

const mockUpdatePlatformMetadata = vi.hoisted(() => vi.fn())
const mockSetSingleBlockAttr = vi.hoisted(() => vi.fn())
const mockPushErrMsg = vi.hoisted(() => vi.fn())
const mockGetPublishApi = vi.hoisted(() => vi.fn())
const mockSiyuanGetPost = vi.hoisted(() => vi.fn())

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
      getPost: mockSiyuanGetPost,
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

  it("redacts sensitive diagnostic fields in publish failure details", async () => {
    const setting: Record<string, any> = {
      "20260511000000-test": {},
    }
    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue(setting as any)
    store.updateSetting = vi.fn()

    const sensitiveError = new Error(
      "Cookie=session-secret Authorization=Bearer secret-token ctoken=secret-ctoken token=secret-token csrf=secret-csrf ticket=secret-ticket"
    )
    ;(sensitiveError as any).diagnosticMessage = JSON.stringify({
      Cookie: "session-secret",
      Authorization: "Bearer secret-token",
      ctoken: "secret-ctoken",
      token: "secret-token",
      csrf: "secret-csrf",
      ticket: "secret-ticket",
      message: "forbidden",
    })

    mockGetPublishApi.mockResolvedValue({
      preEditPost: vi.fn(async () => {
        throw sensitiveError
      }),
    })

    const doc = new Post()
    doc.title = "脱敏测试"

    const result = await usePublish().doSinglePublish(
      "custom_Yuqueweb",
      "20260511000000-test",
      createPublishCfg(setting),
      doc
    )

    expect(result.status).toBe(false)
    expect(result.errDetails).toContain("<redacted>")
    expect(result.errDetails).not.toContain("session-secret")
    expect(result.errDetails).not.toContain("secret-token")
    expect(result.errDetails).not.toContain("secret-ctoken")
    expect(result.errDetails).not.toContain("secret-csrf")
    expect(result.errDetails).not.toContain("secret-ticket")
  })
})

describe("usePublish.doInitSinglePage", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it("backs up the siyuan title when platform getPost returns an empty title (web platforms)", async () => {
    // 思源侧文档（权威源，标题/正文都应有值）
    const siyuanPost = new Post()
    siyuanPost.title = "思源标题"
    siyuanPost.markdown = "# 正文"
    siyuanPost.originalId = "orig-1"
    siyuanPost.link = "https://siyuan.local/test"
    mockSiyuanGetPost.mockResolvedValue(siyuanPost)

    // 平台侧 getPost：模拟掘金等 web 平台，不返回 title，只返回平台元数据
    const platformPost = new Post()
    platformPost.tags_slugs = "tag1,tag2"
    platformPost.cate_slugs = ["cate1"]
    mockGetPublishApi.mockResolvedValue({
      getPost: vi.fn(async () => platformPost),
      getPreviewUrl: vi.fn(async () => "https://platform.local/view/1"),
    })

    const { initPublishMethods } = usePublish()
    const publishCfg = createPublishCfg({
      "20260822111111-m260uak": { "custom-custom_Yuqueweb-post-id": "post-1" },
    })
    publishCfg.cfg.posidKey = "custom-custom_Yuqueweb-post-id"

    const { mergedPost } = await initPublishMethods.doInitSinglePage(
      "custom_Yuqueweb",
      "20260822111111-m260uak",
      MethodEnum.METHOD_EDIT,
      publishCfg
    )

    // 关键回归点：平台 getPost 未返回标题时，标题必须回退到思源标题
    expect(mergedPost.title).toBe("思源标题")
    // 平台元数据仍应保留
    expect(mergedPost.tags_slugs).toBe("tag1,tag2")
    expect(mergedPost.cate_slugs).toEqual(["cate1"])
    // 正文应来自思源
    expect(mergedPost.markdown).toBe("# 正文")
  })

  it("keeps the platform title when getPost returns a non-empty title (blog platforms)", async () => {
    const siyuanPost = new Post()
    siyuanPost.title = "思源标题"
    siyuanPost.markdown = "# 正文"
    mockSiyuanGetPost.mockResolvedValue(siyuanPost)

    const platformPost = new Post()
    platformPost.title = "远程博客标题"
    mockGetPublishApi.mockResolvedValue({
      getPost: vi.fn(async () => platformPost),
      getPreviewUrl: vi.fn(async () => "https://platform.local/view/1"),
    })

    const { initPublishMethods } = usePublish()
    const publishCfg = createPublishCfg({
      "20260822111111-m260uak": { "custom-custom_Yuqueweb-post-id": "post-1" },
    })
    publishCfg.cfg.posidKey = "custom-custom_Yuqueweb-post-id"

    const { mergedPost } = await initPublishMethods.doInitSinglePage(
      "custom_Yuqueweb",
      "20260822111111-m260uak",
      MethodEnum.METHOD_EDIT,
      publishCfg
    )

    expect(mergedPost.title).toBe("远程博客标题")
  })

  it("falls back to the siyuan tags/categories when platform getPost returns empty metadata", async () => {
    const siyuanPost = new Post()
    siyuanPost.title = "思源标题"
    siyuanPost.markdown = "# 正文"
    siyuanPost.mt_keywords = "思源标签"
    siyuanPost.categories = ["思源分类"]
    mockSiyuanGetPost.mockResolvedValue(siyuanPost)

    // 平台侧 getPost 返回空 Post：模拟 web 平台 getPost 未返回元数据/失败
    const platformPost = new Post()
    mockGetPublishApi.mockResolvedValue({
      getPost: vi.fn(async () => platformPost),
      getPreviewUrl: vi.fn(async () => "https://platform.local/view/1"),
    })

    const { initPublishMethods } = usePublish()
    const publishCfg = createPublishCfg({
      "20260822111111-m260uak": { "custom-custom_Yuqueweb-post-id": "post-1" },
    })
    publishCfg.cfg.posidKey = "custom-custom_Yuqueweb-post-id"

    const { mergedPost } = await initPublishMethods.doInitSinglePage(
      "custom_Yuqueweb",
      "20260822111111-m260uak",
      MethodEnum.METHOD_EDIT,
      publishCfg
    )

    // 平台未返回元数据时回退到思源笔记的标签/分类
    expect(mergedPost.title).toBe("思源标题")
    expect(mergedPost.mt_keywords).toBe("思源标签")
    expect(mergedPost.categories).toEqual(["思源分类"])
  })

  it("falls back to the siyuan summary when platform getPost returns an empty shortDesc/mt_excerpt", async () => {
    // 思源侧文档：摘要（摘要表单绑定的 shortDesc，以及同步的 mt_excerpt）应有值
    const siyuanPost = new Post()
    siyuanPost.title = "思源标题"
    siyuanPost.markdown = "# 正文"
    siyuanPost.shortDesc = "思源摘要"
    siyuanPost.mt_excerpt = "思源摘要"
    mockSiyuanGetPost.mockResolvedValue(siyuanPost)

    // 平台侧 getPost：模拟 web 平台，不返回摘要，只返回平台元数据
    const platformPost = new Post()
    platformPost.title = "平台标题"
    mockGetPublishApi.mockResolvedValue({
      getPost: vi.fn(async () => platformPost),
      getPreviewUrl: vi.fn(async () => "https://platform.local/view/1"),
    })

    const { initPublishMethods } = usePublish()
    const publishCfg = createPublishCfg({
      "20260822111111-m260uak": { "custom-custom_Yuqueweb-post-id": "post-1" },
    })
    publishCfg.cfg.posidKey = "custom-custom_Yuqueweb-post-id"

    const { mergedPost } = await initPublishMethods.doInitSinglePage(
      "custom_Yuqueweb",
      "20260822111111-m260uak",
      MethodEnum.METHOD_EDIT,
      publishCfg
    )

    // 平台未返回摘要时回退到思源笔记的摘要；标题平台有值则保留
    expect(mergedPost.title).toBe("平台标题")
    expect(mergedPost.shortDesc).toBe("思源摘要")
    expect(mergedPost.mt_excerpt).toBe("思源摘要")
  })
})
