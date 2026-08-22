/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JsonUtil, StrUtil } from "zhi-common"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import PluginFetchUtil from "~/src/utils/PluginFetchUtil.ts"
import { resolvePublishTransport } from "~/src/utils/publishTransport/resolveTransport.ts"
import type {
  JsonFetchMethod,
  JsonFetchRequest,
  JsonFetchTransport,
  JsonPayloadEncoding,
  JsonResponseEncoding,
} from "~/src/utils/publishTransport/jsonTypes.ts"
import type { PublishTransportDiagnostic } from "~/src/utils/publishTransport/types.ts"
import type { ILogger } from "~/src/utils/appLogger.ts"

interface JsonFetchClientDeps {
  appInstance: PublisherAppInstance
  isUseSiyuanProxy: boolean
  isInSiyuanOrSiyuanNewWin: () => boolean
  siyuanForwardProxyFetch: (
    url: string,
    headers: any[],
    params: any,
    method: JsonFetchMethod,
    contentType: string,
    forceProxy: boolean,
    payloadEncoding: JsonPayloadEncoding,
    responseEncoding: JsonResponseEncoding
  ) => Promise<unknown>
  middlewareFetch: (
    url: string,
    headers: any[],
    params: any,
    method: JsonFetchMethod
  ) => Promise<unknown>
  logger?: ILogger
  buildDiagnosticPreview?: (input: unknown) => string
  attachDiagnosticError?: (error: unknown, diagnostic?: PublishTransportDiagnostic) => void
}

function resolveJsonFetchTransport(
  deps: JsonFetchClientDeps,
  request: JsonFetchRequest
): JsonFetchTransport {
  return resolvePublishTransport({
    forceProxy: request.forceProxy ?? false,
    isInSiyuanOrSiyuanNewWin: deps.isInSiyuanOrSiyuanNewWin(),
    isUseSiyuanProxy: deps.isUseSiyuanProxy,
    canUsePluginFetch: PluginFetchUtil.canUsePluginFetch(deps.appInstance),
  })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !isBodyInit(value)
}

function isBodyInit(value: unknown): value is BodyInit {
  if (value == null || typeof value === "string") {
    return false
  }
  if (typeof FormData !== "undefined" && value instanceof FormData) {
    return true
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return true
  }
  if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) {
    return true
  }
  if (value instanceof ArrayBuffer) {
    return true
  }
  if (ArrayBuffer.isView(value)) {
    return true
  }
  if (typeof ReadableStream !== "undefined" && value instanceof ReadableStream) {
    return true
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return true
  }
  return false
}

function buildRequestBody(
  method: JsonFetchMethod,
  params: any,
  contentType: string
): BodyInit | undefined {
  if (method === "GET" || method === "HEAD") {
    return undefined
  }
  if (params == null) {
    return undefined
  }
  if (typeof params === "string") {
    return params
  }
  if (isBodyInit(params)) {
    return params
  }
  if (isPlainObject(params) && contentType.includes("application/json")) {
    return JSON.stringify(params)
  }
  return params
}

function buildPluginRequestHeaders(
  header: Record<string, unknown>,
  contentType: string,
  body: BodyInit | undefined
): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(header)) {
    // 只保留一个规范的 Content-Type：跳过调用方传入的任何大小写变体，
    // 避免发出重复的 content-type 头导致严格服务端（如掘金）无法解析 JSON body。
    if (value != null && key.toLowerCase() !== "content-type") {
      headers[key] = String(value)
    }
  }
  const skipContentType = typeof FormData !== "undefined" && body instanceof FormData
  if (!skipContentType && !StrUtil.isEmptyString(contentType)) {
    headers["Content-Type"] = contentType
  }
  return headers
}

function getResponseContentType(res: Response): string {
  return res.headers.get("content-type") ?? ""
}

function encodeBufferAsResponseBody(buf: Buffer, responseEncoding: JsonResponseEncoding): string {
  switch (responseEncoding) {
    case "text":
      return buf.toString("utf8")
    case "base64":
    case "base64-std":
      return buf.toString("base64")
    case "base64-url":
      return buf.toString("base64url")
    case "hex":
      return buf.toString("hex")
    case "base32":
    case "base32-std":
    case "base32-hex":
      return buf.toString("base64")
    default:
      return buf.toString("base64")
  }
}

function parsePluginTextResponse(bodyText: string, responseContentType: string): any {
  const mime = responseContentType.split(";")[0].trim().toLowerCase()
  if (mime === "application/json" || mime.endsWith("+json")) {
    return JsonUtil.safeParse<any>(bodyText, {} as any)
  }
  if (mime === "text/html" || mime === "text/xml") {
    return bodyText
  }
  return bodyText
}

function throwPluginHttpError(
  status: number,
  bodyText: string,
  diagnostic?: PublishTransportDiagnostic
): never {
  if (diagnostic) {
    diagnostic.status = status
  }
  const err = new Error(StrUtil.isEmptyString(bodyText) ? `HTTP request failed (${status})` : bodyText)
  ;(err as any).status = status
  if (diagnostic) {
    ;(err as any).diagnostic = diagnostic
  }
  throw err
}

async function runPluginJsonFetch(
  deps: JsonFetchClientDeps,
  request: JsonFetchRequest,
  diagnostic?: PublishTransportDiagnostic
): Promise<unknown> {
  const {
    url,
    headers,
    params,
    method = "GET",
    contentType = "application/json",
    responseEncoding = "text",
  } = request
  const header = headers.length > 0 ? headers[0] : {}
  const doFetch = PluginFetchUtil.getPluginNodeFetch(deps.appInstance, deps.logger)
  const body = buildRequestBody(method, params, contentType)
  const res = await doFetch(url, {
    method,
    headers: buildPluginRequestHeaders(header, contentType, body),
    body,
  })
  const status = Number(res.status)
  const responseContentType = getResponseContentType(res)
  const arrayBuffer = await res.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)
  const bodyText = buf.toString("utf8")

  if (diagnostic) {
    diagnostic.status = status
    if (deps.buildDiagnosticPreview) {
      diagnostic.responseBodyPreview = deps.buildDiagnosticPreview(bodyText)
    }
  }

  if (!(status >= 200 && status < 300)) {
    throwPluginHttpError(status, bodyText, diagnostic)
  }

  if (responseEncoding !== "text") {
    return {
      body: encodeBufferAsResponseBody(buf, responseEncoding),
      status,
      contentType: responseContentType,
    }
  }

  return parsePluginTextResponse(bodyText, responseContentType)
}

async function runJsonFetchTransport(
  transport: JsonFetchTransport,
  deps: JsonFetchClientDeps,
  request: JsonFetchRequest
): Promise<unknown> {
  const {
    url,
    headers,
    params,
    method = "GET",
    contentType = "application/json",
    forceProxy = false,
    payloadEncoding = "text",
    responseEncoding = "text",
    diagnostic,
  } = request
  const { logger, attachDiagnosticError } = deps

  logger?.info(`[json-fetch-transport] transport => ${transport}`, url)

  const run = async (): Promise<unknown> => {
    switch (transport) {
      case "plugin-node-fetch": {
        if (diagnostic) {
          diagnostic.stage = "plugin-node-fetch"
          diagnostic.transport = "plugin-node-fetch"
          diagnostic.url = url
        }
        return await runPluginJsonFetch(deps, request, diagnostic)
      }
      case "siyuan-forward-proxy": {
        if (diagnostic) {
          diagnostic.stage = "forward-proxy"
          diagnostic.transport = "siyuan-forward-proxy"
          diagnostic.url = url
        }
        return await deps.siyuanForwardProxyFetch(
          url,
          headers,
          params,
          method,
          contentType,
          forceProxy,
          payloadEncoding,
          responseEncoding
        )
      }
      case "middleware-fetch": {
        if (diagnostic) {
          diagnostic.stage = "middleware"
          diagnostic.transport = "middleware-fetch"
          diagnostic.url = url
        }
        return await deps.middlewareFetch(url, headers, params, method)
      }
    }
  }

  try {
    return await run()
  } catch (e) {
    attachDiagnosticError?.(e, diagnostic)
    throw e
  }
}

/**
 * JSON/API 发布请求唯一对外入口：基类只应使用 `createJsonFetchClient(...).fetch(...)`。
 */
function createJsonFetchClient(deps: JsonFetchClientDeps) {
  return {
    async fetch(request: JsonFetchRequest): Promise<any> {
      const transport = resolveJsonFetchTransport(deps, request)
      return await runJsonFetchTransport(transport, deps, request)
    },
  }
}

/** @internal 单测用 */
const jsonFetchTransportTestExports = {
  resolveJsonFetchTransport: (deps: JsonFetchClientDeps, request: JsonFetchRequest) =>
    resolveJsonFetchTransport(deps, request),
  buildRequestBody,
  buildPluginRequestHeaders,
  encodeBufferAsResponseBody,
  isBodyInit,
}

export type { JsonFetchClientDeps }
export { createJsonFetchClient, jsonFetchTransportTestExports }
