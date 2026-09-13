import SparkMD5 from "spark-md5"
import { Base64 } from "js-base64"

const textEncoder = new TextEncoder()

export const md5Hex = (message: string | ArrayBuffer | Uint8Array): string => {
  if (typeof message === "string") {
    return SparkMD5.hash(message)
  }

  const bytes = message instanceof Uint8Array ? message : new Uint8Array(message)
  return SparkMD5.ArrayBuffer.hash(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
}

export const hmacSha256Base64 = async (secret: string, message: string): Promise<string> => {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new Error("Web Crypto API is unavailable")
  }

  const key = await subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ])
  const signature = await subtle.sign("HMAC", key, textEncoder.encode(message))
  return Base64.fromUint8Array(new Uint8Array(signature))
}

const toBytes = (input: string | Uint8Array): Uint8Array<ArrayBuffer> => {
  // new Uint8Array(view) 复制进全新 ArrayBuffer，满足 WebCrypto BufferSource 的严格类型
  return typeof input === "string" ? textEncoder.encode(input) : new Uint8Array(input)
}

export const bytesToHex = (bytes: Uint8Array): string => {
  let out = ""
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, "0")
  }
  return out
}

/**
 * SHA-256 摘要（hex 小写）。签名类协议（如 AWS SigV4）的哈希原语。
 */
export const sha256Hex = async (message: string | Uint8Array): Promise<string> => {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new Error("Web Crypto API is unavailable")
  }
  const digest = await subtle.digest("SHA-256", toBytes(message))
  return bytesToHex(new Uint8Array(digest))
}

/**
 * HMAC-SHA256，返回原始字节。AWS SigV4 的密钥派生链要求逐层拿原始字节再 HMAC，
 * 不能经过 base64/hex 中转。
 */
export const hmacSha256Raw = async (
  secret: string | Uint8Array,
  message: string | Uint8Array
): Promise<Uint8Array> => {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new Error("Web Crypto API is unavailable")
  }
  // 密钥可能是二进制派生结果（如 "AWS4" + SecretAccessKey），必须按原始字节导入
  const key = await subtle.importKey("raw", toBytes(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const signature = await subtle.sign("HMAC", key, toBytes(message))
  return new Uint8Array(signature)
}
