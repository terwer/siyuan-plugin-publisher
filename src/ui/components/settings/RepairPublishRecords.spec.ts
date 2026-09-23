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

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({ getPublishCfg: mockGetPublishCfg }),
}))

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({ updateSetting: mockUpdateSetting }),
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({ kernelApi: { getBlockByID: mockGetBlockByID } }),
}))

const i18n = createI18n({ legacy: false, locale: "zh_CN", messages: { zh_CN: zhCN } })

/**
 * Element Plus 组件桩：测试环境不装载 Element Plus，
 * 这里让它们渲染插槽并把 v-model 事件透传出来，以便断言真实行为。
 */
const stubs = {
  "el-dialog": {
    props: ["modelValue", "title"],
    template: '<div class="el-dialog-stub"><slot /><slot name="footer" /></div>',
  },
  "el-input": {
    props: ["modelValue", "placeholder"],
    emits: ["update:modelValue", "change"],
    template:
      '<input class="el-input-stub" :value="modelValue" :placeholder="placeholder" ' +
      '@input="$emit(\'update:modelValue\', $event.target.value)" @change="$emit(\'change\')" />',
  },
  "el-button": {
    // 关键：inheritAttrs: false 阻止 @click 被同时挂到根元素上。
    // 若不禁用，Vue 会把 @click 既当组件自定义事件、又当原生 DOM 监听，
    // 一次点击就会触发两遍处理函数。
    inheritAttrs: false,
    emits: ["click"],
    template: '<button class="el-button-stub" @click="$emit(\'click\')"><slot /></button>',
  },
  "el-alert": {
    props: ["title"],
    template: '<div class="el-alert-stub">{{ title }}</div>',
  },
}

/** 构造发布记录：一个平台已发布，另一个尚未发布 */
function makePublishCfg() {
  return {
    setting: {
      "20260901120000-abcdefg": { custom_postid: "old-post-id" },
      custom_Juejin: { posidKey: "custom_postid" },
      custom_Zhihu: { posidKey: "custom_postid" },
    },
    dynamicConfigArray: [
      { platformKey: "custom_Juejin", platformName: "掘金" },
      { platformKey: "custom_Zhihu", platformName: "知乎" },
    ],
  }
}

function mountPanel() {
  return mount(RepairPublishRecords, {
    props: { visible: true },
    global: { plugins: [i18n], stubs },
  })
}

describe("RepairPublishRecords", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPublishCfg.mockResolvedValue(makePublishCfg())
    mockUpdateSetting.mockResolvedValue(undefined)
    mockGetBlockByID.mockResolvedValue({ content: "测试文档" })
  })

  it("填写文档 ID 后列出各平台当前的发布 ID", async () => {
    const wrapper = mountPanel()
    const input = wrapper.find("input")
    await input.setValue("20260901120000-abcdefg")
    await input.trigger("change")
    await flushPromises()

    expect(mockGetBlockByID).toHaveBeenCalledWith("20260901120000-abcdefg")
    // 两个平台各一行
    const rows = wrapper.findAll(".syp-repair-row__name")
    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.text())).toEqual(["掘金", "知乎"])
  })

  it("保存时把填写的内容写回发布记录", async () => {
    const wrapper = mountPanel()
    const input = wrapper.find("input")
    await input.setValue("20260901120000-abcdefg")
    await input.trigger("change")
    await flushPromises()

    // 该文档的发布记录里，知乎原本没有 ID，这里补上
    const inputs = wrapper.findAll(".syp-repair-row input")
    await inputs[1].setValue("new-zhihu-id")

    const saveButton = wrapper.findAll("button").find((b) => b.text().includes("保存修复"))
    expect(saveButton).toBeTruthy()
    await saveButton!.trigger("click")
    await flushPromises()

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
    const saved = mockUpdateSetting.mock.calls[0][0]
    expect(saved["20260901120000-abcdefg"].custom_postid).toBe("new-zhihu-id")
  })

  it("留空的平台保持原值，不被清掉", async () => {
    const wrapper = mountPanel()
    const input = wrapper.find("input")
    await input.setValue("20260901120000-abcdefg")
    await input.trigger("change")
    await flushPromises()

    // 两个平台都不改，直接保存
    const saveButton = wrapper.findAll("button").find((b) => b.text().includes("保存修复"))
    await saveButton!.trigger("click")
    await flushPromises()

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
    const saved = mockUpdateSetting.mock.calls[0][0]
    // 原本已有的值保留
    expect(saved["20260901120000-abcdefg"].custom_postid).toBe("old-post-id")
  })

  it("未填写文档 ID 时不写入配置", async () => {
    const wrapper = mountPanel()
    const saveButton = wrapper.findAll("button").find((b) => b.text().includes("保存修复"))
    await saveButton!.trigger("click")
    await flushPromises()

    expect(mockUpdateSetting).not.toHaveBeenCalled()
  })

  it("文档没有发布记录时给出提示，且不渲染平台行", async () => {
    mockGetPublishCfg.mockResolvedValue({
      setting: {},
      dynamicConfigArray: [{ platformKey: "custom_Juejin", platformName: "掘金" }],
    })
    const wrapper = mountPanel()
    const input = wrapper.find("input")
    await input.setValue("20260901120000-abcdefg")
    await input.trigger("change")
    await flushPromises()

    expect(wrapper.findAll(".syp-repair-row")).toHaveLength(0)
    expect(wrapper.text()).toContain(zhCN["preference.repair.empty"])
  })
})