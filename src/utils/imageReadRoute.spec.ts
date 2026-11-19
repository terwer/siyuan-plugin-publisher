/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { isSameOriginWithPage, shouldReadImageDirectly } from "~/src/utils/imageReadRoute.ts"

const page = "https://notes.example.com/"

describe("imageReadRoute", () => {
  it("treats same-origin absolute image urls as direct reads", () => {
    expect(isSameOriginWithPage("https://notes.example.com/assets/a.png", page)).toBe(true)
  })

  it("resolves relative urls against the current page address", () => {
    expect(isSameOriginWithPage("/assets/a.png", page)).toBe(true)
    expect(isSameOriginWithPage("assets/a.png", page)).toBe(true)
    // 缺省时回退到当前页面地址（浏览器宿主）
    expect(isSameOriginWithPage("/assets/a.png")).toBe(true)
  })

  it("keeps cross-origin image urls on the proxy path", () => {
    expect(isSameOriginWithPage("https://cdn.example.com/a.png", page)).toBe(false)
    expect(isSameOriginWithPage("http://notes.example.com/assets/a.png", page)).toBe(false)
  })

  it("does not treat invalid or empty urls as direct reads", () => {
    expect(isSameOriginWithPage("", page)).toBe(false)
    expect(isSameOriginWithPage("http://[::1", page)).toBe(false)
  })

  it("keeps the desktop SiYuan host on the existing direct-read path", () => {
    // 桌面端即使图片地址是跨源的，也维持既有直读行为
    expect(shouldReadImageDirectly("https://cdn.example.com/a.png", { inSiyuanDesktop: true })).toBe(true)
  })

  it("uses the page origin for browser hosts", () => {
    expect(
      shouldReadImageDirectly("https://notes.example.com/assets/a.png", {
        inSiyuanDesktop: false,
        pageHref: page,
      })
    ).toBe(true)
    expect(
      shouldReadImageDirectly("https://cdn.example.com/a.png", {
        inSiyuanDesktop: false,
        pageHref: page,
      })
    ).toBe(false)
  })
})
