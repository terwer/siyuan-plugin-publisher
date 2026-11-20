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
import PublishRecords from "~/src/ui/components/settings/PublishRecords.vue"

const mockLoad = vi.hoisted(() => vi.fn())
const mockSave = vi.hoisted(() => vi.fn())
const mockUnbind = vi.hoisted(() => vi.fn())
const mockGetBlockByID = vi.hoisted(() => vi.fn())
const mockGetSiyuanPageId = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/usePublishRecords.ts", () => ({
  usePublishRecords: () => ({ load: mockLoad, save: mockSave, unbind: mockUnbind }),
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
    emits: ["update:modelValue"],
    template:
      '<input class="el-input-stub" :value="modelValue" :placeholder="placeholder" ' +
      '@input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
  "el-button": {
    inheritAttrs: false,
    props: ["disabled", "loading", "type", "plain", "size"],
    emits: ["click"],
    template: '<button class="el-button-stub" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  },
  "el-select": {
    props: ["modelValue", "placeholder"],
    emits: ["update:modelValue"],
    template:
      '<select class="el-select-stub" :value="modelValue" ' +
      '@change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>',
  },
  "el-option": {
    props: ["label", "value"],
    template: '<option class="el-option-stub" :value="value">{{ label }}</option>',
  },
  "el-alert": { props: ["title"], template: '<div class="el-alert-stub">{{ title }}</div>' },
  "el-skeleton": { template: '<div class="el-skeleton-stub" />' },
}

/** 记录：掘金已发布，知乎已发布，语雀未发布（可作为关联候选） */
function makeOverview() {
  return {
    records: [
      {
        platformKey: "custom_Juejin",
        platformName: "掘金",
        platformIcon: "",
        posidKey: "custom-custom_Juejin-post-id",
        postid: "juejin-existing",
      },
      {
        platformKey: "custom_Zhihu",
        platformName: "知乎",
        platformIcon: "",
        posidKey: "custom-custom_Zhihu-post-id",
        postid: "zhihu-existing",
      },
    ],
    candidates: [
      {
        platformKey: "custom_Yuque",
        platformName: "语雀",
        platformIcon: "",
        posidKey: "custom-custom_Yuque-post-id",
        postid: "",
      },
    ],
  }
}

function mountPanel(docId = "doc-1") {
  return mount(PublishRecords, {
    props: { docId },
    global: { plugins: [i18n], stubs },
  })
}

const buttonByText = (wrapper: ReturnType<typeof mountPanel>, text: string) =>
  wrapper.findAll("button").find((b) => b.text().trim() === text)

describe("PublishRecords", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLoad.mockResolvedValue(makeOverview())
    mockSave.mockResolvedValue(undefined)
    mockUnbind.mockResolvedValue(true)
    mockGetBlockByID.mockResolvedValue({ content: "测试文档" })
    mockGetSiyuanPageId.mockResolvedValue("doc-1")
    mockSiyuanWindow.mockReturnValue({ document: {} })
    mockGetMainWindowPageId.mockReturnValue(undefined)
  })

  it("只列出已有发布记录的平台，未发布的平台不占列表", async () => {
    const wrapper = mountPanel()
    await flushPromises()

    const rows = wrapper.findAll(".syp-records-item")
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain("掘金")
    expect(rows[0].text()).toContain("juejin-existing")
    expect(rows.map((row) => row.text()).join(" ")).not.toContain("语雀")
    // 候选平台收进「关联已有文章」入口
    expect(wrapper.text()).toContain(zhCN["records.associate.entry"])
  })

  it("编辑时可以就地修改文章 ID 并保存", async () => {
    const wrapper = mountPanel()
    await flushPromises()

    await buttonByText(wrapper, zhCN["records.action.edit"])!.trigger("click")
    const input = wrapper.find("input.syp-records-row__input")
    expect(input.exists()).toBe(true)
    await input.setValue("juejin-new-id")
    await buttonByText(wrapper, zhCN["records.action.save"])!.trigger("click")
    await flushPromises()

    expect(mockSave).toHaveBeenCalledTimes(1)
    expect(mockSave.mock.calls[0]).toEqual(["doc-1", "custom-custom_Juejin-post-id", "juejin-new-id"])
    expect(wrapper.findAll(".syp-records-item")[0].text()).toContain("juejin-new-id")
  })

  it("解绑需要二次确认，确认后记录消失并回到可关联列表", async () => {
    const wrapper = mountPanel()
    await flushPromises()

    await buttonByText(wrapper, zhCN["records.action.unbind"])!.trigger("click")
    expect(wrapper.text()).toContain("解绑后")

    await buttonByText(wrapper, zhCN["records.confirm.unbind"])!.trigger("click")
    await flushPromises()

    expect(mockUnbind).toHaveBeenCalledWith("doc-1", "custom_Juejin", "custom-custom_Juejin-post-id")
    const rows = wrapper.findAll(".syp-records-item")
    expect(rows).toHaveLength(1)
    expect(rows[0].text()).toContain("知乎")
  })

  it("平台属性清理失败时仍解绑，并给出提示", async () => {
    mockUnbind.mockResolvedValue(false)
    const wrapper = mountPanel()
    await flushPromises()

    await buttonByText(wrapper, zhCN["records.action.unbind"])!.trigger("click")
    await buttonByText(wrapper, zhCN["records.confirm.unbind"])!.trigger("click")
    await flushPromises()

    expect(wrapper.findAll(".syp-records-item")).toHaveLength(1)
  })

  it("同名平台用账号名区分，避免改错账号", async () => {
    mockLoad.mockResolvedValue({
      records: [
        {
          platformKey: "custom_Yuqueweb",
          platformName: "语雀网页版",
          platformIcon: "",
          accountLabel: "公共知识库",
          posidKey: "custom-custom_Yuqueweb-post-id",
          postid: "1",
        },
        {
          platformKey: "custom_Yuqueweb-z1awjla",
          platformName: "语雀网页版",
          platformIcon: "",
          accountLabel: "",
          posidKey: "custom-custom_Yuqueweb-z1awjla-post-id",
          postid: "2",
        },
      ],
      candidates: [],
    })
    const wrapper = mountPanel()
    await flushPromises()

    const rows = wrapper.findAll(".syp-records-item")
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain("公共知识库")
    expect(rows[1].text()).toContain("custom_Yuqueweb-z1awjla")
  })

  it("没有发布记录时展示空态，且不出现关联入口", async () => {
    mockLoad.mockResolvedValue({ records: [], candidates: [] })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.findAll(".syp-records-item")).toHaveLength(0)
    expect(wrapper.text()).toContain(zhCN["records.empty.title"])
    expect(wrapper.text()).not.toContain(zhCN["records.associate.entry"])
  })

  it("可以把平台上已有的旧文章关联回来", async () => {
    mockLoad.mockResolvedValue({ records: [], candidates: makeOverview().records.slice(0, 1) })
    const wrapper = mountPanel()
    await flushPromises()

    await wrapper.find(".syp-records-associate__toggle").trigger("click")
    await flushPromises()

    await wrapper.find(".el-select-stub").setValue("custom_Juejin")
    await wrapper.find("input.syp-records-associate__postid").setValue("existing-post-id")
    await buttonByText(wrapper, zhCN["records.associate.action"])!.trigger("click")
    await flushPromises()

    expect(mockSave).toHaveBeenCalledWith("doc-1", "custom-custom_Juejin-post-id", "existing-post-id")
    expect(wrapper.findAll(".syp-records-item")).toHaveLength(1)
    expect(wrapper.findAll(".syp-records-item")[0].text()).toContain("existing-post-id")
  })

  it("未传 docId 时自行获取当前文档", async () => {
    const wrapper = mountPanel("")
    await flushPromises()

    expect(mockGetSiyuanPageId).toHaveBeenCalled()
    expect(wrapper.findAll(".syp-records-item")).toHaveLength(2)
  })

  it("设备 API 取不到时，回退读取当前活动文档", async () => {
    mockGetSiyuanPageId.mockResolvedValue("")
    mockGetMainWindowPageId.mockReturnValue("active-doc-id")

    const wrapper = mountPanel("")
    await flushPromises()

    expect(mockGetMainWindowPageId).toHaveBeenCalled()
    expect(wrapper.text()).toContain(zhCN["records.doc.label"])
    expect(wrapper.text()).not.toContain(zhCN["records.noDoc"])
    expect(wrapper.findAll(".syp-records-item")).toHaveLength(2)
  })

  it("拿不到文档时提示，且不写入", async () => {
    mockGetSiyuanPageId.mockResolvedValue("")
    const wrapper = mountPanel("")
    await flushPromises()

    expect(wrapper.text()).toContain(zhCN["records.noDoc"])
    expect(wrapper.findAll(".syp-records-item")).toHaveLength(0)
    expect(mockSave).not.toHaveBeenCalled()
    expect(mockUnbind).not.toHaveBeenCalled()
  })
})
