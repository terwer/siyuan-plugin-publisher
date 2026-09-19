/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/** V2 发布传输通道（XML / multipart / 预留 JSON） */
type PublishTransportKind =
  | "plugin-node-fetch"
  | "siyuan-forward-proxy"
  | "middleware-fetch"
  /** 预留：后续 jsonFetchTransport 迁入，禁止在 useProxy 再长平行 resolve 树 */
  | "json-fetch-plugin"
  | "json-fetch-proxy"

/** multipart 对外统一通道（与 XML-RPC 的 middleware-fetch 语义一致） */
type FormUploadTransport = "plugin-node-fetch" | "siyuan-forward-proxy" | "middleware-fetch"

interface PublishTransportDiagnostic {
  stage?: string
  transport?: string
  url?: string
  status?: number
  responseBodyPreview?: string
  errorName?: string
  errorMessage?: string
}

interface FormUploadResult {
  json: Record<string, unknown>
  transport: FormUploadTransport
  diagnostic?: PublishTransportDiagnostic
}

export type {
  PublishTransportKind,
  FormUploadTransport,
  PublishTransportDiagnostic,
  FormUploadResult,
}
