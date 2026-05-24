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
