/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import type { AppView } from "~/src/ui/components/layout/UnifiedWorkspaceShell.vue"
import {
  buildHeaderNavEntries,
  HEADER_NAV_KEYS,
  resolveHeaderNavAction,
  type HeaderNavKey,
} from "~/src/ui/composables/useHeaderNav.ts"
import enUS from "~/siyuan/i18n/en_US.json"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const ALL_VIEWS: AppView[] = ["quick_publish", "single_publish", "batch_publish", "manage", "settings", "ai_chat"]

describe("useHeaderNav", () => {
  it("keeps the same entries in the same order on every view, with or without a document", () => {
    for (const currentView of ALL_VIEWS) {
      for (const hasDocument of [true, false]) {
        const entries = buildHeaderNavEntries({ currentView, hasDocument })
        expect(entries.map((entry) => entry.key)).toEqual([...HEADER_NAV_KEYS])
      }
    }
  })

  it("marks exactly the entry of the current view as active", () => {
    for (const currentView of ALL_VIEWS) {
      const active = buildHeaderNavEntries({ currentView, hasDocument: true })
        .filter((entry) => entry.active)
        .map((entry) => entry.key)

      if (HEADER_NAV_KEYS.includes(currentView as HeaderNavKey)) {
        expect(active).toEqual([currentView])
      } else {
        // 导航之外的视图（如 ai_chat）不属于主导航，此时不应有入口被点亮
        expect(active).toEqual([])
      }
    }
  })

  it("disables only the document-scoped entries when no document is open", () => {
    const entries = buildHeaderNavEntries({ currentView: "quick_publish", hasDocument: false })
    const disabled = entries.filter((entry) => entry.disabled)

    expect(disabled.map((entry) => entry.key)).toEqual(["single_publish", "batch_publish"])
    expect(disabled.every((entry) => entry.disabledReasonKey === "app.nav.needDocument")).toBe(true)
  })

  it("enables every entry once a document is open", () => {
    const entries = buildHeaderNavEntries({ currentView: "quick_publish", hasDocument: true })

    expect(entries.some((entry) => entry.disabled)).toBe(false)
    expect(entries.every((entry) => entry.disabledReasonKey === "")).toBe(true)
  })

  it("never replaces an entry with a back affordance", () => {
    for (const currentView of ALL_VIEWS) {
      const keys = buildHeaderNavEntries({ currentView, hasDocument: true }).map((entry) => entry.key)

      expect(new Set(keys).size).toBe(keys.length)
      expect(keys.some((key) => key.includes("back"))).toBe(false)
    }
  })

  it("translates the disabled reason in both shipped locales", () => {
    expect(zhCN["app.nav.label"]).toBeTruthy()
    expect(zhCN["app.nav.needDocument"]).toBeTruthy()
    expect(enUS["app.nav.label"]).toBeTruthy()
    expect(enUS["app.nav.needDocument"]).toBeTruthy()
  })
})

describe("resolveHeaderNavAction", () => {
  it("ignores a click on an unavailable entry instead of hiding it", () => {
    expect(
      resolveHeaderNavAction({ key: "single_publish", disabled: true, currentView: "quick_publish" })
    ).toBe("none")
  })

  it("navigates when the entry is not the current view", () => {
    for (const key of HEADER_NAV_KEYS) {
      expect(resolveHeaderNavAction({ key, disabled: false, currentView: "quick_publish" })).toBe(
        key === "quick_publish" ? "none" : "navigate"
      )
    }
  })

  it("resets to the destination root when the entry is already current", () => {
    expect(resolveHeaderNavAction({ key: "manage", disabled: false, currentView: "manage" })).toBe("reset")
    expect(resolveHeaderNavAction({ key: "settings", disabled: false, currentView: "settings" })).toBe("reset")
    expect(resolveHeaderNavAction({ key: "batch_publish", disabled: false, currentView: "batch_publish" })).toBe("none")
  })
})
