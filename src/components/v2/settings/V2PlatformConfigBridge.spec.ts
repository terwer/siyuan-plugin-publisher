/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { flushPromises, mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createI18n } from "vue-i18n"
import { defineComponent, h, inject, onMounted } from "vue"
import { V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY } from "~/src/components/v2/settings/bridge/platformConfigActionBridge.ts"
import { PasswordType } from "zhi-blog-api"
import zhCN from "~/siyuan/i18n/zh_CN.json"
import V2PlatformConfigBridge from "~/src/components/v2/settings/V2PlatformConfigBridge.vue"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"

const mockGetPublishCfg = vi.hoisted(() => vi.fn())
const mockIsAutoCaptureSupported = vi.hoisted(() => vi.fn())
const mockAuthorize = vi.hoisted(() => vi.fn())
const mockLogout = vi.hoisted(() => vi.fn())
const bridgeRegistryMode = vi.hoisted(() => ({ value: "fake" as "fake" | "inject" }))
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
  expandManualEditor: vi.fn(),
  toggleManualEditor: vi.fn(),
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
    logout: mockLogout,
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

const InjectOnlyBridgeChild = defineComponent({
  name: "InjectOnlyBridgeChild",
  setup() {
    const bridge = inject(V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY)
    onMounted(() => {
      bridge?.onValidated?.({
        ok: false,
        apiStatus: false,
        errorMessage: "TypeError: i2.indexOf is not a function",
      })
    })
    return () => h("div", { class: "inject-only-bridge-child" })
  },
})

vi.mock("~/src/components/v2/settings/bridge/bridgeRegistry.ts", () => ({
  getV2BridgeComponent: () => {
    if (bridgeRegistryMode.value === "inject") {
      return InjectOnlyBridgeChild
    }
    return {
      name: "FakeCookieBridge",
      props: ["apiType", "enableOnValidated"],
      template: `
      <div class="fake-cookie-bridge" :data-enable-on-validated="enableOnValidated === '' || enableOnValidated === true ? 'true' : 'false'">
        <button class="fake-save" type="button" @click="$emit('saved', { ok: true })">save</button>
        <slot
          name="cookie-actions"
          :cfg="payload.cfg"
          :dyn-cfg="payload.dynCfg"
          :setting="payload.setting"
          :dynamic-config-array="payload.dynamicConfigArray"
          :is-manual-expanded="false"
          :toggle-manual-editor="payload.toggleManualEditor"
          :expand-manual-editor="payload.expandManualEditor"
        />
      </div>
    `,
      setup() {
        return { payload: bridgePayload }
      },
    }
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
    bridgeRegistryMode.value = "fake"
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

  it("forwards successful validation from the bridged form", async () => {
    const wrapper = await mountBridge()

    await wrapper.findComponent({ name: "FakeCookieBridge" }).vm.$emit("validated", { ok: true, apiStatus: true })

    expect(wrapper.emitted("validated")?.[0]).toEqual([{ ok: true, apiStatus: true }])
  })

  it("shows inline validation error when child uses V2 action bridge inject only", async () => {
    bridgeRegistryMode.value = "inject"
    const wrapper = await mountBridge()

    const errorBar = wrapper.find('[data-testid="syp-validation-error-bar"]')
    expect(errorBar.exists()).toBe(true)
    expect(errorBar.text()).toContain("TypeError: i2.indexOf is not a function")
    expect(wrapper.emitted("validated")?.[0]?.[0]).toMatchObject({
      ok: false,
      errorMessage: "TypeError: i2.indexOf is not a function",
    })
  })

  it("forwards validation failure with errorMessage from the bridged form", async () => {
    const wrapper = await mountBridge()

    await wrapper
      .findComponent({ name: "FakeCookieBridge" })
      .vm.$emit("validated", { ok: false, apiStatus: false, errorMessage: "TypeError: i2.indexOf is not a function" })

    expect(wrapper.emitted("validated")?.[0]).toEqual([
      { ok: false, apiStatus: false, errorMessage: "TypeError: i2.indexOf is not a function" },
    ])
  })

  it("shows inline validation error bar when validation fails", async () => {
    const wrapper = await mountBridge()

    await wrapper
      .findComponent({ name: "FakeCookieBridge" })
      .vm.$emit("validated", { ok: false, apiStatus: false, errorMessage: "Connection refused" })
    await flushPromises()

    const errorBar = wrapper.find('[data-testid="syp-validation-error-bar"]')
    expect(errorBar.exists()).toBe(true)
    expect(errorBar.text()).toContain("Connection refused")
    expect(wrapper.find('[data-testid="syp-validation-error-view-details"]').exists()).toBe(true)
  })

  it("clears inline validation error bar when validation succeeds", async () => {
    const wrapper = await mountBridge()

    // First fail
    await wrapper
      .findComponent({ name: "FakeCookieBridge" })
      .vm.$emit("validated", { ok: false, apiStatus: false, errorMessage: "Failure" })
    await flushPromises()
    expect(wrapper.find('[data-testid="syp-validation-error-bar"]').exists()).toBe(true)

    // Then succeed
    await wrapper.findComponent({ name: "FakeCookieBridge" }).vm.$emit("validated", { ok: true, apiStatus: true })
    await flushPromises()
    expect(wrapper.find('[data-testid="syp-validation-error-bar"]').exists()).toBe(false)
  })

  it("does not ask the bridged form to enable the account after validation", async () => {
    const wrapper = await mountBridge()

    expect(wrapper.find(".fake-cookie-bridge").attributes("data-enable-on-validated")).toBe("false")
  })

  it("forwards explicit save completion from the bridged form", async () => {
    const wrapper = await mountBridge()

    await wrapper.findComponent({ name: "FakeCookieBridge" }).vm.$emit("saved", { ok: true })

    expect(wrapper.emitted("saved")?.[0]).toEqual([{ ok: true }])
  })
})
