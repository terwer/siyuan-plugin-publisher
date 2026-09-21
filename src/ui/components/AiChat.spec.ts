/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { flushPromises, mount, type VueWrapper } from "@vue/test-utils"
import { createI18n } from "vue-i18n"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AiChat from "~/src/ui/components/AiChat.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockChat = vi.hoisted(() => vi.fn())
const mockGetChatInput = vi.hoisted(() => vi.fn())
const mockGetPost = vi.hoisted(() => vi.fn())
const mockElMessage = vi.hoisted(() => ({
  success: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}))

vi.mock("element-plus", () => ({
  ElMessage: mockElMessage,
}))

vi.mock("~/src/composables/useChatGPT.ts", () => ({
  useChatGPT: () => ({
    chat: mockChat,
    getChatInput: mockGetChatInput,
  }),
}))

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    blogApi: {
      getPost: mockGetPost,
    },
  }),
}))

const mountAiChat = async (pageId?: string) => {
  const wrapper = mount(AiChat, {
    props: pageId === undefined ? {} : { pageId },
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

const openPromptPanel = async (wrapper: VueWrapper<any>) => {
  await wrapper.find(".syp-ai-chat__prompt-manage").trigger("click")
  await flushPromises()
}

const readStoredPrompts = () => JSON.parse(localStorage.getItem("prompts") || "[]")

describe("AiChat", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockChat.mockResolvedValue("AI 回复")
    mockGetChatInput.mockReturnValue("doc-context")
    mockGetPost.mockResolvedValue({
      title: "测试文档",
      markdown: "文档正文",
      html: "<p>文档正文</p>",
    } as any)
  })

  it("shows free chat mode when no page id is provided", async () => {
    const wrapper = await mountAiChat()

    expect(mockGetPost).not.toHaveBeenCalled()
    expect(wrapper.find(".syp-ai-chat__tip").text()).toBe(zhCN["aiChat.tip.free"])
    expect(wrapper.find(".syp-ai-chat__tip").classes()).toContain("is-info")
    // 无文档正文时不提供上下文开关
    expect(wrapper.find(".syp-ai-chat__context-row").exists()).toBe(false)
  })

  it("shows context mode with the document title and keeps the context switch available", async () => {
    const wrapper = await mountAiChat("doc-1")

    expect(mockGetPost).toHaveBeenCalledWith("doc-1")
    expect(wrapper.find(".syp-ai-chat__tip").text()).toBe(
      zhCN["aiChat.tip.context"].replace("{title}", "测试文档")
    )
    expect(wrapper.find(".syp-ai-chat__tip").classes()).toContain("is-success")

    const contextSwitch = wrapper.find(".syp-ai-chat__context-row input[type='checkbox']")
    expect(contextSwitch.exists()).toBe(true)
    expect((contextSwitch.element as HTMLInputElement).checked).toBe(true)
  })

  it("passes the document context as a system message when sending in context mode", async () => {
    const wrapper = await mountAiChat("doc-1")

    await wrapper.find(".syp-ai-chat__chat-input").setValue("帮我写摘要")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()

    expect(mockGetChatInput).toHaveBeenCalledWith("文档正文", "<p>文档正文</p>")
    expect(mockChat).toHaveBeenCalledWith("帮我写摘要", { name: "system", systemMessage: "doc-context" })
    // V1 的拼接口径：`> 提问\n回复\n\n` 前置到已有输出
    expect(wrapper.find(".syp-ai-chat__output pre").text()).toBe("> 帮我写摘要\nAI 回复")
  })

  it("sends without a system message in free chat mode", async () => {
    const wrapper = await mountAiChat()

    await wrapper.find(".syp-ai-chat__chat-input").setValue("你好")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()

    expect(mockGetChatInput).not.toHaveBeenCalled()
    expect(mockChat).toHaveBeenCalledWith("你好")
  })

  it("prepends new replies to the existing output", async () => {
    const wrapper = await mountAiChat()
    const chatInput = wrapper.find(".syp-ai-chat__chat-input")

    mockChat.mockResolvedValueOnce("第一次回复")
    await chatInput.setValue("第一问")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()

    mockChat.mockResolvedValueOnce("第二次回复")
    await chatInput.setValue("第二问")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()

    expect(wrapper.find(".syp-ai-chat__output pre").text()).toBe(
      "> 第二问\n第二次回复\n\n> 第一问\n第一次回复"
    )
  })

  it("does not send a request when the input is empty", async () => {
    const wrapper = await mountAiChat()

    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()
    expect(mockChat).not.toHaveBeenCalled()
    expect(mockElMessage.error).toHaveBeenCalledWith(zhCN["aiChat.message.inputRequired"])

    await wrapper.find(".syp-ai-chat__chat-input").setValue("   ")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()
    expect(mockChat).not.toHaveBeenCalled()
  })

  it("keeps the V1 error semantics when the AI returns an empty answer", async () => {
    mockChat.mockResolvedValue("")
    const wrapper = await mountAiChat()

    await wrapper.find(".syp-ai-chat__chat-input").setValue("你好")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()

    expect(mockElMessage.error).toHaveBeenCalledWith(zhCN["aiChat.message.requestFailed"])
    expect(wrapper.find(".syp-ai-chat__output pre").text()).toBe("")
  })

  it("adds a custom prompt and persists it to localStorage", async () => {
    const wrapper = await mountAiChat()
    await openPromptPanel(wrapper)

    await wrapper.find(".syp-ai-chat__prompt-new-button").trigger("click")
    await wrapper.find(".syp-ai-chat__prompt-new").setValue("我的自定义 Prompt")
    await wrapper.find(".syp-ai-chat__prompt-new-save").trigger("click")
    await flushPromises()

    const stored = readStoredPrompts()
    expect(stored.map((item: any) => item.value)).toContain("我的自定义 Prompt")
    // 新增项与系统内置项同一存储结构（key/value/isSys）
    const created = stored.find((item: any) => item.value === "我的自定义 Prompt")
    expect(created.key).toBeTruthy()
    expect(created.isSys).toBe(false)
    // 新增后输入框收起、管理面板关闭（V1 行为）
    expect(wrapper.find(".syp-ai-chat__prompt-new").exists()).toBe(false)
    expect(mockElMessage.success).toHaveBeenCalledWith(zhCN["aiChat.message.promptAdded"])
  })

  it("rejects an empty prompt", async () => {
    const wrapper = await mountAiChat()
    await openPromptPanel(wrapper)

    await wrapper.find(".syp-ai-chat__prompt-new-button").trigger("click")
    await wrapper.find(".syp-ai-chat__prompt-new-save").trigger("click")
    await flushPromises()

    expect(mockElMessage.error).toHaveBeenCalledWith(zhCN["aiChat.message.promptRequired"])
    expect(localStorage.getItem("prompts")).toBeNull()
  })

  it("deletes a custom prompt from localStorage and keeps built-in prompts editable like V1", async () => {
    localStorage.setItem(
      "prompts",
      JSON.stringify([{ key: "custom-1", value: "待删除的 Prompt", isSys: false }])
    )
    const wrapper = await mountAiChat()
    await openPromptPanel(wrapper)

    const rows = wrapper.findAll(".syp-ai-chat__table tbody tr")
    const customRow = rows.find((row) => row.text().includes("待删除的 Prompt"))
    expect(customRow).toBeTruthy()

    await customRow!.find(".syp-ai-chat__prompt-delete").trigger("click")
    await flushPromises()

    expect(readStoredPrompts().map((item: any) => item.key)).not.toContain("custom-1")
    expect(mockElMessage.success).toHaveBeenCalledWith(zhCN["aiChat.message.promptDeleted"])

    // 内置 4 条与 V1 一致：isSys 为 false，因此可编辑、可删除
    const sysRow = wrapper
      .findAll(".syp-ai-chat__table tbody tr")
      .find((row) => row.text().includes("sys-1") || row.text().includes("请为当前上下文打标签"))
    expect(sysRow).toBeTruthy()
    expect(sysRow!.find(".syp-ai-chat__prompt-delete").exists()).toBe(true)
    expect(sysRow!.find(".syp-ai-chat__prompt-edit-button").exists()).toBe(true)
  })

  it("keeps prompts saved by V1 and merges the 4 built-in prompts", async () => {
    localStorage.setItem("prompts", JSON.stringify([{ key: "custom-v1", value: "老用户的 Prompt", isSys: false }]))
    const wrapper = await mountAiChat()
    await openPromptPanel(wrapper)

    const rows = wrapper.findAll(".syp-ai-chat__table tbody tr")
    expect(rows).toHaveLength(5)
    expect(rows[0].text()).toContain("老用户的 Prompt")
  })

  it("enables the context switch and fills the input when a prompt mentions the current context", async () => {
    const wrapper = await mountAiChat("doc-1")
    const promptSelect = wrapper.find(".syp-ai-chat__prompt-select")

    const contextOption = promptSelect
      .findAll("option")
      .find((option) => option.text().includes("当前上下文"))!
    expect(contextOption).toBeTruthy()

    // 先手动关闭开关，验证选择 Prompt 会重新打开
    await wrapper.find(".syp-ai-chat__context-row input[type='checkbox']").setValue(false)
    await flushPromises()

    const contextPromptValue = (contextOption.element as HTMLOptionElement).value
    await promptSelect.setValue(contextPromptValue)
    await flushPromises()

    expect((wrapper.find(".syp-ai-chat__context-row input[type='checkbox']").element as HTMLInputElement).checked).toBe(
      true
    )
    expect((wrapper.find(".syp-ai-chat__chat-input").element as HTMLTextAreaElement).value).toBe(contextPromptValue)
  })

  it("turns the context switch off when a prompt does not mention the current context", async () => {
    const wrapper = await mountAiChat("doc-1")
    const promptSelect = wrapper.find(".syp-ai-chat__prompt-select")

    const plainOption = promptSelect
      .findAll("option")
      .find((option) => option.text().includes("舔狗日记"))!
    expect(plainOption).toBeTruthy()

    await promptSelect.setValue((plainOption.element as HTMLOptionElement).value)
    await flushPromises()

    expect((wrapper.find(".syp-ai-chat__context-row input[type='checkbox']").element as HTMLInputElement).checked).toBe(
      false
    )
  })

  it("clears both the input and the chat output", async () => {
    const wrapper = await mountAiChat()

    await wrapper.find(".syp-ai-chat__chat-input").setValue("你好")
    await wrapper.find(".syp-ai-chat__send").trigger("click")
    await flushPromises()
    expect(wrapper.find(".syp-ai-chat__output pre").text()).not.toBe("")

    await wrapper.find(".syp-ai-chat__clear").trigger("click")
    await flushPromises()

    expect((wrapper.find(".syp-ai-chat__chat-input").element as HTMLTextAreaElement).value).toBe("")
    expect(wrapper.find(".syp-ai-chat__output pre").text()).toBe("")
  })
})
