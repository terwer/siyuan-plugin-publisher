/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import { useV2ArticleManage } from "~/src/composables/v2/useV2ArticleManage.ts"
import { setDynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"

const mockGetSetting = vi.hoisted(() => vi.fn())
const mockGetReadOnlySiyuanSetting = vi.hoisted(() => vi.fn())
const mockBlogGetPost = vi.hoisted(() => vi.fn())
const mockKernelPushErrMsg = vi.hoisted(() => vi.fn())
const mockDoSinglePublish = vi.hoisted(() => vi.fn())
const mockAssignInitAttrs = vi.hoisted(() => vi.fn())
const mockGetPublishCfg = vi.hoisted(() => vi.fn())
const mockMessageSuccess = vi.hoisted(() => vi.fn())
const mockMessageWarning = vi.hoisted(() => vi.fn())
const mockMessageError = vi.hoisted(() => vi.fn())
const mockOpenPathOrUrl = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({ getSetting: mockGetSetting }),
}))

vi.mock("~/src/stores/useSiyuanSettingStore.ts", () => ({
  useSiyuanSettingStore: () => ({ getReadOnlySiyuanSetting: mockGetReadOnlySiyuanSetting }),
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    kernelApi: {
      pushErrMsg: mockKernelPushErrMsg,
    },
    blogApi: {
      getPost: mockBlogGetPost,
    },
  }),
}))

vi.mock("~/src/composables/usePublish.ts", () => ({
  usePublish: () => ({
    doSinglePublish: mockDoSinglePublish,
    initPublishMethods: {
      assignInitAttrs: mockAssignInitAttrs,
    },
  }),
}))

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({ getPublishCfg: mockGetPublishCfg }),
}))

vi.mock("~/src/composables/v2/useV2I18n.ts", () => ({
  useV2I18n: () => ({ t: (k: string) => k }),
}))

vi.mock("~/src/composables/v2/v2FloatingUi.ts", () => ({
  v2MessageSuccess: mockMessageSuccess,
  v2MessageWarning: mockMessageWarning,
  v2MessageError: mockMessageError,
}))

vi.mock("~/src/utils/pathUtils.ts", () => ({
  openPathOrUrl: mockOpenPathOrUrl,
}))

describe("useV2ArticleManage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetReadOnlySiyuanSetting.mockReturnValue({ value: { apiUrl: "http://127.0.0.1:6806" } })
    mockBlogGetPost.mockResolvedValue({ title: "文档", markdown: "正文" })
    mockAssignInitAttrs.mockImplementation(async (post) => post)
  })

  it("warns when there are no enabled & authorized platforms for batch publish", async () => {
    mockGetSetting.mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([
        { platformKey: "custom_Disabled", platformName: "停用", isEnabled: false, isAuth: true },
      ] as any),
    })

    const manage = useV2ArticleManage()
    await manage.publishBatchToAll("20260509120000-test")

    expect(mockDoSinglePublish).not.toHaveBeenCalled()
    expect(mockMessageWarning).toHaveBeenCalled()
  })

  it("batch publishes a document to all enabled & authorized platforms", async () => {
    mockGetSetting.mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([
        { platformKey: "common_A", platformName: "平台A", isEnabled: true, isAuth: true },
        { platformKey: "common_B", platformName: "平台B", isEnabled: true, isAuth: true },
      ] as any),
    })
    mockGetPublishCfg.mockResolvedValue({
      cfg: { posidKey: "custom-custom-test-id", blogName: "平台A" },
      dynCfg: { platformKey: "common_A", platformName: "平台A" },
      setting: {},
    })
    mockDoSinglePublish.mockResolvedValue({ status: true, previewUrl: "https://x/1" })

    const manage = useV2ArticleManage()
    await manage.publishBatchToAll("20260509120000-test")

    expect(mockDoSinglePublish).toHaveBeenCalledTimes(2)
    expect(mockMessageSuccess).toHaveBeenCalled()
    expect(mockMessageWarning).not.toHaveBeenCalled()
  })

  it("reports partial failures with details for a multi-platform batch", async () => {
    mockGetSetting.mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([
        { platformKey: "custom_A", platformName: "平台A", isEnabled: true, isAuth: true },
        { platformKey: "custom_B", platformName: "平台B", isEnabled: true, isAuth: true },
      ] as any),
    })
    mockGetPublishCfg.mockResolvedValue({
      cfg: {},
      dynCfg: { platformKey: "custom_A", platformName: "平台A" },
      setting: {},
    })
    mockDoSinglePublish.mockResolvedValueOnce({ status: true }).mockResolvedValueOnce({ status: false, errMsg: "平台B失败" })

    const manage = useV2ArticleManage()
    await manage.publishBatchToAll("20260509120000-test")

    expect(mockMessageWarning).toHaveBeenCalled()
    expect(mockKernelPushErrMsg).toHaveBeenCalled()
  })

  it("publishes a document to a single platform", async () => {
    mockGetPublishCfg.mockResolvedValue({
      cfg: {},
      dynCfg: { platformKey: "custom_A", platformName: "平台A" },
      setting: {},
    })
    mockDoSinglePublish.mockResolvedValue({ status: true, name: "平台A", previewUrl: "https://x/2" })

    const manage = useV2ArticleManage()
    await manage.publishToSinglePlatform("custom_A", "20260509120000-test")

    expect(mockDoSinglePublish).toHaveBeenCalledWith("custom_A", "20260509120000-test", expect.anything(), expect.anything())
    expect(mockMessageSuccess).toHaveBeenCalled()
  })

  it("opens the siyuan-blog preview URL for view action", async () => {
    const manage = useV2ArticleManage()
    await manage.viewArticle("20260509120000-test")

    expect(mockOpenPathOrUrl).toHaveBeenCalledWith(
      "http://127.0.0.1:6806/plugins/siyuan-blog/app/#/post/20260509120000-test",
      expect.anything()
    )
  })

  it("opens the picgo tool for a document pageId", async () => {
    const manage = useV2ArticleManage()
    await manage.openPicgo("20260509120000-test")

    expect(mockOpenPathOrUrl).toHaveBeenCalledWith(
      "http://127.0.0.1:6806/plugins/siyuan-plugin-picgo/#/?pageId=20260509120000-test",
      expect.anything()
    )
  })
})
