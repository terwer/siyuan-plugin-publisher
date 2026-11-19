/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 代理响应体编码。
 *
 * 与 `useProxy.siyuanProxyFetch` 的 `responseEncoding` 参数保持一致；
 * 读取二进制（例如图片）时用 `base64`，此时错误响应体也是 base64 编码的。
 */
export type ProxyResponseEncoding =
  | "text"
  | "base64"
  | "base64-std"
  | "base64-url"
  | "base32"
  | "base32-std"
  | "base32-hex"
  | "hex"

/**
 * 按响应编码把代理返回的原始 body 还原成文本。
 *
 * 主要用于非 2xx 响应：思源 `forwardProxy` 在 `responseEncoding=base64` 时
 * 会把错误 JSON 也编码成 base64，不先解码就取不到 `msg`，最终把 base64 串
 * 当成错误信息展示（issue #2028）。
 */
export function decodeProxyResponseBody(raw: unknown, encoding: ProxyResponseEncoding | string = "text"): string {
  if (typeof raw !== "string" || raw.length === 0) {
    return ""
  }

  try {
    switch (encoding) {
      case "base64":
      case "base64-std":
        return Buffer.from(raw, "base64").toString("utf8")
      case "base64-url":
        // Buffer 的 base64url 支持受 polyfill 版本影响，这里显式转成标准 base64
        return Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
      case "hex":
        return Buffer.from(raw, "hex").toString("utf8")
      default:
        return raw
    }
  } catch {
    return raw
  }
}
