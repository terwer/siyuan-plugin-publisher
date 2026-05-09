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
import { defineComponent, h } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PasswordType } from "zhi-blog-api"
import V2WebCookieAuthPanel from "~/src/components/v2/settings/V2WebCookieAuthPanel.vue"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockAuthorize = vi.hoisted(() => vi.fn())
const mockIsAutoCaptureSupported = vi.hoisted(() => vi.fn())
const mockElMessage = vi.hoisted(() => ({
  success: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
}))
const mockOpenBrowserWindow = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/useWebCookieAuthorization.ts", () => ({
  useWebCookieAuthorization: () => ({
    isAutoCaptureSupported: mockIsAutoCaptureSupported,
    authorize: mockAuthorize,
  }),
}))

vi.mock("element-plus", () => ({
  ElMessage: mockElMessage,
}))

vi.mock("~/src/utils/widgetUtils.ts", () => ({
  openBrowserWindow: mockOpenBrowserWindow,
}))

const SypTooltipStub = defineComponent({
  name: "SypTooltipStub",
  props: {
    tag: { type: String, default: "span" },
    content: { type: String, default: "" },
    triggerClass: { type: String, default: "" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.tag,
        {
          ...attrs,
          class: [attrs.class, props.triggerClass, "tooltip-stub"],
          "data-content": props.content,
        },
        slots.default?.() ?? props.content
      )
  },
})

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

const mountPanel = (options?: { supported?: boolean; dynCfg?: DynamicConfig; cfg?: Record<string, any> }) => {
  mockIsAutoCaptureSupported.mockReturnValue(options?.supported ?? true)
  const cfg = {
    passwordType: PasswordType.PasswordType_Cookie,
    password: "",
    metadata: {},
    ...(options?.cfg ?? {}),
  } as any

  const wrapper = mount(V2WebCookieAuthPanel, {
    props: {
      platformKey: "custom_Yuqueweb-test",
      cfg,
      dynCfg: options?.dynCfg ?? createDynCfg(),
      setting: {},
      dynamicConfigArray: [options?.dynCfg ?? createDynCfg()],
    },
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "zh_CN",
          messages: { zh_CN: zhCN },
        }),
      ],
      stubs: {
        SypTooltip: SypTooltipStub,
      },
    },
  })

  return { wrapper, cfg }
}

describe("V2WebCookieAuthPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthorize.mockResolvedValue({ status: "success", ok: true })
  })

  it("shows the compact auto-read action in Electron and writes back Cookie after success", async () => {
    mockAuthorize.mockImplementation(async (input) => {
      input.onCookieChange("cookie-from-desktop")
      return { status: "success", ok: true }
    })
    const { wrapper, cfg } = mountPanel({ supported: true })

    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.title"])
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.status.ready"])
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.desc.ready"])
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.action.openLogin"])

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes(zhCN["v2.webCookieAuth.action.autoRead"]))!
      .trigger("click")
    await flushPromises()

    expect(mockAuthorize).toHaveBeenCalledWith(expect.objectContaining({ platformKey: "custom_Yuqueweb-test" }))
    expect(cfg.password).toBe("cookie-from-desktop")
    expect(mockElMessage.success).toHaveBeenCalledWith(zhCN["v2.webCookieAuth.message.success"])
    expect(wrapper.emitted("authorized")?.[0]).toEqual([{ status: "success", ok: true }])
  })

  it("keeps the login window action available when auto-read fails", async () => {
    mockAuthorize.mockResolvedValue({ status: "no_cookie", ok: false })
    const dynCfg = createDynCfg()
    const { wrapper } = mountPanel({ supported: true, dynCfg })

    const buttons = wrapper.findAll("button")
    expect(buttons.map((button) => button.text())).toEqual([
      `1 ${zhCN["v2.webCookieAuth.action.openLogin"]}`,
      `2 ${zhCN["v2.webCookieAuth.action.autoRead"]}`,
    ])

    await buttons
      .find((button) => button.text().includes(zhCN["v2.webCookieAuth.action.autoRead"]))!
      .trigger("click")
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.status.retry"])
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.desc.noCookie"])
    expect(mockElMessage.warning).toHaveBeenCalledWith(zhCN["v2.webCookieAuth.message.noCookie"])

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes(zhCN["v2.webCookieAuth.action.openLogin"]))!
      .trigger("click")

    expect(mockOpenBrowserWindow).toHaveBeenCalledWith(dynCfg.authUrl, dynCfg, undefined, undefined, false, true)
  })

  it("uses a low-noise manual path when auto-read is unavailable", async () => {
    const { wrapper } = mountPanel({ supported: false })

    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.status.manual"])
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.desc.unsupported"])
    expect(wrapper.text()).toContain(zhCN["v2.webCookieAuth.manual.enabled"])
    expect(wrapper.find("button").exists()).toBe(false)

    await wrapper.find(".syp-web-cookie-auth__action.is-static").trigger("click")
    await flushPromises()
    expect(mockAuthorize).not.toHaveBeenCalled()
  })

  it("does not render on non web-cookie platforms", () => {
    const { wrapper } = mountPanel({
      supported: true,
      dynCfg: createDynCfg({ authMode: AuthMode.API }),
      cfg: { passwordType: PasswordType.PasswordType_Token },
    })

    expect(wrapper.find(".syp-web-cookie-auth").exists()).toBe(false)
  })
})
