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

const extractTextField = (record: Record<string, unknown>): string | undefined => {
  for (const key of ["body", "data", "text", "content", "result"] as const) {
    const candidate = record[key]
    if (typeof candidate === "string") {
      return candidate
    }
    if (candidate != null && (typeof candidate === "number" || typeof candidate === "boolean")) {
      return String(candidate)
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
    const extracted = extractTextField(record)
    if (extracted != null) {
      return maybeDecodeBase64Xml(extracted)
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
