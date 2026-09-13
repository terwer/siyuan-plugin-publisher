/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { appBase } from "~/src/utils/constants.ts"
import PluginFetchUtil from "~/src/utils/PluginFetchUtil.ts"

type AliOssConstructor = new (options: Record<string, unknown>) => any

interface AliOssClientOptions {
  appInstance?: PublisherAppInstance
  scriptUrl?: string
  globalObject?: any
  documentRef?: Document | null
}

const ALI_OSS_SDK_PATH = "libs/alioss/aliyun-oss-sdk-6.16.0.min.js"
const ALI_OSS_SCRIPT_MARK = "data-syp-aliyun-oss-sdk"

let browserSdkLoadPromise: Promise<AliOssConstructor> | undefined

const pickAliOssConstructor = (candidate: any): AliOssConstructor | undefined => {
  const ctor = candidate?.default ?? candidate?.OSS ?? candidate
  return typeof ctor === "function" ? (ctor as AliOssConstructor) : undefined
}

const getGlobalAliOssConstructor = (globalObject: any = globalThis): AliOssConstructor | undefined => {
  return pickAliOssConstructor(globalObject?.OSS)
}

const loadAliOssConstructorFromPlugin = (appInstance?: PublisherAppInstance): AliOssConstructor | undefined => {
  const win = appInstance?.win
  if (!appInstance || typeof win?.require !== "function") {
    return undefined
  }

  try {
    const sdkPath = PluginFetchUtil.pluginLibPath(appInstance, ALI_OSS_SDK_PATH)
    const requiredSdk = win.require(sdkPath)
    return (
      pickAliOssConstructor(requiredSdk) ??
      getGlobalAliOssConstructor(win) ??
      getGlobalAliOssConstructor(globalThis)
    )
  } catch {
    return undefined
  }
}

const getDefaultAliOssScriptUrl = () => {
  const base = appBase || "/plugins/siyuan-plugin-publisher/"
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return `${normalizedBase}${ALI_OSS_SDK_PATH}`
}

const loadAliOssConstructorFromScript = (options: AliOssClientOptions = {}): Promise<AliOssConstructor> => {
  const globalObject = options.globalObject ?? globalThis
  const documentRef =
    options.documentRef !== undefined
      ? options.documentRef
      : (globalObject?.document ?? (typeof document === "undefined" ? undefined : document))

  if (!documentRef) {
    return Promise.reject(new Error("Aliyun OSS SDK is not available and cannot be loaded without a browser document"))
  }

  const scriptUrl = options.scriptUrl ?? getDefaultAliOssScriptUrl()
  return new Promise((resolve, reject) => {
    const existingScript = documentRef.querySelector?.(`script[${ALI_OSS_SCRIPT_MARK}="true"]`) as
      | HTMLScriptElement
      | null
    existingScript?.remove()
    const script = documentRef.createElement("script")

    script.setAttribute(ALI_OSS_SCRIPT_MARK, "true")
    script.async = true
    script.src = scriptUrl
    script.onload = () => {
      const ctor = getGlobalAliOssConstructor(globalObject) ?? getGlobalAliOssConstructor(globalThis)
      if (ctor) {
        resolve(ctor)
        return
      }
      reject(new Error("Aliyun OSS SDK loaded but global OSS constructor is missing"))
    }
    script.onerror = () => reject(new Error(`Failed to load Aliyun OSS SDK from ${scriptUrl}`))

    ;(documentRef.head ?? documentRef.body ?? documentRef.documentElement).appendChild(script)
  })
}

const resolveAliOssConstructor = async (options: AliOssClientOptions = {}): Promise<AliOssConstructor> => {
  const globalCtor = getGlobalAliOssConstructor(options.globalObject) ?? getGlobalAliOssConstructor(globalThis)
  if (globalCtor) {
    return globalCtor
  }

  const pluginCtor = loadAliOssConstructorFromPlugin(options.appInstance)
  if (pluginCtor) {
    return pluginCtor
  }

  if (!browserSdkLoadPromise) {
    browserSdkLoadPromise = loadAliOssConstructorFromScript(options).catch((e) => {
      browserSdkLoadPromise = undefined
      throw e
    })
  }
  return browserSdkLoadPromise
}

/**
 * 获取 OSS 客户端
 *
 * @param endpoint - OSS服务的访问域名
 * @param bucket - 存储空间名称
 * @param token - 访问令牌
 * @param options - 宿主/加载选项
 * @returns - 返回一个OSS客户端对象
 *
 * @see [简单上传 | 阿里云 OSS](https://help.aliyun.com/zh/oss/developer-reference/simple-upload-8?spm=a2c4g.11186623.0.0.7e531769TAYbAL#concept-2161572)
 */
const getAliOssClient = async (endpoint: string, bucket: string, token: any, options: AliOssClientOptions = {}) => {
  const OSS = await resolveAliOssConstructor(options)
  return new OSS({
    endpoint: endpoint,
    accessKeyId: token.access_id,
    accessKeySecret: token.access_key,
    stsToken: token.access_token,
    cname: true,
    bucket: bucket,
  })
}

const aliOssTestExports = {
  ALI_OSS_SDK_PATH,
  getDefaultAliOssScriptUrl,
  pickAliOssConstructor,
  resolveAliOssConstructor,
  resetAliOssSdkLoadPromise: () => {
    browserSdkLoadPromise = undefined
  },
}

export { getAliOssClient, aliOssTestExports }
