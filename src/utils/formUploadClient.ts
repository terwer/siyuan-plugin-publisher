/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JsonUtil } from "zhi-common"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import FormDataHostUtil from "~/src/utils/FormDataHostUtil.ts"
import PluginFetchUtil from "~/src/utils/PluginFetchUtil.ts"
import { resolvePublishTransport } from "~/src/utils/publishTransport/resolveTransport.ts"
import type {
  FormUploadResult,
  FormUploadTransport,
  PublishTransportDiagnostic,
} from "~/src/utils/publishTransport/types.ts"
import type { ILogger } from "~/src/utils/appLogger.ts"

interface FormUploadClientDeps {
  appInstance: PublisherAppInstance
  isUseSiyuanProxy: boolean
  isInSiyuanOrSiyuanNewWin: () => boolean
  forwardProxyFormPost: (
    url: string,
    headers: any[],
    formData: BodyInit,
    forceProxy: boolean
  ) => Promise<{ body: string; status?: number }>
  middlewareFormPost: (url: string, headers: any[], formData: BodyInit) => Promise<unknown>
  /** CORS 受限平台要求强制走新 CORS 代理 */
  isCorsProxy?: boolean
  logger?: ILogger
  parseJson?: (text: string) => Record<string, unknown>
  buildDiagnosticPreview?: (input: unknown) => string
  attachDiagnosticError?: (error: unknown, diagnostic?: PublishTransportDiagnostic) => void
}

interface FormUploadJsonRequest {
  url: string
  headers: any[]
  formData: BodyInit
  forceProxy?: boolean
  diagnostic?: PublishTransportDiagnostic
}

interface FormUploadResolveContext {
  forceProxy: boolean
  isInSiyuanOrSiyuanNewWin: boolean
  isUseSiyuanProxy: boolean
  canUsePluginFetch: boolean
  isCorsProxy?: boolean
}

function resolveFormUploadTransport(ctx: FormUploadResolveContext): FormUploadTransport {
  return resolvePublishTransport(ctx)
}

async function runFormUploadTransport(
  transport: FormUploadTransport,
  deps: FormUploadClientDeps,
  request: FormUploadJsonRequest
): Promise<FormUploadResult> {
  const {
    appInstance,
    logger,
    parseJson = (text) => JsonUtil.safeParse<Record<string, unknown>>(text, {}),
    buildDiagnosticPreview,
    attachDiagnosticError,
  } = deps
  const { url, headers, formData, forceProxy = false, diagnostic } = request
  const header = headers.length > 0 ? headers[0] : {}

  logger?.info(`[form-upload-transport] transport => ${transport}`, url)

  const run = async (): Promise<FormUploadResult> => {
    switch (transport) {
      case "plugin-node-fetch": {
        if (diagnostic) {
          diagnostic.stage = "zhi-formdata-fetch"
          diagnostic.transport = "plugin-node-fetch"
          diagnostic.url = url
        }
        const doFetch = FormDataHostUtil.getFormDataFetch(appInstance)
        const resText = await doFetch(appInstance.moduleBase, url, header, formData)
        if (diagnostic && buildDiagnosticPreview) {
          diagnostic.responseBodyPreview = buildDiagnosticPreview(resText)
        }
        return { json: parseJson(resText), transport }
      }
      case "siyuan-forward-proxy": {
        if (diagnostic) {
          diagnostic.stage = "forward-proxy"
          diagnostic.transport = "siyuan-forward-proxy"
          diagnostic.url = url
        }
        const fetchResult = await deps.forwardProxyFormPost(url, headers, formData, forceProxy)
        if (diagnostic) {
          diagnostic.status = Number(fetchResult?.status)
        }
        if (diagnostic && buildDiagnosticPreview) {
          diagnostic.responseBodyPreview = buildDiagnosticPreview(fetchResult.body)
        }
        return { json: parseJson(fetchResult.body), transport }
      }
      case "middleware-fetch": {
        if (diagnostic) {
          diagnostic.stage = "middleware"
          diagnostic.transport = "middleware-fetch"
          diagnostic.url = url
        }
        const resJson = await deps.middlewareFormPost(url, headers, formData)
        if (diagnostic && buildDiagnosticPreview) {
          diagnostic.responseBodyPreview = buildDiagnosticPreview(resJson)
        }
        const json =
          resJson != null && typeof resJson === "object"
            ? (resJson as Record<string, unknown>)
            : parseJson(String(resJson))
        return { json, transport }
      }
    }
  }

  try {
    const result = await run()
    return { ...result, diagnostic }
  } catch (e) {
    attachDiagnosticError?.(e, diagnostic)
    throw e
  }
}

/**
 * Multipart 上传唯一对外入口：基类只应使用 `createFormUploadClient(...).postJson(...)`。
 */
function createFormUploadClient(deps: FormUploadClientDeps) {
  return {
    async postJson(request: FormUploadJsonRequest): Promise<Record<string, unknown>> {
      const transport = resolveFormUploadTransport({
        forceProxy: request.forceProxy ?? false,
        isInSiyuanOrSiyuanNewWin: deps.isInSiyuanOrSiyuanNewWin(),
        isUseSiyuanProxy: deps.isUseSiyuanProxy,
        canUsePluginFetch: PluginFetchUtil.canUsePluginFetch(deps.appInstance),
        isCorsProxy: deps.isCorsProxy,
      })
      const { json } = await runFormUploadTransport(transport, deps, request)
      return json
    },
  }
}

/** @internal 单测用 */
const formUploadTransportTestExports = {
  resolveFormUploadTransport,
}

export type { FormUploadClientDeps, FormUploadJsonRequest }
export { createFormUploadClient, formUploadTransportTestExports }
