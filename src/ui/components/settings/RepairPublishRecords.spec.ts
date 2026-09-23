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
import zhCN from "~/siyuan/i18n/zh_CN.json"
import RepairPublishRecords from "~/src/ui/components/settings/RepairPublishRecords.vue"

const mockGetPublishCfg = vi.hoisted(() => vi.fn())
const mockUpdateSetting = vi.hoisted(() => vi.fn())
const mockGetBlockByID = vi.hoisted(() => vi.fn())
const mockGetSiyuanPageId = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({ getPublishCfg: mockGetPublishCfg }),
}))
vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({ updateSetting: mockUpdateSetting }),
}))
vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({ kernelApi: { getBlockByID: mockGetBlockByID } }),
}))
vi.mock("~/src/utils/siyuanUtils.ts", () => ({
  getSiyuanPageId: mockGetSiyuanPageId,
}))

const mockSiyuanWindow = vi.hoisted(() => vi.fn())
vi.mock("zhi-device", () => ({
  SiyuanDevice: { siyuanWindow: mockSiyuanWindow },
}))

const mockGetMainWindowPageId = vi.hoisted(() => vi.fn())
vi.mock("~/src/utils/widgetUtils.ts", () => ({
  getMainWindowPageId: mockGetMainWindowPageId,
}))

const i18n = createI18n({ legacy: false, locale: "zh_CN", messages: { zh_CN: zhCN } })

/**
 * Element Plus 桩。el-button 必须 inheritAttrs: false，
 * 否则 @click 会同时作为组件事件与原生监听触发两次。
 */
const stubs = {
  "el-input": {
    props: ["modelValue", "placeholder"],
    emits: ["update:modelValue", "change"],
    template:
      '<input class="el-input-stub" :value="modelValue" :placeholder="placeholder" ' +
      '@input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
  "el-button": {
    inheritAttrs: false,
    emits: ["click"],
    template: '<button class="el-button-stub" @click="$emit(\'click\')"><slot /></button>',
  },
  "el-alert": { props: ["title"], template: '<div class="el-alert-stub">{{ title }}</div>' },
}

/** 发布记录：掘金已有 ID，知乎为空 */
function makePublishCfg() {
  return {
    setting: {
      "doc-1": { custom_postid: "juejin-existing" },
      custom_Juejin: { posidKey: "custom_postid" },
      custom_Zhihu: { posidKey: "custom_postid" },
    },
    dynamicConfigArray: [
      { platformKey: "custom_Juejin", platformName: "掘金" },
      { platformKey: "custom_Zhihu", platformName: "知乎" },
    ],
  }
}

function mountPanel(docId = "doc-1") {
  return mount(RepairPublishRecords, {
    props: { docId },
    global: { plugins: [i18n], stubs },
  })
}

describe("RepairPublishRecords", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPublishCfg.mockResolvedValue(makePublishCfg())
    mockUpdateSetting.mockResolvedValue(undefined)
    mockGetBlockByID.mockResolvedValue({ content: "测试文档" })
    mockGetSiyuanPageId.mockResolvedValue("doc-1")
    mockSiyuanWindow.mockReturnValue({ document: {} })
    mockGetMainWindowPageId.mockReturnValue(undefined)
  })

  it("打开即列出所有平台，无需手填文档 ID", async () => {
    const wrapper = mountPanel()
    await flushPromises()

    const names = wrapper.findAll(".syp-settings-form-label").map((n) => n.text())
    const inputs = wrapper.findAll(".syp-settings-form-row input")

    // 两个平台都列出来了
    expect(inputs).toHaveLength(2)
    expect(names).toEqual(["掘金", "知乎"])
    // 已有的 ID 作为 placeholder 展示，未手填
    expect(inputs[0].attributes("placeholder")).toBe("juejin-existing")
  })

  it("未传 docId 时自行获取当前文档", async () => {
    const wrapper = mountPanel("")
    await flushPromises()

    expect(mockGetSiyuanPageId).toHaveBeenCalled()
    expect(wrapper.findAll(".syp-settings-form-row input")).toHaveLength(2)
  })

  it("设备 API 取不到时，回退读取当前活动文档", async () => {
    // 主窗口场景：getSiyuanPageId 无主窗口分支，只能读 DOM 里的 div.protyle
    mockGetSiyuanPageId.mockResolvedValue("")
    mockGetMainWindowPageId.mockReturnValue("active-doc-id")

    const wrapper = mountPanel("")
    await flushPromises()

    expect(mockGetMainWindowPageId).toHaveBeenCalled()
    expect(wrapper.text()).toContain(zhCN["repair.doc.label"])
    expect(wrapper.text()).not.toContain(zhCN["repair.noDoc"])
    expect(wrapper.findAll(".syp-settings-form-row input")).toHaveLength(2)
  })

  it("一次保存即可写入所有改动的平台", async () => {
    const wrapper = mountPanel()
    await flushPromises()

    const inputs = wrapper.findAll(".syp-settings-form-row input")
    await inputs[1].setValue("zhihu-new-id")

    const saveButton = wrapper.findAll("button").find((b) => b.text().includes("保存修复"))
    await saveButton!.trigger("click")
    await flushPromises()

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
    const saved = mockUpdateSetting.mock.calls[0][0]
    // 改动的写入
    expect(saved["doc-1"].custom_postid).toBe("zhihu-new-id")
  })

  it("留空的平台保持原值", async () => {
    const wrapper = mountPanel()
    await flushPromises()

    const saveButton = wrapper.findAll("button").find((b) => b.text().includes("保存修复"))
    await saveButton!.trigger("click")
    await flushPromises()

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
    const saved = mockUpdateSetting.mock.calls[0][0]
    expect(saved["doc-1"].custom_postid).toBe("juejin-existing")
  })

  it("没有发布记录时给出提示，且不渲染平台行", async () => {
    mockGetPublishCfg.mockResolvedValue({
      setting: {},
      dynamicConfigArray: [{ platformKey: "custom_Juejin", platformName: "掘金" }],
    })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.findAll(".syp-settings-form-row")).toHaveLength(0)
    expect(wrapper.text()).toContain(zhCN["repair.empty"])
  })

  it("拿不到文档时提示，且不写入", async () => {
    mockGetSiyuanPageId.mockResolvedValue("")
    const wrapper = mountPanel("")
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["repair.noDoc"])
    const saveButton = wrapper.findAll("button").find((b) => b.text().includes("保存修复"))
    expect(saveButton).toBeUndefined()
    expect(mockUpdateSetting).not.toHaveBeenCalled()
  })
})