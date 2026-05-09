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
import V2AccountList from "~/src/components/v2/settings/V2AccountList.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockSypConfirm = vi.hoisted(() => vi.fn())

vi.mock("~/src/components/v2/common/SypMessageBox.ts", () => ({
  sypConfirm: mockSypConfirm,
}))

describe("V2AccountList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSypConfirm.mockResolvedValue(false)
  })
  it("keeps account rows focused on identity and status without platform descriptions", () => {
    const description = "发布到语雀知识库，适合沉淀团队文档和个人笔记。"
    const wrapper = mount(V2AccountList, {
      props: {
        items: [
          {
            platformKey: "common_Yuque",
            platformName: "语雀",
            platformIcon: "<svg></svg>",
            description,
            isEnabled: true,
            isAuth: true,
            statusText: "已启用并完成授权",
            statusType: "success",
            statusLabel: "运行中",
          },
        ],
      },
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
        ],
        stubs: {
          SypTooltip: {
            props: ["content", "triggerClass"],
            template: '<span :class="triggerClass"><slot>{{ content }}</slot></span>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain("语雀")
    expect(wrapper.text()).toContain("common_Yuque")
    expect(wrapper.text()).toContain("运行中")
    expect(wrapper.text()).not.toContain(description)
    expect(wrapper.find(".syp-account-item__summary").exists()).toBe(false)
    expect(wrapper.find(".syp-status-badge.is-success").exists()).toBe(true)
    expect(wrapper.find(".syp-status-badge__dot").exists()).toBe(true)
  })

  it("uses the unified V2 message box before deleting an account", async () => {
    mockSypConfirm.mockResolvedValue(true)
    const wrapper = mount(V2AccountList, {
      props: {
        items: [
          {
            platformKey: "custom_Yuqueweb",
            platformName: "语雀网页版",
            platformIcon: "",
            description: "",
            isEnabled: false,
            isAuth: false,
            statusText: "未启用 · 未授权",
            statusType: "error",
            statusLabel: "未启用",
          },
        ],
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
          SypTooltip: {
            props: ["content", "triggerClass"],
            template: '<button v-if="$attrs.type === `button`" type="button" :class="[$attrs.class, triggerClass]" @click="$emit(`click`, $event)"><slot>{{ content }}</slot></button><span v-else :class="triggerClass"><slot>{{ content }}</slot></span>',
          },
        },
      },
    })

    await wrapper.find(".syp-btn.is-danger").trigger("click")
    await flushPromises()

    expect(mockSypConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: zhCN["v2.account.action.deleteConfirmTitle"],
        message: zhCN["v2.account.action.deleteConfirmText"].replace("{name}", "语雀网页版"),
        confirmButtonClass: "syp-v2-message-box__confirm-danger",
      })
    )
    expect(wrapper.emitted("delete")?.[0]).toEqual(["custom_Yuqueweb"])
  })

  it("does not delete when the unified V2 message box is cancelled", async () => {
    mockSypConfirm.mockResolvedValue(false)
    const wrapper = mount(V2AccountList, {
      props: {
        items: [
          {
            platformKey: "custom_Yuqueweb",
            platformName: "语雀网页版",
            platformIcon: "",
            description: "",
            isEnabled: false,
            isAuth: false,
            statusText: "未启用 · 未授权",
            statusType: "error",
            statusLabel: "未启用",
          },
        ],
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
          SypTooltip: {
            props: ["content", "triggerClass"],
            template: '<button v-if="$attrs.type === `button`" type="button" :class="[$attrs.class, triggerClass]" @click="$emit(`click`, $event)"><slot>{{ content }}</slot></button><span v-else :class="triggerClass"><slot>{{ content }}</slot></span>',
          },
        },
      },
    })

    await wrapper.find(".syp-btn.is-danger").trigger("click")
    await flushPromises()

    expect(wrapper.emitted("delete")).toBeUndefined()
  })

})
