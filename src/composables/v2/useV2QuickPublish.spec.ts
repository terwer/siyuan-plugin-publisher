/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createPinia, setActivePinia } from "pinia"
import { createI18n } from "vue-i18n"
import { defineComponent, h } from "vue"
import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useV2QuickPublish } from "~/src/composables/v2/useV2QuickPublish.ts"
import {
  AuthMode,
  PlatformType,
  setDynamicJsonCfg,
  SubPlatformType,
  type DynamicConfig,
} from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockNotifyQuickPublish = vi.hoisted(() => vi.fn())
const mockValidatePlatformPublish = vi.hoisted(() => vi.fn())
const mockDoSinglePublish = vi.hoisted(() => vi.fn())
const mockAssignInitAttrs = vi.hoisted(() => vi.fn())
const mockGetPublishCfg = vi.hoisted(() => vi.fn())
const mockBlogGetPost = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/v2/useV2QuickPublishToast.ts", () => ({
  notifyV2QuickPublishResult: mockNotifyQuickPublish,
}))

vi.mock("~/src/composables/v2/useV2PublishValidation.ts", () => ({
  useV2PublishValidation: () => ({
    validatePlatformPublish: mockValidatePlatformPublish,
  }),
}))

vi.mock("~/siyuan/utils/widgetPageUtils.ts", () => ({
  default: {
    getPageId: vi.fn(() => "20260509120000-test"),
  },
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    isStorageViaSiyuanApi: vi.fn(() => false),
    kernelApi: {
      getBlockByID: vi.fn().mockResolvedValue({ content: "快速发布测试文档" }),
    },
    blogApi: {
      getPost: mockBlogGetPost,
    },
  }),
}))

vi.mock("~/src/composables/usePublish.ts", () => ({
  usePublish: () => ({
    doSinglePublish: mockDoSinglePublish,
    doSingleDelete: vi.fn(),
    getPostPreviewUrl: vi.fn(),
    initPublishMethods: {
      assignInitAttrs: mockAssignInitAttrs,
    },
  }),
}))

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({
    getPublishCfg: mockGetPublishCfg,
    getPublishApi: vi.fn(),
  }),
}))

vi.mock("~/src/stores/usePreferenceSettingStore.ts", () => ({
  usePreferenceSettingStore: () => ({
    getReadOnlyPublishPreferenceSetting: () => ({
      value: {
        fixTitle: false,
      },
    }),
  }),
}))

describe("useV2QuickPublish", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockValidatePlatformPublish.mockResolvedValue({ canPublish: true })
    mockBlogGetPost.mockResolvedValue({ title: "快速发布测试文档", markdown: "正文" })
    mockAssignInitAttrs.mockImplementation(async (post) => post)
    mockGetPublishCfg.mockResolvedValue({
      cfg: { posidKey: "custom-custom_Yuqueweb-post-id", blogName: "语雀网页版" },
      dynCfg: { platformKey: "custom_Yuqueweb", platformName: "语雀网页版" },
      setting: {
        "20260509120000-test": {},
      },
    })
  })

  it("keeps quick publish platform items focused on direct actions without platform descriptions", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const platform = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Yuque",
      platformName: "语雀",
      platformIcon: "<svg></svg>",
      description: "发布到语雀知识库，适合沉淀团队文档和个人笔记。",
      i18n: { description: "setting.platform.common.yuque.desc" },
      authMode: AuthMode.API,
      isEnabled: true,
      isAuth: true,
      isSys: false,
    } as DynamicConfig

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([platform]),
      "20260509120000-test": {},
    } as any)

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
        ],
      },
    })

    await quickPublish.init()

    expect(quickPublish.state.platformItems).toHaveLength(1)
    expect(quickPublish.state.platformItems[0]).toMatchObject({
      platformKey: "common_Yuque",
      platformName: "语雀",
      isAuthorized: true,
      isPublished: false,
    })
    expect("description" in quickPublish.state.platformItems[0]).toBe(false)
  })

  it("keeps enabled historical accounts visible but not publishable when publish validation fails", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const platform = {
      platformType: PlatformType.Custom,
      subPlatformType: SubPlatformType.Custom_Yuqueweb,
      platformKey: "custom_Yuqueweb-test",
      platformName: "语雀网页版",
      platformIcon: "<svg></svg>",
      authMode: AuthMode.WEBSITE,
      isEnabled: true,
      isAuth: true,
      isSys: false,
    } as DynamicConfig

    mockValidatePlatformPublish.mockResolvedValue({ canPublish: false, reason: "请选择知识库" })

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([platform]),
      "20260509120000-test": {},
    } as any)

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
        ],
      },
    })

    await quickPublish.init()

    expect(quickPublish.state.platformItems).toHaveLength(1)
    expect(quickPublish.state.platformItems[0]).toMatchObject({
      platformKey: "custom_Yuqueweb-test",
      isAuthorized: false,
      tooltipText: "请选择知识库",
    })
  })

  it("renders quick publish cards by persisted displayOrder", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const late = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Late",
      platformName: "靠后",
      authMode: AuthMode.API,
      isEnabled: true,
      isAuth: true,
      isSys: false,
      displayOrder: 20,
    } as DynamicConfig
    const early = {
      ...late,
      platformKey: "common_Early",
      platformName: "靠前",
      displayOrder: 1,
    } as DynamicConfig

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([late, early]),
      "20260509120000-test": {},
    } as any)

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: { zh_CN: zhCN },
          }),
        ],
      },
    })

    await quickPublish.init()

    expect(quickPublish.state.platformItems.map((item) => item.platformKey)).toEqual(["common_Early", "common_Late"])
  })

  it("falls back to historical config order when displayOrder is missing", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const first = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_First",
      platformName: "第一个",
      authMode: AuthMode.API,
      isEnabled: true,
      isAuth: true,
      isSys: false,
    } as DynamicConfig
    const second = {
      ...first,
      platformKey: "common_Second",
      platformName: "第二个",
    } as DynamicConfig

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([first, second]),
      "20260509120000-test": {},
    } as any)

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: { zh_CN: zhCN },
          }),
        ],
      },
    })

    await quickPublish.init()

    expect(quickPublish.state.platformItems.map((item) => item.platformKey)).toEqual(["common_First", "common_Second"])
  })

  it("keeps blocked enabled platforms visible but behind publish-ready cards", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const blockedEarly = {
      platformType: PlatformType.Custom,
      subPlatformType: SubPlatformType.Custom_Yuqueweb,
      platformKey: "custom_BlockedEarly",
      platformName: "阻塞靠前",
      authMode: AuthMode.WEBSITE,
      isEnabled: true,
      isAuth: true,
      isSys: false,
      displayOrder: 0,
    } as DynamicConfig
    const readyLate = {
      ...blockedEarly,
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_ReadyLate",
      platformName: "可发布靠后",
      authMode: AuthMode.API,
      displayOrder: 10,
    } as DynamicConfig

    mockValidatePlatformPublish.mockImplementation(async (platformKey: string) => {
      if (platformKey === "custom_BlockedEarly") {
        return { canPublish: false, reason: "请选择知识库" }
      }
      return { canPublish: true }
    })

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([blockedEarly, readyLate]),
      "20260509120000-test": {},
    } as any)

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: { zh_CN: zhCN },
          }),
        ],
      },
    })

    await quickPublish.init()

    expect(quickPublish.state.platformItems.map((item) => item.platformKey)).toEqual([
      "common_ReadyLate",
      "custom_BlockedEarly",
    ])
    expect(quickPublish.state.platformItems[1]).toMatchObject({
      isAuthorized: false,
      tooltipText: "请选择知识库",
    })
  })

  it("keeps compact warning text while preserving diagnostic details for the details button", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const platform = {
      platformType: PlatformType.Custom,
      subPlatformType: SubPlatformType.Custom_Yuqueweb,
      platformKey: "custom_Yuqueweb",
      platformName: "语雀网页版",
      authMode: AuthMode.WEBSITE,
      isEnabled: true,
      isAuth: true,
      isSys: false,
    } as DynamicConfig

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([platform]),
      "20260509120000-test": {},
    } as any)

    mockDoSinglePublish.mockResolvedValue({
      status: true,
      previewUrl: "https://www.yuque.com/terwer/note/image-test",
      errMsg: "image.png 同步失败(使用平台图床): 语雀图片上传失败，请确认 Cookie 有效。",
      errDetails:
        "image.png 同步失败(使用平台图床): Error: Cannot find module '/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js'",
    })

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: { zh_CN: zhCN },
          }),
        ],
      },
    })

    await quickPublish.init()
    await quickPublish.publishToPlatform(quickPublish.state.platformItems[0])

    expect(quickPublish.state.publishState.status).toBe("success_with_warnings")
    expect(mockNotifyQuickPublish).toHaveBeenCalled()
    expect(quickPublish.state.publishState.errMsg).toContain("语雀图片上传失败")
    expect(quickPublish.state.publishState.errDetails).toContain("Cannot find module")
    expect(quickPublish.state.publishState.errDetails).toContain("/plugins/siyuan-plugin-publisher/")
  })

  it("keeps failed publish diagnostics available for the local details panel", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const platform = {
      platformType: PlatformType.Custom,
      subPlatformType: SubPlatformType.Custom_Yuqueweb,
      platformKey: "custom_Yuqueweb",
      platformName: "语雀网页版",
      authMode: AuthMode.WEBSITE,
      isEnabled: true,
      isAuth: true,
      isSys: false,
    } as DynamicConfig

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([platform]),
      "20260509120000-test": {},
    } as any)

    mockDoSinglePublish.mockResolvedValue({
      status: false,
      errMsg: "main.opt.failure=>YuquewebRequestError: 语雀图片上传失败，请确认 Cookie 有效。",
      errDetails:
        '{"stage":"forward-proxy","transport":"siyuan-forward-proxy","status":403,"responseBodyPreview":"{\\"message\\":\\"forbidden\\"}"}',
    })

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: { zh_CN: zhCN },
          }),
        ],
      },
    })

    await quickPublish.init()
    await quickPublish.publishToPlatform(quickPublish.state.platformItems[0])

    expect(quickPublish.state.publishState.status).toBe("failed")
    expect(mockNotifyQuickPublish).toHaveBeenCalled()
    expect(quickPublish.state.publishState.errMsg).toContain("语雀图片上传失败")
    expect(quickPublish.state.publishState.errDetails).toContain("forward-proxy")
    expect(quickPublish.state.publishState.errDetails).toContain("siyuan-forward-proxy")
    expect(quickPublish.state.publishState.errDetails).toContain("403")
  })

  it("extracts remote JSON business errors into friendly summaries while preserving details", async () => {
    let quickPublish!: ReturnType<typeof useV2QuickPublish>

    const Harness = defineComponent({
      setup() {
        quickPublish = useV2QuickPublish()
        return () => h("div")
      },
    })

    const platform = {
      platformType: PlatformType.Custom,
      subPlatformType: SubPlatformType.Custom_CSDN,
      platformKey: "custom_CSDN",
      platformName: "CSDN",
      authMode: AuthMode.WEBSITE,
      isEnabled: true,
      isAuth: true,
      isSys: false,
    } as DynamicConfig

    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([platform]),
      "20260509120000-test": {},
    } as any)

    mockGetPublishCfg.mockResolvedValue({
      cfg: { posidKey: "custom-custom_CSDN-post-id", blogName: "CSDN" },
      dynCfg: { platformKey: "custom_CSDN", platformName: "CSDN" },
      setting: {
        "20260509120000-test": {},
      },
    })
    mockDoSinglePublish.mockResolvedValue({
      status: false,
      errMsg:
        'main.opt.failure=>Error: {"code":400,"traceId":"9195dc6c-ed82-4cc0-b1c3-f653e5743b26","data":null,"msg":"标题过短"}',
      errDetails:
        'Error: {"code":400,"traceId":"9195dc6c-ed82-4cc0-b1c3-f653e5743b26","data":null,"msg":"标题过短"}\n    at CsdnWebAdaptor.addPost',
    })

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: { zh_CN: zhCN },
          }),
        ],
      },
    })

    await quickPublish.init()
    await quickPublish.publishToPlatform(quickPublish.state.platformItems[0])

    expect(quickPublish.state.publishState.status).toBe("failed")
    expect(mockNotifyQuickPublish).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        status: "failed",
        platformName: "CSDN",
        errMsg: "标题过短",
      })
    )
    expect(quickPublish.state.publishState.errMsg).toBe("标题过短")
    expect(quickPublish.state.publishState.errDetails).toContain("9195dc6c-ed82-4cc0-b1c3-f653e5743b26")
    expect(quickPublish.state.publishState.errDetails).toContain("CsdnWebAdaptor.addPost")
  })
})
