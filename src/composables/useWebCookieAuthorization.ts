/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {
  AuthMode,
  DynamicConfig,
  DynamicJsonCfg,
  getDynCfgByKey,
  replacePlatformByKey,
  setDynamicJsonCfg,
} from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"
import { openBrowserWindow } from "~/src/utils/widgetUtils.ts"
import Adaptors from "~/src/adaptors"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { Utils } from "~/src/utils/utils.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { ElectronCookie, PasswordType, WebConfig } from "zhi-blog-api"
import type { ISypConfig } from "~/syp.config.ts"

const logger = createAppLogger("web-cookie-authorization")

export type WebCookieAuthorizationStatus =
  | "success"
  | "unsupported"
  | "platform_not_found"
  | "not_cookie_platform"
  | "no_cookie"
  | "validation_failed"
  | "error"

export interface WebCookieAuthorizationResult {
  status: WebCookieAuthorizationStatus
  ok: boolean
  cookie?: string
  metadata?: any
  error?: unknown
}

export interface WebCookieAuthorizationInput {
  platformKey: string
  currentCfg?: WebConfig
  dynCfg?: DynamicConfig
  setting?: Partial<ISypConfig>
  dynamicConfigArray?: DynamicConfig[]
  onCookieChange?: (cookie: string) => void
}

export interface WebCookieAuthorizationDeps {
  getSetting: () => Promise<Partial<ISypConfig>>
  updateSetting: (setting: Partial<ISypConfig>) => Promise<void>
  getCfg?: (platformKey: string, storedCfg?: any) => Promise<WebConfig>
  getWebApi?: (platformKey: string, cfg: WebConfig) => Promise<any>
  captureCookies?: (authUrl: string, dynCfg: DynamicConfig) => Promise<ElectronCookie[]>
  isAutoCaptureSupported?: () => boolean
  log?: Pick<typeof logger, "info" | "warn" | "error" | "debug">
}

const normalizeStoredConfig = (storedConfig: unknown) => {
  if (storedConfig === null || storedConfig === undefined || StrUtil.isEmptyString(String(storedConfig))) {
    return {}
  }
  return JsonUtil.safeParse<any>(storedConfig, {} as any) ?? {}
}

const defaultGetCfg = async (platformKey: string, storedCfg?: any): Promise<WebConfig> => {
  return (await Adaptors.getCfg(platformKey, storedCfg)) as WebConfig
}

const defaultGetWebApi = async (platformKey: string, cfg: WebConfig): Promise<any> => {
  const appInstance = new PublisherAppInstance()
  const apiAdaptor = await Adaptors.getAdaptor(platformKey, cfg)
  return Utils.webApi(appInstance, apiAdaptor)
}

export const captureCookiesWithBrowserWindow = async (authUrl: string, dynCfg: DynamicConfig): Promise<ElectronCookie[]> => {
  return await new Promise<ElectronCookie[]>((resolve, reject) => {
    try {
      const cookieCallback = async (_dynCfg: DynamicConfig, cookies?: ElectronCookie[]) => {
        resolve(cookies ?? [])
      }
      const extraScriptCallback = async () => {}
      openBrowserWindow(authUrl, dynCfg, cookieCallback, extraScriptCallback)
    } catch (error) {
      reject(error)
    }
  })
}

const getDynamicConfigArray = (setting: Partial<ISypConfig>) => {
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  return dynJsonCfg?.totalCfg || []
}

const persistDynamicAuthState = async (
  deps: WebCookieAuthorizationDeps,
  setting: Partial<ISypConfig>,
  dynamicConfigArray: DynamicConfig[],
  dynCfg: DynamicConfig,
  isAuth: boolean
) => {
  dynCfg.isAuth = isAuth
  const nextDynamicConfigArray = replacePlatformByKey(dynamicConfigArray, dynCfg.platformKey, dynCfg)
  setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(nextDynamicConfigArray)
  await deps.updateSetting(setting)
}

const isCookieWebPlatform = (dynCfg: DynamicConfig, cfg: WebConfig) => {
  return dynCfg.authMode === AuthMode.WEBSITE && cfg.passwordType === PasswordType.PasswordType_Cookie
}

export const authorizeWebCookie = async (
  input: WebCookieAuthorizationInput,
  deps: WebCookieAuthorizationDeps
): Promise<WebCookieAuthorizationResult> => {
  const log = deps.log ?? logger
  const getCfg = deps.getCfg ?? defaultGetCfg
  const getWebApi = deps.getWebApi ?? defaultGetWebApi
  const captureCookies = deps.captureCookies ?? captureCookiesWithBrowserWindow
  const isAutoCaptureSupported = deps.isAutoCaptureSupported ?? EnvUtil.isSiyuanElectron

  if (!isAutoCaptureSupported()) {
    return { status: "unsupported", ok: false }
  }

  try {
    const setting = input.setting ?? (await deps.getSetting())
    const dynamicConfigArray = input.dynamicConfigArray ?? getDynamicConfigArray(setting)
    const dynCfg = input.dynCfg ?? getDynCfgByKey(dynamicConfigArray, input.platformKey)

    if (!dynCfg?.platformKey) {
      return { status: "platform_not_found", ok: false }
    }

    const storedCfg = normalizeStoredConfig(setting[input.platformKey])
    const cfg = input.currentCfg ?? (await getCfg(input.platformKey, storedCfg))

    if (!isCookieWebPlatform(dynCfg, cfg)) {
      return { status: "not_cookie_platform", ok: false }
    }

    if (StrUtil.isEmptyString(dynCfg.authUrl)) {
      log.warn("web cookie authorization skipped because authUrl is empty", { platformKey: input.platformKey })
      return { status: "error", ok: false, error: new Error("authUrl is empty") }
    }

    const cookies = await captureCookies(dynCfg.authUrl, dynCfg)
    log.info("web cookie capture finished", {
      platformKey: input.platformKey,
      cookieCount: cookies?.length ?? 0,
    })

    if (!cookies || cookies.length === 0) {
      await persistDynamicAuthState(deps, setting, dynamicConfigArray, dynCfg, false)
      return { status: "no_cookie", ok: false }
    }

    const api = await getWebApi(input.platformKey, cfg)
    const cookie = await api.buildCookie(cookies)
    input.onCookieChange?.(cookie)
    cfg.password = cookie
    api.updateCfg(cfg)

    const metadata = await api.getMetaData()
    if (metadata?.flag === true) {
      cfg.metadata = metadata
      const previousStoredCfg = normalizeStoredConfig(setting[input.platformKey])
      setting[input.platformKey] = {
        ...previousStoredCfg,
        ...cfg,
      }
      dynCfg.isAuth = true
      const nextDynamicConfigArray = replacePlatformByKey(dynamicConfigArray, dynCfg.platformKey, dynCfg)
      setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(nextDynamicConfigArray)
      await deps.updateSetting(setting)
      return { status: "success", ok: true, cookie, metadata }
    }

    await persistDynamicAuthState(deps, setting, dynamicConfigArray, dynCfg, false)
    return { status: "validation_failed", ok: false, cookie, metadata }
  } catch (error) {
    log.error("web cookie authorization failed", {
      platformKey: input.platformKey,
      error: error instanceof Error ? error.message : String(error ?? "unknown error"),
    })
    return { status: "error", ok: false, error }
  }
}

export const useWebCookieAuthorization = () => {
  const { getSetting, updateSetting } = usePublishSettingStore()

  return {
    isAutoCaptureSupported: EnvUtil.isSiyuanElectron,
    authorize: (input: WebCookieAuthorizationInput) =>
      authorizeWebCookie(input, {
        getSetting,
        updateSetting,
      }),
  }
}
