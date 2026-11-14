/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { resolveMenuPlacement } from "~/src/utils/menuPlacement.ts"

describe("resolveMenuPlacement", () => {
  it("移动端仍然使用全屏菜单", () => {
    expect(resolveMenuPlacement(true, undefined, 1536)).toEqual({ mode: "fullscreen" })
  })

  it("桌面端贴着有效锚点弹出", () => {
    const placement = resolveMenuPlacement(false, { left: 120, top: 8, bottom: 44, width: 36, height: 36 }, 1536)
    expect(placement).toEqual({ mode: "popover", x: 120, y: 44, isLeft: true })
  })

  it("桌面端没有锚点时在窗口中部弹出，而不是退回移动端全屏菜单", () => {
    const placement = resolveMenuPlacement(false, undefined, 1536)
    expect(placement.mode).toBe("popover")
    expect(placement).toEqual({ mode: "popover", x: 768, y: 72, isLeft: true })
  })

  it("锚点尺寸为 0（元素不可见）时按无锚点处理", () => {
    const placement = resolveMenuPlacement(false, { left: 0, top: 0, bottom: 0, width: 0, height: 0 }, 1200)
    expect(placement).toEqual({ mode: "popover", x: 600, y: 72, isLeft: true })
  })
})
