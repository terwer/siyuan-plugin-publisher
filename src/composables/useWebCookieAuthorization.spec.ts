/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { PasswordType } from "zhi-blog-api"
import { authorizeWebCookie, logoutWebCookieAuthorization } from "~/src/composables/useWebCookieAuthorization.ts"
import { AuthMode, PlatformType, setDynamicJsonCfg, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"

const createDynCfg = (overrides: Partial<DynamicConfig> = {}) =>
  ({
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Custom_Yuqueweb,
    platformKey: "custom_Yuqueweb-test",
    platformName: "语雀网页版",
    authMode: AuthMode.WEBSITE,
    authUrl: "https://www.yuque.com/login",
    domain: "www.yuque.com",
    isEnabled: true,
    isAuth: false,
    isSys: false,
    ...overrides,
  }) as DynamicConfig

const createCfg = (overrides: Record<string, any> = {}) =>
  ({
    passwordType: PasswordType.PasswordType_Cookie,
    password: "",
    metadata: {},
    apiStatus: false,
    ...overrides,
  }) as any

const createCookie = (name: string, value: string) =>
  ({
    name,
    value,
    domain: ".yuque.com",
    hostOnly: false,
    path: "/",
    secure: true,
    httpOnly: true,
    session: false,
    expirationDate: 9999999999,
    sameSite: "no_restriction",
  }) as any

const createWebDynCfg = (subPlatformType: SubPlatformType, platformKey: string, platformName: string) =>
  createDynCfg({
    subPlatformType,
    platformKey,
    platformName,
    authUrl: platformKey.toLowerCase().includes("csdn")
      ? "https://passport.csdn.net/login"
      : "https://www.zhihu.com/signin",
    domain: platformKey.toLowerCase().includes("csdn") ? "csdn.net" : "zhihu.com",
  })

describe("authorizeWebCookie", () => {
  it("reads Cookie, builds it with platform api, validates metadata, and persists auth state", async () => {
    const dynCfg = createDynCfg()
    const cfg = createCfg()
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { keepMe: "keep", password: "old" },
    }
    const updateSetting = vi.fn().mockResolvedValue(undefined)
    const buildCookie = vi.fn().mockResolvedValue("yuque_session=***;ctoken=***")
    const updateCfg = vi.fn()
    const getMetaData = vi.fn().mockResolvedValue({ flag: true, displayName: "Terwer" })
    const onCookieChange = vi.fn()

    const result = await authorizeWebCookie(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: cfg,
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
        onCookieChange,
      },
      {
        getSetting: vi.fn(),
        updateSetting,
        captureCookies: vi.fn().mockResolvedValue([createCookie("yuque_session", "secret-value")]),
        getWebApi: vi.fn().mockResolvedValue({ buildCookie, updateCfg, getMetaData }),
        isAutoCaptureSupported: () => true,
      }
    )

    expect(result).toMatchObject({ status: "success", ok: true })
    expect(buildCookie).toHaveBeenCalledWith([expect.objectContaining({ name: "yuque_session" })])
    expect(updateCfg).toHaveBeenCalledWith(expect.objectContaining({ password: "yuque_session=***;ctoken=***" }))
    expect(onCookieChange).toHaveBeenCalledWith("yuque_session=***;ctoken=***")
    expect(setting[dynCfg.platformKey]).toMatchObject({
      keepMe: "keep",
      password: "yuque_session=***;ctoken=***",
      metadata: { flag: true, displayName: "Terwer" },
    })
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isAuth).toBe(true)
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isEnabled).toBe(true)
    expect(updateSetting).toHaveBeenCalledWith(setting)
  })

  it("does not enable the platform after successful V2 Cookie authorization", async () => {
    const dynCfg = createDynCfg({ isEnabled: false })
    const cfg = createCfg()
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: {},
    }
    const updateSetting = vi.fn().mockResolvedValue(undefined)

    const result = await authorizeWebCookie(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: cfg,
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting,
        captureCookies: vi.fn().mockResolvedValue([createCookie("yuque_session", "secret-value")]),
        getWebApi: vi.fn().mockResolvedValue({
          buildCookie: vi.fn().mockResolvedValue("yuque_session=secret-value"),
          updateCfg: vi.fn(),
          getMetaData: vi.fn().mockResolvedValue({ flag: true }),
        }),
        isAutoCaptureSupported: () => true,
      }
    )

    expect(result).toMatchObject({ status: "success", ok: true })
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isAuth).toBe(true)
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isEnabled).toBe(false)
  })

  it("does not authorize when no Cookie is captured", async () => {
    const dynCfg = createDynCfg({ isAuth: true })
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { password: "manual-cookie" },
    }
    const updateSetting = vi.fn().mockResolvedValue(undefined)

    const result = await authorizeWebCookie(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: createCfg({ password: "manual-cookie" }),
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting,
        captureCookies: vi.fn().mockResolvedValue([]),
        isAutoCaptureSupported: () => true,
      }
    )

    expect(result).toMatchObject({ status: "no_cookie", ok: false })
    expect(setting[dynCfg.platformKey].password).toBe("manual-cookie")
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isAuth).toBe(false)
    expect(updateSetting).toHaveBeenCalledWith(setting)
  })

  it("keeps the captured Cookie editable but does not authorize when metadata validation fails", async () => {
    const dynCfg = createDynCfg({ isAuth: true })
    const cfg = createCfg({ password: "old" })
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { password: "old" },
    }
    const updateSetting = vi.fn().mockResolvedValue(undefined)
    const onCookieChange = vi.fn()

    const result = await authorizeWebCookie(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: cfg,
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
        onCookieChange,
      },
      {
        getSetting: vi.fn(),
        updateSetting,
        captureCookies: vi.fn().mockResolvedValue([createCookie("yuque_session", "secret-value")]),
        getWebApi: vi.fn().mockResolvedValue({
          buildCookie: vi.fn().mockResolvedValue("yuque_session=secret-value"),
          updateCfg: vi.fn(),
          getMetaData: vi.fn().mockResolvedValue({ flag: false }),
        }),
        isAutoCaptureSupported: () => true,
      }
    )

    expect(result).toMatchObject({ status: "validation_failed", ok: false, cookie: "yuque_session=secret-value" })
    expect(cfg.password).toBe("yuque_session=secret-value")
    expect(onCookieChange).toHaveBeenCalledWith("yuque_session=secret-value")
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isAuth).toBe(false)
    expect(setting[dynCfg.platformKey].password).toBe("old")
  })

  it("does not write raw Cookie values into logs", async () => {
    const dynCfg = createDynCfg()
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: {},
    }
    const log = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    }

    await authorizeWebCookie(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: createCfg(),
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting: vi.fn().mockResolvedValue(undefined),
        captureCookies: vi.fn().mockResolvedValue([createCookie("ctoken", "raw-secret-token")]),
        getWebApi: vi.fn().mockResolvedValue({
          buildCookie: vi.fn().mockResolvedValue("ctoken=raw-secret-token"),
          updateCfg: vi.fn(),
          getMetaData: vi.fn().mockResolvedValue({ flag: true }),
        }),
        isAutoCaptureSupported: () => true,
        log,
      }
    )

    const serializedLogs = JSON.stringify(log.info.mock.calls)
    expect(serializedLogs).not.toContain("raw-secret-token")
    expect(serializedLogs).not.toContain("ctoken=raw-secret-token")
    expect(serializedLogs).toContain("cookieCount")
  })

  it.each([
    [SubPlatformType.Custom_CSDN, "custom_Csdn-test", "CSDN", "UserName=csdn-user; UserToken=secret"],
    [SubPlatformType.Custom_Zhihu, "custom_Zhihu-test", "知乎", "z_c0=secret; q_c1=token"],
  ])(
    "uses the shared WebAdaptor authorization flow for %s",
    async (subPlatformType, platformKey, platformName, builtCookie) => {
      const dynCfg = createWebDynCfg(subPlatformType, platformKey, platformName)
      const cfg = createCfg()
      const setting: Record<string, any> = {
        [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
        [dynCfg.platformKey]: { keepMe: "keep" },
      }
      const updateSetting = vi.fn().mockResolvedValue(undefined)
      const buildCookie = vi.fn().mockResolvedValue(builtCookie)
      const updateCfg = vi.fn()
      const getMetaData = vi.fn().mockResolvedValue({ flag: true, displayName: platformName })

      const result = await authorizeWebCookie(
        {
          platformKey: dynCfg.platformKey,
          currentCfg: cfg,
          dynCfg,
          setting,
          dynamicConfigArray: [dynCfg],
        },
        {
          getSetting: vi.fn(),
          updateSetting,
          captureCookies: vi.fn().mockResolvedValue([createCookie("session", "secret-value")]),
          getWebApi: vi.fn().mockResolvedValue({ buildCookie, updateCfg, getMetaData }),
          isAutoCaptureSupported: () => true,
        }
      )

      expect(result).toMatchObject({ status: "success", ok: true })
      expect(buildCookie).toHaveBeenCalledWith([expect.objectContaining({ name: "session" })])
      expect(getMetaData).toHaveBeenCalledTimes(1)
      expect(updateCfg).toHaveBeenCalledWith(expect.objectContaining({ password: builtCookie }))
      expect(setting[dynCfg.platformKey]).toMatchObject({
        keepMe: "keep",
        password: builtCookie,
        metadata: { flag: true, displayName: platformName },
      })
      expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isAuth).toBe(true)
      expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isEnabled).toBe(true)
      expect(updateSetting).toHaveBeenCalledWith(setting)
    }
  )
})

describe("logoutWebCookieAuthorization", () => {
  it("uses platform logoutWebAuth, clears local Cookie, and persists unauthenticated state", async () => {
    const dynCfg = createDynCfg({ isAuth: true })
    const cfg = createCfg({
      password: "yuque_session=test-session; yuque_ctoken=test-ctoken",
      metadata: { login: "test-login", keepMeta: true },
    })
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: {
        keepMe: "keep",
        password: "yuque_session=test-session; yuque_ctoken=test-ctoken",
      },
    }
    const updateSetting = vi.fn().mockResolvedValue(undefined)
    const logoutWebAuth = vi.fn().mockResolvedValue(true)
    const updateCfg = vi.fn()

    const result = await logoutWebCookieAuthorization(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: cfg,
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting,
        getWebApi: vi.fn().mockResolvedValue({ logoutWebAuth, updateCfg }),
      }
    )

    expect(result).toMatchObject({ status: "logout_success", ok: true, mode: "remote_action" })
    expect(logoutWebAuth).toHaveBeenCalledTimes(1)
    expect(updateCfg).toHaveBeenCalledWith(expect.objectContaining({ password: "" }))
    expect(setting[dynCfg.platformKey]).toMatchObject({
      keepMe: "keep",
      password: "",
      metadata: { login: "test-login", keepMeta: true },
    })
    expect(setting[DYNAMIC_CONFIG_KEY].totalCfg[0].isAuth).toBe(false)
    expect(updateSetting).toHaveBeenCalledWith(setting)
  })

  it("keeps logoutUrl fallback for non-Yuque platforms without clearing local Cookie implicitly", async () => {
    const dynCfg = createDynCfg({
      subPlatformType: SubPlatformType.Custom_Zhihu,
      platformKey: "custom_Zhihu-test",
      platformName: "知乎",
      logoutUrl: "https://www.zhihu.com/logout",
      isAuth: true,
    })
    const cfg = createCfg({ password: "zhihu-cookie=synthetic" })
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { password: "zhihu-cookie=synthetic" },
    }
    const openLogoutUrl = vi.fn()

    const result = await logoutWebCookieAuthorization(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: cfg,
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting: vi.fn().mockResolvedValue(undefined),
        getWebApi: vi.fn().mockResolvedValue({
          logoutWebAuth: vi.fn().mockResolvedValue(false),
        }),
        openLogoutUrl,
      }
    )

    expect(result).toMatchObject({ status: "url_fallback", ok: true, mode: "url_fallback" })
    expect(openLogoutUrl).toHaveBeenCalledWith("https://www.zhihu.com/logout")
    expect(setting[dynCfg.platformKey].password).toBe("zhihu-cookie=synthetic")
  })

  it.each([
    [
      SubPlatformType.Custom_CSDN,
      "custom_Csdn-test",
      "CSDN",
      "https://passport.csdn.net/account/logout",
      "UserName=csdn-user",
    ],
    [SubPlatformType.Custom_Zhihu, "custom_Zhihu-test", "知乎", "https://www.zhihu.com/logout", "z_c0=secret"],
  ])(
    "uses the shared logout fallback for %s without platform-specific UI logic",
    async (subPlatformType, platformKey, platformName, logoutUrl, password) => {
      const dynCfg = createDynCfg({
        subPlatformType,
        platformKey,
        platformName,
        logoutUrl,
        isAuth: true,
      })
      const setting: Record<string, any> = {
        [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
        [dynCfg.platformKey]: { password },
      }
      const openLogoutUrl = vi.fn()

      const result = await logoutWebCookieAuthorization(
        {
          platformKey: dynCfg.platformKey,
          currentCfg: createCfg({ password }),
          dynCfg,
          setting,
          dynamicConfigArray: [dynCfg],
        },
        {
          getSetting: vi.fn(),
          updateSetting: vi.fn().mockResolvedValue(undefined),
          getWebApi: vi.fn().mockResolvedValue({
            logoutWebAuth: vi.fn().mockResolvedValue(false),
          }),
          openLogoutUrl,
        }
      )

      expect(result).toMatchObject({ status: "url_fallback", ok: true, mode: "url_fallback", logoutUrl })
      expect(openLogoutUrl).toHaveBeenCalledWith(logoutUrl)
      expect(setting[dynCfg.platformKey].password).toBe(password)
    }
  )

  it("returns no_logout_method for Yuque when adapter logout is unavailable and never falls back to logout URL", async () => {
    const dynCfg = createDynCfg({ isAuth: true, logoutUrl: "https://www.yuque.com/logout" })
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { password: "yuque_session=test-session" },
    }
    const openLogoutUrl = vi.fn()

    const result = await logoutWebCookieAuthorization(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: createCfg({ password: "yuque_session=test-session" }),
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting: vi.fn().mockResolvedValue(undefined),
        getWebApi: vi.fn().mockResolvedValue({}),
        openLogoutUrl,
      }
    )

    expect(result).toMatchObject({ status: "no_logout_method", ok: false })
    expect(openLogoutUrl).not.toHaveBeenCalled()
  })

  it("returns structured persist_failed when remote logout succeeds but setting write fails", async () => {
    const dynCfg = createDynCfg({ isAuth: true })
    const setting: Record<string, any> = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg([dynCfg]),
      [dynCfg.platformKey]: { password: "yuque_session=test-session; yuque_ctoken=test-ctoken" },
    }

    const result = await logoutWebCookieAuthorization(
      {
        platformKey: dynCfg.platformKey,
        currentCfg: createCfg({ password: "yuque_session=test-session; yuque_ctoken=test-ctoken" }),
        dynCfg,
        setting,
        dynamicConfigArray: [dynCfg],
      },
      {
        getSetting: vi.fn(),
        updateSetting: vi.fn().mockRejectedValue(new Error("write failed token=secret-token")),
        getWebApi: vi.fn().mockResolvedValue({
          logoutWebAuth: vi.fn().mockResolvedValue(true),
          updateCfg: vi.fn(),
        }),
      }
    )

    expect(result.status).toBe("persist_failed")
    expect(result.ok).toBe(false)
    expect((result.error as Error).message).not.toContain("secret-token")
    expect((result.error as Error).message).toContain("<redacted>")
  })
})
