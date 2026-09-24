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
import { describe, expect, it } from "vitest"
import AppHeaderNav from "~/src/ui/components/layout/AppHeaderNav.vue"
import type { AppView } from "~/src/ui/components/layout/UnifiedWorkspaceShell.vue"
import { buildHeaderNavEntries, HEADER_NAV_KEYS } from "~/src/ui/composables/useHeaderNav.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const ALL_VIEWS: AppView[] = ["quick_publish", "single_publish", "batch_publish", "manage", "settings", "ai_chat"]

const EXPECTED_LABELS = [
  zhCN["app.panel.quickPublish"],
  zhCN["panel.singlePublish"],
  zhCN["panel.batchPublish"],
  zhCN["app.action.openManage"],
  zhCN["app.action.openSettings"],
]

function mountNav(currentView: AppView, hasDocument = true) {
  return mount(AppHeaderNav, {
    props: { entries: buildHeaderNavEntries({ currentView, hasDocument }) },
    global: {
      plugins: [createI18n({ legacy: false, locale: "zh_CN", messages: { zh_CN: zhCN } })],
      stubs: {
        // 以真实 button 承载触发器属性（class / aria-*），断言的就是点击目标本身
        SypTooltip: {
          props: ["content", "tag", "ellipsis", "inlineFlex"],
          inheritAttrs: false,
          template: '<button type="button" v-bind="$attrs"><slot /></button>',
        },
      },
    },
  })
}

describe("AppHeaderNav", () => {
  it("always renders the same entries in the same order, whatever the view", () => {
    for (const currentView of ALL_VIEWS) {
      const wrapper = mountNav(currentView)
      const labels = wrapper.findAll("nav button").map((item) => item.text())

      expect(labels).toHaveLength(HEADER_NAV_KEYS.length)
      expect(labels).toEqual(EXPECTED_LABELS)
    }
  })

  it("highlights exactly the current entry and marks it as the current page", () => {
    for (const currentView of ["quick_publish", "single_publish", "batch_publish", "manage", "settings"] as AppView[]) {
      const wrapper = mountNav(currentView)
      const active = wrapper.findAll("nav button").filter((item) => item.classes().includes("is-active"))

      expect(active).toHaveLength(1)
      expect(active[0].attributes("aria-current")).toBe("page")
      expect(active[0].text()).toBe(EXPECTED_LABELS[HEADER_NAV_KEYS.indexOf(currentView as never)])
    }
  })

  it("never swaps an entry for a back affordance", () => {
    for (const currentView of ALL_VIEWS) {
      const wrapper = mountNav(currentView)
      const labels = wrapper.findAll("nav button").map((item) => item.text())

      expect(labels).toEqual(EXPECTED_LABELS)
      expect(labels.some((label) => label.includes("返回") || label.includes("Back"))).toBe(false)
      expect(wrapper.find(".syp-btn-back").exists()).toBe(false)
    }
  })

  it("keeps the document-scoped entries in place, disabled with a reason, when no document is open", async () => {
    const wrapper = mountNav("quick_publish", false)
    const buttons = wrapper.findAll("nav button")

    expect(buttons).toHaveLength(HEADER_NAV_KEYS.length)

    const disabled = buttons.filter((item) => item.attributes("aria-disabled") === "true")
    expect(disabled.map((item) => item.text())).toEqual([zhCN["panel.singlePublish"], zhCN["panel.batchPublish"]])
    expect(disabled.every((item) => item.classes().includes("is-disabled"))).toBe(true)

    await disabled[0].trigger("click")
    expect(wrapper.emitted("select")?.[0]).toEqual(["single_publish", true])
  })

  it("emits the entry key together with its availability", async () => {
    const wrapper = mountNav("quick_publish")
    const buttons = wrapper.findAll("nav button")

    await buttons[2].trigger("click")
    expect(wrapper.emitted("select")?.[0]).toEqual(["batch_publish", false])
  })
})
