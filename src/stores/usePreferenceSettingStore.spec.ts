/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import { PublishPreferenceCfg } from "~/src/models/publishPreferenceCfg.ts"

const mockWindow = vi.hoisted(() => ({ siyuan: { config: { ai: {} as any } } }))
// 不引入 ref（vi.hoisted 早于 import），改用普通带 .value 的对象模拟 useCommonLocalStorage 返回
const storeRef = vi.hoisted(() => ({ value: null as any }))

vi.mock("zhi-device", () => ({
  SiyuanDevice: { siyuanWindow: () => mockWindow },
}))

vi.mock("~/src/stores/common/useCommonLocalStorage.ts", () => ({
  default: () => storeRef,
}))

vi.mock("~/src/utils/appLogger.ts", () => ({
  createAppLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}))

interface MockModel {
  id: string
  name: string
  enabled: boolean
}

interface MockProvider {
  id: string
  displayName?: string
  enabled: boolean
  apiKey: string
  baseURL: string
  protocol: string
  models: MockModel[]
}

const setAiConfig = (providers: MockProvider[], agentModelId?: string) => {
  mockWindow.siyuan.config.ai = { providers, agent: { modelId: agentModelId } } as any
  storeRef.value = new PublishPreferenceCfg() as any
}

describe("usePreferenceSettingStore (SiYuan providers-based AI config)", () => {
  beforeEach(() => {
    storeRef.value = new PublishPreferenceCfg() as any
  })

  it("reads enabled providers and backfills config from agent.modelId", async () => {
    const { usePreferenceSettingStore } = await import("~/src/stores/usePreferenceSettingStore.ts")
    setAiConfig(
      [
        {
          id: "prov-a",
          displayName: "OpenCode GO",
          enabled: true,
          apiKey: "sk-a",
          baseURL: "https://opencode.ai/zen/go/v1",
          protocol: "openai",
          models: [
            { id: "model-a", name: "deepseek-v4-flash", enabled: true },
            { id: "model-b", name: "deepseek-v4-pro", enabled: true },
          ],
        },
        { id: "prov-b", enabled: false, apiKey: "sk-b", baseURL: "https://b", protocol: "openai", models: [{ id: "model-x", name: "x", enabled: true }] },
      ],
      "model-b"
    )

    const { getPublishPreferenceSetting } = usePreferenceSettingStore()
    const pref = getPublishPreferenceSetting()

    expect(pref.value.experimentalUseSiyuanNoteAIConfig).toBe(true)
    expect(pref.value.experimentalAICode).toBe("sk-a")
    expect(pref.value.experimentalAIBaseUrl).toBe("https://opencode.ai/zen/go/v1")
    expect(pref.value.experimentalAIApiModel).toBe("deepseek-v4-pro")
    expect(pref.value.experimentalSisyuanAiActiveModelId).toBe("model-b")

    const providers = usePreferenceSettingStore().getSisyuanAiProviders()
    expect(providers).toHaveLength(1)
    expect(providers[0].displayName).toBe("OpenCode GO")
    expect(providers[0].models.map((m) => m.id)).toEqual(["model-a", "model-b"])
  })

  it("falls back to the first enabled provider/model when agent.modelId is missing", async () => {
    const { usePreferenceSettingStore } = await import("~/src/stores/usePreferenceSettingStore.ts")
    setAiConfig([
      {
        id: "prov-a",
        displayName: "OpenCode GO",
        enabled: true,
        apiKey: "sk-a",
        baseURL: "https://opencode.ai/zen/go/v1",
        protocol: "openai",
        models: [{ id: "model-a", name: "deepseek-v4-flash", enabled: true }],
      },
    ])

    const { getPublishPreferenceSetting } = usePreferenceSettingStore()
    const pref = getPublishPreferenceSetting()

    expect(pref.value.experimentalUseSiyuanNoteAIConfig).toBe(true)
    expect(pref.value.experimentalSisyuanAiActiveModelId).toBe("model-a")
    expect(pref.value.experimentalAIApiModel).toBe("deepseek-v4-flash")
  })

  it("falls back to an enabled provider with apiKey when the agent.modelId provider has no key", async () => {
    const { usePreferenceSettingStore } = await import("~/src/stores/usePreferenceSettingStore.ts")
    setAiConfig(
      [
        {
          id: "prov-openai",
          displayName: "OpenAI",
          enabled: true,
          apiKey: "",
          baseURL: "https://api.openai.com/v1",
          protocol: "openai",
          models: [{ id: "gpt", name: "gpt-3.5-turbo", enabled: true }],
        },
        {
          id: "prov-go",
          displayName: "OpenCode GO",
          enabled: true,
          apiKey: "sk-x",
          baseURL: "https://opencode.ai/zen/go/v1",
          protocol: "openai",
          models: [
            { id: "m-flash", name: "deepseek-v4-flash", enabled: true },
            { id: "m-pro", name: "deepseek-v4-pro", enabled: true },
          ],
        },
      ],
      "gpt"
    )

    const { getPublishPreferenceSetting } = usePreferenceSettingStore()
    const pref = getPublishPreferenceSetting()

    expect(pref.value.experimentalUseSiyuanNoteAIConfig).toBe(true)
    expect(pref.value.experimentalSisyuanAiActiveModelId).toBe("m-flash")
    expect(pref.value.experimentalAICode).toBe("sk-x")
    expect(pref.value.experimentalAIBaseUrl).toBe("https://opencode.ai/zen/go/v1")
  })

  it("does not enable SiYuan config when there are no enabled providers", async () => {
    const { usePreferenceSettingStore } = await import("~/src/stores/usePreferenceSettingStore.ts")
    setAiConfig([
      { id: "prov-a", enabled: false, apiKey: "sk-a", baseURL: "https://a", protocol: "openai", models: [{ id: "model-a", name: "a", enabled: true }] },
    ])

    const { getPublishPreferenceSetting } = usePreferenceSettingStore()
    const pref = getPublishPreferenceSetting()

    expect(pref.value.experimentalUseSiyuanNoteAIConfig).toBe(false)
    expect(usePreferenceSettingStore().getSisyuanAiProviders()).toHaveLength(0)
  })

  it("selectSisyuanAiModel backfills config for the chosen model", async () => {
    const { usePreferenceSettingStore } = await import("~/src/stores/usePreferenceSettingStore.ts")
    setAiConfig([
      {
        id: "prov-a",
        displayName: "OpenCode GO",
        enabled: true,
        apiKey: "sk-a",
        baseURL: "https://opencode.ai/zen/go/v1",
        protocol: "openai",
        models: [
          { id: "model-a", name: "deepseek-v4-flash", enabled: true },
          { id: "model-b", name: "deepseek-v4-pro", enabled: true },
        ],
      },
    ])

    const store = usePreferenceSettingStore()
    const pref = store.getPublishPreferenceSetting()

    const ok = store.selectSisyuanAiModel("model-b")
    expect(ok).toBe(true)
    expect(pref.value.experimentalSisyuanAiActiveModelId).toBe("model-b")
    expect(pref.value.experimentalAIApiModel).toBe("deepseek-v4-pro")
    expect(pref.value.experimentalAICode).toBe("sk-a")
  })

  it("selectSisyuanAiModel returns false for an unknown model id", async () => {
    const { usePreferenceSettingStore } = await import("~/src/stores/usePreferenceSettingStore.ts")
    setAiConfig([
      {
        id: "prov-a",
        displayName: "OpenCode GO",
        enabled: true,
        apiKey: "sk-a",
        baseURL: "https://opencode.ai/zen/go/v1",
        protocol: "openai",
        models: [{ id: "model-a", name: "deepseek-v4-flash", enabled: true }],
      },
    ])

    const store = usePreferenceSettingStore()
    expect(store.selectSisyuanAiModel("missing-id")).toBe(false)
  })
})
