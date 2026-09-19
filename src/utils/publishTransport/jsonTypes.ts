/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PublishTransportDiagnostic } from "~/src/utils/publishTransport/types.ts"

/** JSON/API 发布传输通道（与 multipart、XML-RPC 对外命名一致） */
type JsonFetchTransport = "plugin-node-fetch" | "siyuan-forward-proxy" | "middleware-fetch"

type JsonFetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"

type JsonPayloadEncoding =
  | "text"
  | "base64"
  | "base64-std"
  | "base64-url"
  | "base32"
  | "base32-std"
  | "base32-hex"
  | "hex"

type JsonResponseEncoding =
  | "text"
  | "base64"
  | "base64-std"
  | "base64-url"
  | "base32"
  | "base32-std"
  | "base32-hex"
  | "hex"

interface JsonFetchRequest {
  url: string
  headers: any[]
  params?: any
  method?: JsonFetchMethod
  contentType?: string
  forceProxy?: boolean
  payloadEncoding?: JsonPayloadEncoding
  responseEncoding?: JsonResponseEncoding
  diagnostic?: PublishTransportDiagnostic
}

export type {
  JsonFetchTransport,
  JsonFetchMethod,
  JsonPayloadEncoding,
  JsonResponseEncoding,
  JsonFetchRequest,
}
