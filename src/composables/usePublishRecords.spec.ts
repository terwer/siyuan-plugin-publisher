/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  collectPublishedRecords,
  resolvePostidKey,
  usePublishRecords,
} from "~/src/composables/usePublishRecords.ts"
import { DynamicConfig, getDynPostidKey, getDynYamlKey } from "~/src/platforms/dynamicConfig.ts"

const mockGetPublishCfg = vi.hoisted(() => vi.fn())
const mockUpdateSetting = vi.hoisted(() => vi.fn())
const mockSetSingleBlockAttr = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/usePublishConfig.ts", () => ({
  usePublishConfig: () => ({ getPublishCfg: mockGetPublishCfg }),
}))
vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({ updateSetting: mockUpdateSetting }),
}))
vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({ kernelApi: { setSingleBlockAttr: mockSetSingleBlockAttr } }),
}))

const platform = (key: string, name: string, extra: Partial<DynamicConfig> = {}): DynamicConfig =>
  ({ platformKey: key, platformName: name, isSys: false, ...extra }) as DynamicConfig

describe("resolvePostidKey", () => {
  it("优先使用平台配置里持久化的 posidKey", () => {
    expect(resolvePostidKey({ posidKey: "custom-legacy-post-id" }, "custom_Zhihu")).toBe("custom-legacy-post-id")
  })

  it("配置里没有 posidKey 时回退统一规则，避免漏掉已有记录", () => {
    expect(resolvePostidKey({}, "custom_Zhihu")).toBe(getDynPostidKey("custom_Zhihu"))
    expect(resolvePostidKey(undefined, "custom_Zhihu")).toBe("custom-custom_Zhihu-post-id")
  })
})

describe("collectPublishedRecords", () => {
  it("按平台配置拆分已发布记录与可关联候选", () => {
    const setting = {
      "doc-1": { "custom-custom_Juejin-post-id": "juejin-1" },
      custom_Juejin: { posidKey: "custom-custom_Juejin-post-id", blogName: "后端" },
      custom_Zhihu: {},
    }
    const overview = collectPublishedRecords(setting, "doc-1", [
      platform("custom_Juejin", "掘金"),
      platform("custom_Zhihu", "知乎"),
    ])

    expect(overview.records).toHaveLength(1)
    expect(overview.records[0]).toMatchObject({ platformKey: "custom_Juejin", postid: "juejin-1", accountLabel: "后端" })
    expect(overview.candidates).toHaveLength(1)
    expect(overview.candidates[0]).toMatchObject({ platformKey: "custom_Zhihu", postid: "" })
  })

  it("内置平台与没有文档时不出记录", () => {
    expect(collectPublishedRecords({}, "", [platform("custom_Zhihu", "知乎")]).records).toHaveLength(0)

    const overview = collectPublishedRecords({ "doc-1": {} }, "doc-1", [
      platform("fs_LocalSystem", "本地笔记", { isSys: true }),
    ])
    expect(overview.records).toHaveLength(0)
    expect(overview.candidates).toHaveLength(0)
  })
})

describe("usePublishRecords", () => {
  const makePublishCfg = () => ({
    setting: {
      "doc-1": { "custom-custom_Juejin-post-id": "juejin-1", "custom-slug": "slug-1" },
      custom_Juejin: { posidKey: "custom-custom_Juejin-post-id" },
    },
    dynamicConfigArray: [platform("custom_Juejin", "掘金")],
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPublishCfg.mockResolvedValue(makePublishCfg())
    mockUpdateSetting.mockResolvedValue(undefined)
    mockSetSingleBlockAttr.mockResolvedValue(true)
  })

  it("读取当前文档的发布记录", async () => {
    const { load } = usePublishRecords()
    const overview = await load("doc-1")

    expect(overview.records).toHaveLength(1)
    expect(overview.records[0].postid).toBe("juejin-1")
  })

  it("保存文章 ID 时写入设置并去空格", async () => {
    const { save } = usePublishRecords()
    await save("doc-1", "custom-custom_Juejin-post-id", " juejin-2 ")

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
    const saved = mockUpdateSetting.mock.calls[0][0]
    expect(saved["doc-1"]["custom-custom_Juejin-post-id"]).toBe("juejin-2")
    // 别名等其它字段保留
    expect(saved["doc-1"]["custom-slug"]).toBe("slug-1")
  })

  it("文章 ID 为空时拒绝保存", async () => {
    const { save } = usePublishRecords()
    await expect(save("doc-1", "custom-custom_Juejin-post-id", "  ")).rejects.toThrow()
    expect(mockUpdateSetting).not.toHaveBeenCalled()
  })

  it("解绑只清理本地记录与平台属性，平台上的文章不受影响", async () => {
    const { unbind } = usePublishRecords()
    const yamlCleared = await unbind("doc-1", "custom_Juejin", "custom-custom_Juejin-post-id")

    expect(yamlCleared).toBe(true)
    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
    const saved = mockUpdateSetting.mock.calls[0][0]
    expect(saved["doc-1"]["custom-custom_Juejin-post-id"]).toBeUndefined()
    expect(saved["doc-1"]["custom-slug"]).toBe("slug-1")
    expect(mockSetSingleBlockAttr).toHaveBeenCalledWith("doc-1", getDynYamlKey("custom_Juejin"), "")
  })

  it("平台属性清理失败时记录仍然解绑", async () => {
    mockSetSingleBlockAttr.mockRejectedValue(new Error("kernel down"))
    const { unbind } = usePublishRecords()

    const yamlCleared = await unbind("doc-1", "custom_Juejin", "custom-custom_Juejin-post-id")
    expect(yamlCleared).toBe(false)
    expect(mockUpdateSetting).toHaveBeenCalledTimes(1)
  })
})
