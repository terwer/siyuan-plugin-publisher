/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { flushPromises, mount } from "@vue/test-utils"
import { createI18n } from "vue-i18n"
import { beforeEach, describe, expect, it, vi } from "vitest"
import PublishPlatformSettingList from "~/src/components/set/publish/platform/PublishPlatformSettingList.vue"
import { AuthMode, PlatformType, setDynamicJsonCfg, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockGetSetting = vi.hoisted(() => vi.fn())
const mockUpdateSetting = vi.hoisted(() => vi.fn())
const mockDeleteKey = vi.hoisted(() => vi.fn())
const mockIsInSiyuanOrSiyuanNewWin = vi.hoisted(() => vi.fn())
const mockIsInChromeExtension = vi.hoisted(() => vi.fn())
const mockOpenBrowserWindow = vi.hoisted(() => vi.fn())
const mockConfirm = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({
    getSetting: mockGetSetting,
    updateSetting: mockUpdateSetting,
    deleteKey: mockDeleteKey,
  }),
}))

vi.mock("~/src/composables/usePlatformDefine.ts", () => ({
  usePlatformDefine: () => ({
    getPrePlatformKeys: () => ["custom_Yuqueweb-test"],
  }),
}))

vi.mock("~/src/composables/useSiyuanDevice.ts", () => ({
  useSiyuanDevice: () => ({
    isInSiyuanOrSiyuanNewWin: mockIsInSiyuanOrSiyuanNewWin,
    isInChromeExtension: mockIsInChromeExtension,
  }),
}))

vi.mock("~/src/utils/widgetUtils.ts", () => ({
  openBrowserWindow: mockOpenBrowserWindow,
}))

vi.mock("element-plus", async (importOriginal) => {
  const actual = await importOriginal<typeof import("element-plus")>()
  return {
    ...actual,
    ElMessageBox: {
      confirm: mockConfirm,
    },
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  }
})

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const createDynCfg = () =>
  ({
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Custom_Yuqueweb,
    platformKey: "custom_Yuqueweb-test",
    platformName: "语雀网页版",
    platformIcon: "",
    authMode: AuthMode.WEBSITE,
    authUrl: "https://www.yuque.com/login",
    domain: "www.yuque.com",
    cookieLimit: false,
    isEnabled: true,
    isAuth: false,
    isSys: false,
  }) as DynamicConfig

const mountList = async () => {
  const dynCfg = createDynCfg()
  mockGetSetting.mockResolvedValue({
    [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
    [dynCfg.platformKey]: {},
  })

  const wrapper = mount(PublishPlatformSettingList, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "zh_CN",
          messages: { zh_CN: zhCN },
        }),
      ],
      stubs: {
        "el-row": { template: "<div><slot /></div>" },
        "el-col": { template: "<div><slot /></div>" },
        "el-icon": { template: "<i><slot /></i>" },
        "el-badge": { template: "<div><slot /></div>" },
        "el-text": { template: "<button type='button' @click='$emit(\"click\")'><slot /></button>" },
        "el-switch": { template: "<input type='checkbox' />" },
        "el-button": { template: "<button type='button' @click='$emit(\"click\")'><slot /></button>" },
        "el-alert": { props: ["title"], template: "<div>{{ title }}</div>" },
        "el-dialog": { template: "<div><slot /></div>" },
        "cookie-setting": { template: "<div />" },
      },
    },
  })
  await flushPromises()
  return wrapper
}

describe("PublishPlatformSettingList V1 web authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConfirm.mockResolvedValue(undefined)
    mockUpdateSetting.mockResolvedValue(undefined)
    mockIsInSiyuanOrSiyuanNewWin.mockReturnValue(true)
    mockIsInChromeExtension.mockReturnValue(false)
  })

  it("keeps the classic authorize action wired to the old open-browser flow", async () => {
    const wrapper = await mountList()

    const texts = wrapper.findAll("button").map((button) => button.text())
    expect(texts).toContain("授权")
    const authButton = wrapper.findAll("button").find((button) => button.text() === "授权")
    expect(authButton).toBeTruthy()
    await authButton!.trigger("click")
    await flushPromises()

    expect(mockConfirm).toHaveBeenCalled()
    expect(mockOpenBrowserWindow).toHaveBeenCalledWith("https://www.yuque.com/login")
  })
})
