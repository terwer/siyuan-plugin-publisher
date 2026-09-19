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
import V2PicBedSettings from "~/src/components/v2/settings/V2PicBedSettings.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockSetting = vi.hoisted(() => ({
  "dynamic-config": JSON.stringify({
    totalCfg: [
      {
        platformType: "Metaweblog",
        subPlatformType: "Cnblogs",
        platformKey: "metaweblog_Cnblogs",
        platformName: "博客园",
        isEnabled: true,
      },
    ],
  }),
  metaweblog_Cnblogs: JSON.stringify({
    picbedService: "none",
  }),
}))
const mockUpdateSetting = vi.hoisted(() => vi.fn())
const mockGetCfg = vi.hoisted(() => vi.fn())
const mockCheckRuntime = vi.hoisted(() => vi.fn())
const mockManager = vi.hoisted(() => ({
  auditUploaderSchemas: vi.fn(() => ({ ok: true, errors: [] })),
  listUploaders: vi.fn(() => [{ id: "github", name: "GitHub", builtin: true, schemaAvailable: true }]),
  getCurrentUploader: vi.fn(() => "github"),
  getUploaderSchema: vi.fn(() => ({
    id: "github",
    name: "GitHub",
    builtin: true,
    fields: [
      {
        name: "repo",
        type: "input",
        label: "Repo",
        required: true,
        valuePath: "picBed.github.repo",
        sensitive: false,
      },
      {
        name: "token",
        type: "password",
        label: "Token",
        required: true,
        valuePath: "picBed.github.token",
        sensitive: true,
      },
    ],
  })),
  getUploaderConfig: vi.fn(() => ({ repo: "terwer/demo", token: "old-token" })),
  saveUploaderConfig: vi.fn(() => ({ ok: true, uploaderId: "github", errors: [] })),
}))

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({
    getSetting: vi.fn(async () => mockSetting),
    updateSetting: mockUpdateSetting,
  }),
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    siyuanConfig: { apiUrl: "http://127.0.0.1:6806", password: "", cookie: "" },
    kernelApi: { getBlockAttrs: vi.fn() },
    blogApi: { getPost: vi.fn() },
  }),
}))

vi.mock("~/src/adaptors", () => ({
  default: {
    getCfg: mockGetCfg,
  },
}))

vi.mock("~/src/composables/usePublisherPicgoManager.ts", () => ({
  checkPublisherPicgoRuntime: mockCheckRuntime,
  formatPublisherPicgoError: (error: any) => ({
    summary: error?.message || String(error),
    details: error?.stack || error?.message || String(error),
    fieldErrors: error?.errors || [],
  }),
}))

const mountPicbed = () =>
  mount(V2PicBedSettings, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "zh_CN",
          messages: { zh_CN: zhCN },
        }),
      ],
      stubs: {
        SypErrorDetailsPanel: true,
      },
    },
  })

describe("V2PicBedSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSetting.metaweblog_Cnblogs = JSON.stringify({ picbedService: "none" })
    mockGetCfg.mockResolvedValue({
      picbedService: "none",
      picgoPicbedSupported: true,
      bundledPicbedSupported: true,
    })
    mockManager.saveUploaderConfig.mockReturnValue({ ok: true, uploaderId: "github", errors: [] })
    mockCheckRuntime.mockResolvedValue({
      ok: true,
      manager: mockManager,
      summary: "ready",
      details: "",
      fieldErrors: [],
    })
  })

  it("renders Publisher-owned PicGo headless UI without standalone plugin install gating", async () => {
    const wrapper = mountPicbed()
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["v2.picbed.picgoConfig.title"])
    expect(wrapper.text()).toContain("GitHub")
    expect(wrapper.text()).toContain("默认图床")
    expect(wrapper.text()).not.toContain("未安装")
    expect(wrapper.text()).not.toContain("集市安装")
    expect(mockManager.listUploaders).toHaveBeenCalled()
    expect(mockManager.getUploaderSchema).toHaveBeenCalledWith("github")
  })

  it("renders the settings shell immediately while PicGo runtime loads in the background", async () => {
    let resolveRuntime!: (value: any) => void
    mockCheckRuntime.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRuntime = resolve
      })
    )

    const wrapper = mountPicbed()
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["v2.picbed.picgoConfig.title"])
    expect(wrapper.text()).toContain(zhCN["v2.picbed.picgoConfig.loadingTitle"])
    expect(wrapper.text()).toContain(zhCN["v2.picbed.platformPreference.collapsedTitle"])
    expect(mockGetCfg).not.toHaveBeenCalled()

    resolveRuntime({
      ok: true,
      manager: mockManager,
      summary: "ready",
      details: "",
      fieldErrors: [],
    })
    await flushPromises()

    expect(wrapper.text()).toContain("GitHub")
  })

  it("saves uploader config through the PicGo lib without rewriting platform preference", async () => {
    const wrapper = mountPicbed()
    await flushPromises()

    const repoInput = wrapper.find("#picgo-field-repo")
    await repoInput.setValue("terwer/changed")
    await wrapper.findAll("button").find((button) => button.text().includes("保存并设为当前"))!.trigger("click")
    await flushPromises()

    expect(mockManager.saveUploaderConfig).toHaveBeenCalledWith(
      "github",
      expect.objectContaining({ repo: "terwer/changed", token: "old-token" }),
      { setCurrent: true }
    )
    expect(mockUpdateSetting).not.toHaveBeenCalled()
  })

  it("saves platform preference without touching PicGo uploader config", async () => {
    const wrapper = mountPicbed()
    await flushPromises()

    expect(mockGetCfg).not.toHaveBeenCalled()
    await wrapper.findAll("button").find((button) => button.text().includes("查看平台偏好"))!.trigger("click")
    await flushPromises()

    const platformSelect = wrapper.find(".syp-picbed-control__select")
    await platformSelect.setValue("picgo")
    await wrapper.findAll("button").find((button) => button.text() === "保存")!.trigger("click")
    await flushPromises()

    expect(mockUpdateSetting).toHaveBeenCalled()
    expect(mockManager.saveUploaderConfig).not.toHaveBeenCalled()
  })

  it("shows field-level validation errors returned by the PicGo lib", async () => {
    mockManager.saveUploaderConfig.mockReturnValue({
      ok: false,
      uploaderId: "github",
      errors: [
        {
          code: "MISSING_REQUIRED_FIELD",
          uploaderId: "github",
          field: "token",
          message: "Missing required field token",
        },
      ],
    })

    const wrapper = mountPicbed()
    await flushPromises()
    await wrapper.findAll("button").find((button) => button.text().includes("保存并设为当前"))!.trigger("click")
    await flushPromises()

    expect(wrapper.text()).toContain("Missing required field token")
  })

  it("keeps the page usable when one platform preference fails to load", async () => {
    mockGetCfg.mockRejectedValueOnce(new TypeError("Cannot read properties of undefined (reading 'lastIndexOf')"))

    const wrapper = mountPicbed()
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["v2.picbed.picgoConfig.title"])
    expect(wrapper.text()).toContain(zhCN["v2.picbed.platformPreference.collapsedTitle"])
    expect(wrapper.text()).not.toContain(zhCN["v2.picbed.platformPreference.partialLoadFailedTitle"])
    expect(mockGetCfg).not.toHaveBeenCalled()

    await wrapper.findAll("button").find((button) => button.text().includes("查看平台偏好"))!.trigger("click")
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["v2.picbed.platformPreference.partialLoadFailedTitle"])
    expect(wrapper.text()).toContain("metaweblog_Cnblogs")
    expect(wrapper.text()).toContain("Cannot read properties of undefined")
    expect(mockManager.listUploaders).toHaveBeenCalled()
  })
})
