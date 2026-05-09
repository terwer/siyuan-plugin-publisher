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
import { PasswordType } from "zhi-blog-api"
import V2PlatformConfigBridge from "~/src/components/v2/settings/V2PlatformConfigBridge.vue"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockGetPublishCfg = vi.hoisted(() => vi.fn())
const mockIsAutoCaptureSupported = vi.hoisted(() => vi.fn())
const mockAuthorize = vi.hoisted(() => vi.fn())
const bridgePayload = vi.hoisted(() => ({
  cfg: {
    passwordType: 2,
    password: "",
    metadata: {},
  } as any,
  dynCfg: {
    platformType: "Custom",
    subPlatformType: "Yuqueweb",
    platformKey: "custom_Yuqueweb-test",
    platformName: "语雀网页版",
    authMode: "web",
    authUrl: "https://www.yuque.com/login",
    domain: "www.yuque.com",
    isEnabled: true,
    isAuth: false,
    isSys: false,
  } as any,
  setting: {} as Record<string, any>,
  dynamicConfigArray: [] as any[],
}))

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({
    getPublishCfg: mockGetPublishCfg,
  }),
}))

vi.mock("~/src/composables/useWebCookieAuthorization.ts", () => ({
  useWebCookieAuthorization: () => ({
    isAutoCaptureSupported: mockIsAutoCaptureSupported,
    authorize: mockAuthorize,
  }),
}))

vi.mock("element-plus", () => ({
  ElMessage: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
  ElTooltip: {
    props: ["content", "disabled"],
    template: `<span class="tooltip-stub" :data-content="content" :data-disabled="String(disabled)"><slot /></span>`,
  },
}))

vi.mock("~/src/components/v2/settings/bridge/bridgeRegistry.ts", () => ({
  getV2BridgeComponent: () => ({
    name: "FakeCookieBridge",
    props: ["apiType"],
    template: `
      <div class="fake-cookie-bridge">
        <slot
          name="cookie-actions"
          :cfg="payload.cfg"
          :dyn-cfg="payload.dynCfg"
          :setting="payload.setting"
          :dynamic-config-array="payload.dynamicConfigArray"
        />
      </div>
    `,
    setup() {
      return { payload: bridgePayload }
    },
  }),
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
    isEnabled: true,
    isAuth: false,
    isSys: false,
    ...overrides,
  }) as DynamicConfig

const mountBridge = async () => {
  const wrapper = mount(V2PlatformConfigBridge, {
    props: {
      platformKey: "custom_Yuqueweb-test",
      platformName: "语雀网页版",
    },
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
  await flushPromises()
  return wrapper
}

describe("V2PlatformConfigBridge Cookie actions slot", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAutoCaptureSupported.mockReturnValue(true)
    const dynCfg = createDynCfg()
    bridgePayload.cfg = {
      passwordType: PasswordType.PasswordType_Cookie,
      password: "",
      metadata: {},
    }
    bridgePayload.dynCfg = dynCfg
    bridgePayload.setting = {}
    bridgePayload.dynamicConfigArray = [dynCfg]
    mockGetPublishCfg.mockResolvedValue({ dynCfg })
  })

  it("injects the V2 Cookie authorization panel for web Cookie platform forms", async () => {
    const wrapper = await mountBridge()

    expect(wrapper.find(".fake-cookie-bridge").exists()).toBe(true)
    expect(wrapper.find(".syp-web-cookie-auth").exists()).toBe(true)
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.title"])
  })

  it("does not show the panel when the bridged form is not a web Cookie platform", async () => {
    bridgePayload.cfg = {
      passwordType: PasswordType.PasswordType_Token,
      password: "",
      metadata: {},
    }
    bridgePayload.dynCfg = createDynCfg({ authMode: AuthMode.API })
    bridgePayload.dynamicConfigArray = [bridgePayload.dynCfg]
    mockGetPublishCfg.mockResolvedValue({ dynCfg: bridgePayload.dynCfg })

    const wrapper = await mountBridge()

    expect(wrapper.find(".fake-cookie-bridge").exists()).toBe(true)
    expect(wrapper.find(".syp-web-cookie-auth").exists()).toBe(false)
  })
})
