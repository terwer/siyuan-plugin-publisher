/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { AuthMode, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import {
  buildWebCookieRequestDynCfg,
  resolveWebCookieAuthOrigin,
  resolveWebCookieUrl,
} from "~/src/composables/webCookieAuthUrl.ts"

const createDynCfg = (overrides: Partial<DynamicConfig> = {}) =>
  ({
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Custom_Haloweb,
    platformKey: "custom_Haloweb",
    platformName: "Halo网页版",
    authMode: AuthMode.WEBSITE,
    authUrl: "/login",
    domain: "",
    isEnabled: false,
    isAuth: false,
    isSys: false,
    ...overrides,
  }) as DynamicConfig

describe("web Cookie auth URL resolver", () => {
  it("resolves a relative authUrl from editable web config home", () => {
    expect(resolveWebCookieUrl("/login", "https://halo.example.com", "")).toBe("https://halo.example.com/login")
    expect(resolveWebCookieAuthOrigin("/login", "https://halo.example.com", "")).toBe("https://halo.example.com")
  })

  it("returns empty when a relative authUrl has no configured base URL yet", () => {
    expect(resolveWebCookieUrl("/login", "", "")).toBe("")
    expect(resolveWebCookieAuthOrigin("/login", "", "")).toBe("")
  })

  it("keeps absolute authUrl values unchanged for fixed-domain web platforms", () => {
    expect(resolveWebCookieUrl("https://passport.csdn.net/login", "", "")).toBe(
      "https://passport.csdn.net/login"
    )
  })

  it("builds a request-only dynCfg with absolute authUrl and derived domain", () => {
    const dynCfg = createDynCfg()
    const requestDynCfg = buildWebCookieRequestDynCfg(dynCfg, {
      home: "https://halo.example.com",
      apiUrl: "https://halo.example.com",
      logoutUrl: "https://halo.example.com/logout",
    })

    expect(requestDynCfg).toMatchObject({
      authUrl: "https://halo.example.com/login",
      domain: "halo.example.com",
      logoutUrl: "https://halo.example.com/logout",
    })
    expect(dynCfg.authUrl).toBe("/login")
    expect(dynCfg.domain).toBe("")
  })
})
