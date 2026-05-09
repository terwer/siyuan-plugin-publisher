/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { mount } from "@vue/test-utils"
import { createI18n } from "vue-i18n"
import { describe, expect, it, vi } from "vitest"
import V2AccountList from "~/src/components/v2/settings/V2AccountList.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

vi.mock("element-plus", async (importOriginal) => {
  const actual = await importOriginal<typeof import("element-plus")>()
  return {
    ...actual,
    ElMessageBox: {
      confirm: vi.fn().mockResolvedValue(undefined),
    },
  }
})

describe("V2AccountList", () => {
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
  })
})
