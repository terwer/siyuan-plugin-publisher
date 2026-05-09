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
import { AuthMode, PlatformType, setDynamicJsonCfg, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

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
      getPost: vi.fn(),
    },
  }),
}))

vi.mock("~/src/composables/usePublish.ts", () => ({
  usePublish: () => ({
    doSinglePublish: vi.fn(),
    doSingleDelete: vi.fn(),
    getPostPreviewUrl: vi.fn(),
    initPublishMethods: {
      assignInitAttrs: vi.fn(),
    },
  }),
}))

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({
    getPublishCfg: vi.fn(),
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
})
