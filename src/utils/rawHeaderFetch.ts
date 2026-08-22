/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import PluginFetchUtil from "~/src/utils/PluginFetchUtil.ts"

/**
 * 大小写保真的请求通道。
 *
 * 背景：volcengine（字节 ImageX/TOS）网关对签名请求的客户端形态极其挑剔，
 * 2026-08-22 实测矩阵（详见 .planning/2026-08-22-juejin-native-upload/findings.md）：
 *   - node-fetch-cjs（plugin-node-fetch 底层）：头名小写化 → 100024 InvalidAuthorization
 *   - node:https 原始套接字（任意头组合/大小写/顺序，含手写 TLS 字节）：一律 100024
 *   - undici fetch（无论全局还是 vendored）：始终通过
 * 差异深达 TLS/HTTP 客户端栈本身，无法在 http 模块层面补救，因此本通道
 * 首选插件内置的 undici（libs/undici），宿主不可用时回退 node:https，
 * 两者都不可用返回 undefined，由调用方回退统一 facade（webFetch/apiFetch）。
 */

export interface RawFetchRequest {
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  /** 文本或二进制 body；GET 不传 */
  params?: string | Uint8Array
}

export interface RawFetchResponse {
  status: number
  text: string
}

export type CasePreservingNodeFetch = (request: RawFetchRequest) => Promise<RawFetchResponse>

const resolveHttpsModule = (appInstance?: PublisherAppInstance): any => {
  const win = appInstance?.win
  if (!appInstance || typeof win?.require !== "function") {
    return undefined
  }
  for (const id of ["node:https", "https"]) {
    try {
      const mod = win.require(id)
      if (mod && typeof mod.request === "function") {
        return mod
      }
    } catch (e) {
      // 继续尝试下一个模块标识
    }
  }
  return undefined
}

/**
 * 创建大小写保真 fetch；引擎链：内置 undici → node:https → undefined（调用方回退 facade）。
 */
const createCasePreservingNodeFetch = (appInstance?: PublisherAppInstance): CasePreservingNodeFetch | undefined => {
  const win = appInstance?.win
  if (!appInstance || typeof win?.require !== "function") {
    return undefined
  }

  // 1) 首选：插件内置 undici（实测唯一被 volcengine 网关接受的 Node 客户端栈）。
  //    注意必须用底层 request() 而非 fetch()：Electron renderer 下 undici fetch 的
  //    Response/WebStream 层与 Chromium 全局流类不兼容会永久挂起，request() 正常。
  try {
    const undiciPath = PluginFetchUtil.pluginLibPath(appInstance, "libs/undici/dist/index.cjs")
    const undici = win.require(undiciPath)
    const doRequest = undici?.request ?? undici?.default?.request
    if (typeof doRequest === "function") {
      return async (request: RawFetchRequest): Promise<RawFetchResponse> => {
        const headers: Record<string, string> = {}
        for (const [key, value] of Object.entries(request.headers ?? {})) {
          if (value != null) {
            headers[key] = String(value)
          }
        }
        const isGet = request.method === "GET"
        const body =
          isGet || request.params == null
            ? undefined
            : typeof request.params === "string"
              ? request.params
              : new Uint8Array(request.params)
        const res = await doRequest(request.url, {
          method: request.method,
          headers,
          ...(body !== undefined ? { body } : {}),
          headersTimeout: 30000,
          bodyTimeout: 30000,
        })
        const text = await res.body.text()
        return { status: Number(res.statusCode), text }
      }
    }
  } catch (e) {
    // 引擎不可用，继续回退
  }

  // 2) 回退：node:https 原始头写出（供其他对头名大小写敏感、但对客户端栈不挑剔的场景使用）
  const httpsMod = resolveHttpsModule(appInstance)
  if (!httpsMod) {
    return undefined
  }

  return (request: RawFetchRequest): Promise<RawFetchResponse> => {
    return new Promise<RawFetchResponse>((resolve, reject) => {
      let parsed: URL
      try {
        parsed = new URL(request.url)
      } catch (e) {
        reject(new Error("case-preserving fetch 无效 URL => " + request.url))
        return
      }

      // 头名按调用方原样写出（这正是本通道存在的意义）
      const reqHeaders: Record<string, string> = {}
      for (const [key, value] of Object.entries(request.headers ?? {})) {
        if (value != null) {
          reqHeaders[key] = String(value)
        }
      }

      const hasBody = request.method !== "GET" && request.params != null
      const body = hasBody
        ? typeof request.params === "string"
          ? Buffer.from(request.params, "utf8")
          : Buffer.from(request.params as Uint8Array)
        : undefined
      if (body && !Object.keys(reqHeaders).some((k) => k.toLowerCase() === "content-type")) {
        reqHeaders["Content-Type"] = "application/octet-stream"
      }
      // 显式 Content-Length，避免依赖分块语义
      reqHeaders["Content-Length"] = String(body ? body.length : 0)

      const upstream = httpsMod.request(
        {
          hostname: parsed.hostname,
          port: parsed.port || 443,
          path: parsed.pathname + parsed.search,
          method: request.method,
          headers: reqHeaders,
        },
        (res: any) => {
          const chunks: Buffer[] = []
          res.on("data", (c: Buffer) => chunks.push(c))
          res.on("end", () => {
            resolve({ status: Number(res.statusCode), text: Buffer.concat(chunks).toString("utf8") })
          })
        }
      )
      upstream.on("error", reject)
      if (body) {
        upstream.write(body)
      }
      upstream.end()
    })
  }
}

/** @internal 单测用 */
const rawHeaderFetchTestExports = {
  resolveHttpsModule,
}

export { createCasePreservingNodeFetch, rawHeaderFetchTestExports }
