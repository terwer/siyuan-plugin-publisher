/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import { PicbedServiceTypeEnum } from "zhi-blog-api"
import { useHalowebWeb } from "~/src/adaptors/web/haloweb/useHalowebWeb.ts"
import { AuthMode, PlatformType, setDynamicJsonCfg, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"

const mockGetSetting = vi.hoisted(() => vi.fn())
const mockHalowebWebAdaptor = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/usePublishSettingStore", () => ({
  usePublishSettingStore: () => ({
    getSetting: mockGetSetting,
  }),
}))

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({
    getSetting: mockGetSetting,
  }),
}))

vi.mock("~/src/adaptors/web/haloweb/HalowebWebAdaptor.ts", () => ({
  HalowebWebAdaptor: mockHalowebWebAdaptor,
}))

vi.mock("~/src/publisherAppInstance.ts", () => ({
  PublisherAppInstance: class PublisherAppInstance {},
}))

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

describe("useHalowebWeb", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not throw while opening a fresh config page with the preset relative authUrl", async () => {
    const dynCfg = createDynCfg()
    mockGetSetting.mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: {},
    })

    const { cfg } = await useHalowebWeb(dynCfg.platformKey)

    expect(cfg.home).toBe("")
    expect(cfg.apiUrl).toBe("")
    expect(cfg.logoutUrl).toBe("")
    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
    expect(mockHalowebWebAdaptor).toHaveBeenCalledWith(expect.any(Object), cfg)
  })

  it("resolves a relative authUrl from existing Halo home/apiUrl without breaking editable config", async () => {
    const dynCfg = createDynCfg()
    mockGetSetting.mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: JSON.stringify({
        home: "https://halo.example.com",
        apiUrl: "https://halo.example.com",
      }),
    })

    const { cfg } = await useHalowebWeb(dynCfg.platformKey)

    expect(cfg.home).toBe("https://halo.example.com")
    expect(cfg.apiUrl).toBe("https://halo.example.com")
    expect(cfg.logoutUrl).toBe("https://halo.example.com/logout")
  })

  it("syncs home/apiUrl only when the dynamic authUrl is an absolute URL", async () => {
    const dynCfg = createDynCfg({ authUrl: "https://halo.changed.example/login" })
    mockGetSetting.mockResolvedValue({
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: JSON.stringify({
        home: "https://halo.old.example",
        apiUrl: "https://halo.old.example",
      }),
    })

    const { cfg } = await useHalowebWeb(dynCfg.platformKey)

    expect(cfg.home).toBe("https://halo.changed.example")
    expect(cfg.apiUrl).toBe("https://halo.changed.example")
    expect(cfg.logoutUrl).toBe("https://halo.changed.example/logout")
  })
})
