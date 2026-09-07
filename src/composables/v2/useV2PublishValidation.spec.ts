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
import { useV2PublishValidation } from "~/src/composables/v2/useV2PublishValidation.ts"
import { AuthMode, PlatformType, setDynamicJsonCfg, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockValidatePublish = vi.hoisted(() => vi.fn())
const mockGetAdaptor = vi.hoisted(() => vi.fn())

vi.mock("~/src/adaptors", () => ({
  default: {
    getCfg: vi.fn(async (_key: string, storedCfg: any) => storedCfg),
    getAdaptor: mockGetAdaptor,
  },
}))

const createDynCfg = (overrides: Partial<DynamicConfig> = {}) =>
  ({
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Custom_Yuqueweb,
    platformKey: "custom_Yuqueweb-test",
    platformName: "语雀网页版",
    authMode: AuthMode.WEBSITE,
    authUrl: "https://www.yuque.com/login",
    domain: "www.yuque.com",
    isEnabled: false,
    isAuth: true,
    isSys: false,
    ...overrides,
  }) as DynamicConfig

const mountHarness = (setting: Record<string, any>) => {
  let exposed!: ReturnType<typeof useV2PublishValidation>
  const Harness = defineComponent({
    setup() {
      exposed = useV2PublishValidation()
      return () => h("div")
    },
  })

  const pinia = createPinia()
  setActivePinia(pinia)
  const store = usePublishSettingStore()
  store.getSetting = vi.fn().mockResolvedValue(setting as any)
  store.updateSetting = vi.fn().mockResolvedValue(undefined as any)

  mount(Harness, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "zh_CN",
          messages: { zh_CN: zhCN },
        }),
        pinia,
      ],
    },
  })

  return { exposed, store }
}

describe("useV2PublishValidation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAdaptor.mockResolvedValue({
      getUsersBlogs: vi.fn(),
      validatePublish: mockValidatePublish,
    })
  })

  it("returns canPublish false when account is authorized but platform publish validation fails", async () => {
    const dynCfg = createDynCfg({ isAuth: true, isEnabled: false })
    const setting = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { blogid: "" },
    }
    mockValidatePublish.mockResolvedValue({ canPublish: false, reason: "请选择知识库" })
    const { exposed } = mountHarness(setting)

    const result = await exposed.validatePlatformPublish(dynCfg.platformKey)

    expect(result).toMatchObject({ canPublish: false, isAuth: true, reason: "请选择知识库" })
  })

  it("enables the account only after publish validation passes", async () => {
    const dynCfg = createDynCfg({ isAuth: true, isEnabled: false })
    const setting = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { blogid: JSON.stringify({ bookId: "1", bookSlug: "docs", login: "terwer" }) },
    }
    mockValidatePublish.mockResolvedValue({ canPublish: true })
    const { exposed, store } = mountHarness(setting)

    const result = await exposed.validatePlatformPublish(dynCfg.platformKey)
    expect(result).toMatchObject({ canPublish: true, isAuth: true })

    await exposed.enableAccountAfterPublishValidation(dynCfg.platformKey, dynCfg)

    expect(store.updateSetting).toHaveBeenCalledWith(expect.objectContaining({
      [DYNAMIC_CONFIG_KEY]: expect.objectContaining({
        totalCfg: [expect.objectContaining({ isAuth: true, isEnabled: true })],
      }),
    }))
  })
})
