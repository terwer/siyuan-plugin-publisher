/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import {
  assignDisplayOrders,
  getNextDisplayOrder,
  resolveDisplayOrder,
  sortV2Accounts,
  sortV2QuickPublish,
} from "~/src/composables/v2/platformOrdering.ts"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"

const createConfig = (partial: Partial<DynamicConfig> & Pick<DynamicConfig, "platformKey">): DynamicConfig => ({
  platformType: PlatformType.Common,
  subPlatformType: SubPlatformType.Common_Yuque,
  platformName: partial.platformKey,
  isEnabled: false,
  isAuth: false,
  authMode: AuthMode.API,
  isSys: false,
  ...partial,
} as DynamicConfig)

describe("platformOrdering", () => {
  it("falls back to the original array index when displayOrder is missing", () => {
    expect(resolveDisplayOrder({ platformKey: "a" }, 3)).toBe(3)
    expect(resolveDisplayOrder({ platformKey: "b", displayOrder: 1 }, 3)).toBe(1)
  })

  it("sorts account items by enabled group and then effective display order", () => {
    const result = sortV2Accounts([
      createConfig({ platformKey: "disabled-old", isEnabled: false }),
      createConfig({ platformKey: "enabled-late", isEnabled: true, displayOrder: 20 }),
      createConfig({ platformKey: "enabled-early", isEnabled: true, displayOrder: 1 }),
      createConfig({ platformKey: "disabled-new", isEnabled: false, displayOrder: 0 }),
    ])

    expect(result.map((item) => item.platformKey)).toEqual([
      "enabled-early",
      "enabled-late",
      "disabled-old",
      "disabled-new",
    ])
  })

  it("keeps historical relative order inside enabled groups when displayOrder is missing", () => {
    const result = sortV2Accounts([
      createConfig({ platformKey: "disabled-1", isEnabled: false }),
      createConfig({ platformKey: "enabled-1", isEnabled: true }),
      createConfig({ platformKey: "enabled-2", isEnabled: true }),
      createConfig({ platformKey: "disabled-2", isEnabled: false }),
    ])

    expect(result.map((item) => item.platformKey)).toEqual([
      "enabled-1",
      "enabled-2",
      "disabled-1",
      "disabled-2",
    ])
  })

  it("sorts quick publish cards by publish-ready group and then effective display order", () => {
    const result = sortV2QuickPublish([
      { platformKey: "blocked-early", isPublishReady: false, displayOrder: 0 },
      { platformKey: "ready-late", isPublishReady: true, displayOrder: 10 },
      { platformKey: "ready-early", isPublishReady: true, displayOrder: 2 },
      { platformKey: "blocked-late", isPublishReady: false, displayOrder: 1 },
    ])

    expect(result.map((item) => item.platformKey)).toEqual([
      "ready-early",
      "ready-late",
      "blocked-early",
      "blocked-late",
    ])
  })

  it("returns the next display order from stored or fallback order", () => {
    expect(getNextDisplayOrder([
      { platformKey: "a" },
      { platformKey: "b", displayOrder: 8 },
      { platformKey: "c" },
    ])).toBe(9)
  })

  it("assigns dense display orders while appending unknown or hidden platforms", () => {
    const configs = [
      createConfig({ platformKey: "a", displayOrder: 10, isAuth: true }),
      createConfig({ platformKey: "b", displayOrder: 20, isEnabled: true }),
      createConfig({ platformKey: "hidden", displayOrder: 30 }),
    ]

    const result = assignDisplayOrders(configs, ["b", "a"])

    expect(result.map((item) => item.platformKey)).toEqual(["b", "a", "hidden"])
    expect(result.map((item) => item.displayOrder)).toEqual([0, 1, 2])
    expect(result[0].isEnabled).toBe(true)
    expect(result[1].isAuth).toBe(true)
  })
})
