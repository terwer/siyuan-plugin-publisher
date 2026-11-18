/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import { Post } from "zhi-blog-api"
import { AliasTranslator } from "zhi-common"
import { SiyuanAttr } from "zhi-siyuan-api"
import { usePublish } from "~/src/composables/usePublish.ts"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

const mockGetPublishApi = vi.hoisted(() => vi.fn())

vi.mock("~/src/adaptors", () => ({
  default: {
    getYamlAdaptor: vi.fn(),
  },
}))

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({
    getPublishCfg: vi.fn(),
    getPublishApi: mockGetPublishApi,
  }),
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    isStorageViaSiyuanApi: () => false,
    kernelApi: {
      getBlockAttrs: vi.fn(),
      getSingleBlockAttr: vi.fn(),
      setSingleBlockAttr: vi.fn(),
    },
    blogApi: { getPost: vi.fn() },
  }),
}))

vi.mock("~/src/stores/usePlatformMetadataStore.ts", () => ({
  usePlatformMetadataStore: () => ({
    updatePlatformMetadata: vi.fn(),
  }),
}))

vi.mock("~/src/ui/composables/useAppI18n.ts", () => ({
  useAppI18n: () => ({ t: (key: string) => key }),
}))

vi.mock("element-plus", () => ({
  ElMessage: { success: vi.fn(), error: vi.fn() },
}))

const PLATFORM_KEY = "custom_Haloweb"
const DOC_ID = "20260102000000-haloslug1"

const createPublishCfg = (): IPublishCfg => {
  const dynCfg = {
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Custom_Haloweb,
    platformKey: PLATFORM_KEY,
    platformName: "Halo网页版",
    authMode: AuthMode.WEBSITE,
    isSys: false,
  } as DynamicConfig

  return {
    setting: {} as any,
    cfg: {
      posidKey: `custom-${PLATFORM_KEY}-post-id`,
    } as any,
    dynCfg,
  } as IPublishCfg
}

const createDoc = () => {
  const post = new Post()
  post.title = "Halo 别名策略测试"
  post.wp_slug = ""
  return post
}

describe("usePublish.assignInitSlug", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("没有自定义别名时使用平台共享契约返回的默认别名", async () => {
    const getDefaultSlug = vi.fn().mockResolvedValue("Ab12Cd34")
    mockGetPublishApi.mockResolvedValue({ getDefaultSlug })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitSlug(createDoc(), DOC_ID, createPublishCfg())

    expect(post.wp_slug).toBe("Ab12Cd34")
    expect(getDefaultSlug).toHaveBeenCalledWith("Halo 别名策略测试")
    expect(mockGetPublishApi).toHaveBeenCalledWith(PLATFORM_KEY, expect.anything())
  })

  it("用户保存过的自定义别名优先于平台默认别名", async () => {
    const publishCfg = createPublishCfg()
    publishCfg.setting = {
      [DOC_ID]: { [SiyuanAttr.Custom_slug]: "my-custom-slug" },
    } as any

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitSlug(createDoc(), DOC_ID, publishCfg)

    expect(post.wp_slug).toBe("my-custom-slug")
    expect(mockGetPublishApi).not.toHaveBeenCalled()
  })

  it("平台没有默认别名时保持按标题生成", async () => {
    mockGetPublishApi.mockResolvedValue({
      getDefaultSlug: vi.fn().mockResolvedValue(undefined),
    })
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("title-fallback")

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitSlug(createDoc(), DOC_ID, createPublishCfg())

    expect(post.wp_slug).toBe("title-fallback")
  })

  it("读取平台默认别名异常时回退按标题生成，不阻断发布", async () => {
    mockGetPublishApi.mockRejectedValue(new Error("globalinfo unavailable"))
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("title-fallback")

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitSlug(createDoc(), DOC_ID, createPublishCfg())

    expect(post.wp_slug).toBe("title-fallback")
  })

  it("平台默认别名返回空值时回退按标题生成", async () => {
    mockGetPublishApi.mockResolvedValue({
      getDefaultSlug: vi.fn().mockResolvedValue(""),
    })
    vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("title-fallback")

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitSlug(createDoc(), DOC_ID, createPublishCfg())

    expect(post.wp_slug).toBe("title-fallback")
  })

  it("发布状态仍按原逻辑设为 publish", async () => {
    mockGetPublishApi.mockResolvedValue({
      getDefaultSlug: vi.fn().mockResolvedValue("Ab12Cd34"),
    })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitSlug(createDoc(), DOC_ID, createPublishCfg())

    expect(post.post_status).toBe("publish")
  })
})
