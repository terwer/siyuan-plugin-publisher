/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

/**
 * 可变的发布偏好设置引用（usePreferenceSettingStore 返回的 ref 形态）
 */
const mockPref = vi.hoisted(() => ({
  value: {
    experimentalAIProxyUrl: "",
    experimentalAIBaseUrl: "https://opencode.ai/zen/go/v1",
    experimentalAICode: "sk-test-key",
    experimentalAIApiModel: "deepseek-v4-flash-vision-exp",
    experimentalAIApiMaxTokens: 1024,
    experimentalAIApiTemperature: 0.7,
  },
}))

/**
 * 捕获传给 ChatGPTAPI 的 fetch 实现，用于断言是否注入了会话头
 */
const captured = vi.hoisted(() => ({ fetch: undefined as any }))

/**
 * 全局 fetch mock（jsdom 下 self.fetch 会指向它）
 */
const mockFetch = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/usePreferenceSettingStore.ts", () => ({
  usePreferenceSettingStore: () => ({
    getReadOnlyPublishPreferenceSetting: () => mockPref,
  }),
}))

vi.mock("chatgpt", () => {
  class MockChatGPTAPI {
    constructor(opts: any = {}) {
      captured.fetch = opts.fetch
    }
    async sendMessage() {
      return { text: "mock-ok" }
    }
  }
  class MockChatGPTUnofficialProxyAPI extends MockChatGPTAPI {}
  return {
    ChatGPTAPI: MockChatGPTAPI,
    ChatGPTUnofficialProxyAPI: MockChatGPTUnofficialProxyAPI,
  }
})

const { useChatGPT } = await import("~/src/composables/useChatGPT.ts")

describe("useChatGPT OpenCode Go x-opencode-session header", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    // jsdom 环境补充全局 fetch 与 self，使 resolveFetch 能取到 baseFetch
    globalThis.fetch = mockFetch as any
    ;(globalThis as any).self = globalThis
    captured.fetch = undefined
    mockPref.value.experimentalAIProxyUrl = ""
    mockPref.value.experimentalAIBaseUrl = "https://opencode.ai/zen/go/v1"
  })

  it("injects x-opencode-session header for OpenCode Go requests", async () => {
    const { chat } = useChatGPT()
    await chat("hello")

    // chat 内部会构造 ChatGPTAPI，捕获到的 fetch 应已包装为注入会话头
    const wrappedFetch = captured.fetch
    expect(wrappedFetch).toBeTypeOf("function")

    await wrappedFetch("https://opencode.ai/zen/go/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer sk-test-key" },
      body: "{}",
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const init = mockFetch.mock.calls[0][1] as RequestInit
    const headers = new Headers(init.headers)
    expect(headers.get("x-opencode-session")).toBeTruthy()
    expect(headers.get("Authorization")).toBe("Bearer sk-test-key")
  })

  it("does not inject x-opencode-session for non-OpenCode Go requests", async () => {
    mockPref.value.experimentalAIBaseUrl = "https://api.openai.com/v1"
    const { chat } = useChatGPT()
    await chat("hello")

    const wrappedFetch = captured.fetch
    expect(wrappedFetch).toBeTypeOf("function")

    await wrappedFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer sk-test-key" },
      body: "{}",
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const init = mockFetch.mock.calls[0][1] as RequestInit
    const headers = new Headers(init.headers)
    expect(headers.get("x-opencode-session")).toBeFalsy()
  })
})
