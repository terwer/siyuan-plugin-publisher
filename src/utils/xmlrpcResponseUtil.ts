/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Buffer } from "node:buffer"

const XML_MARKERS = ["<?xml", "<methodResponse", "<fault>"]

const FORWARD_PROXY_TEXT_KEYS = [
  "body",
  "Body",
  "data",
  "Data",
  "text",
  "content",
  "result",
  "response",
  "payload",
] as const

const FORWARD_PROXY_ENCODING_KEYS = ["bodyEncoding", "BodyEncoding", "encoding"] as const

const looksLikeXml = (text: string) => {
  const trimmed = text.trim()
  return XML_MARKERS.some((marker) => trimmed.includes(marker))
}

const maybeDecodeBase64Xml = (text: string): string => {
  const trimmed = text.trim()
  if (looksLikeXml(trimmed)) {
    return trimmed
  }

  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(trimmed) || trimmed.length < 16) {
    return trimmed
  }

  try {
    const decoded = Buffer.from(trimmed.replace(/\s/g, ""), "base64").toString("utf8")
    if (looksLikeXml(decoded)) {
      return decoded
    }
  } catch {
    // keep original text
  }

  return trimmed
}

const getForwardProxyEncoding = (record: Record<string, unknown>): string | undefined => {
  for (const key of FORWARD_PROXY_ENCODING_KEYS) {
    const candidate = record[key]
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate
    }
  }
  return undefined
}

const decodeByBodyEncoding = (text: string, encoding?: string): string => {
  const enc = encoding?.toLowerCase() ?? ""
  if (enc.includes("base64")) {
    try {
      const decoded = Buffer.from(text.replace(/\s/g, ""), "base64").toString("utf8")
      return maybeDecodeBase64Xml(decoded)
    } catch {
      return maybeDecodeBase64Xml(text)
    }
  }
  return maybeDecodeBase64Xml(text)
}

const extractTextField = (record: Record<string, unknown>): string | undefined => {
  const encoding = getForwardProxyEncoding(record)

  for (const key of FORWARD_PROXY_TEXT_KEYS) {
    const candidate = record[key]
    if (typeof candidate === "string" && candidate.length > 0) {
      return decodeByBodyEncoding(candidate, encoding)
    }
    if (candidate != null && (typeof candidate === "number" || typeof candidate === "boolean")) {
      return String(candidate)
    }
    if (candidate != null && typeof candidate === "object") {
      const nested = extractTextField(candidate as Record<string, unknown>)
      if (nested != null) {
        return nested
      }
    }
  }
  return undefined
}

const findXmlTextDeep = (value: unknown, depth = 0): string | undefined => {
  if (depth > 6) {
    return undefined
  }
  if (typeof value === "string" && value.trim() !== "") {
    const decoded = maybeDecodeBase64Xml(value)
    if (looksLikeXml(decoded)) {
      return decoded
    }
  }
  if (value != null && typeof value === "object") {
    const fromFields = extractTextField(value as Record<string, unknown>)
    if (fromFields != null) {
      return fromFields
    }
    for (const child of Object.values(value as Record<string, unknown>)) {
      const found = findXmlTextDeep(child, depth + 1)
      if (found != null) {
        return found
      }
    }
  }
  return undefined
}

/**
 * Normalize proxy fetch output to XML text before XmlrpcUtil.removeXmlHeader.
 * forwardProxy / middleware may return a wrapper object instead of a raw string.
 */
export function normalizeXmlrpcResponseText(raw: unknown): string {
  if (typeof raw === "string") {
    return maybeDecodeBase64Xml(raw)
  }

  if (raw != null && typeof raw === "object") {
    const record = raw as Record<string, unknown>
    const extracted = extractTextField(record) ?? findXmlTextDeep(record)
    if (extracted != null) {
      return extracted
    }

    if (Object.keys(record).length === 0) {
      throw new Error(
        "XML-RPC proxy returned an empty response object (middleware may have parsed XML as JSON instead of text)."
      )
    }
  }

  if (raw == null) {
    return ""
  }

  const fallback = String(raw)
  if (fallback === "[object Object]") {
    throw new Error("XML-RPC proxy returned a non-text response object. Check forwardProxy/middleware response shape.")
  }

  return maybeDecodeBase64Xml(fallback)
}
