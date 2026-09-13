/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { bytesToHex, hmacSha256Raw, sha256Hex } from "~/src/utils/cryptoUtils.ts"
import type { ILogger } from "~/src/utils/appLogger.ts"

/**
 * 字节跳动 veImageX（ByteDance ImageX）直传客户端
 *
 * 本客户端封装对字节 veImageX 上传接口的调用，供掘金等平台集成图片上传：
 *   gen_token 取得 STS 临时凭证 → ApplyImageUpload（SigV4 签名）
 *   → TOS 直传（CRC32 校验）→ CommitImageUpload → 返回规范裸 StoreUri。
 *
 * 为便于定位问题，每层均记录独立日志；持久层只存裸 StoreUri，
 * 签名 URL 由读取端按需生成。
 *
 *   cookie ──(平台网关 gen_token)──▶ STS 临时凭证(~2h，Policy 仅授权 Apply/Commit)
 *     │
 *     ├─▶ ApplyImageUpload（AWS SigV4 签名，region=cn-north-1, service=imagex）
 *     │      ▶ StoreUri + SpaceKey JWT（scope 锁定单个 oidKey）+ UploadHost + SessionKey
 *     ├─▶ TOS 直传 POST（Authorization: SpaceKey JWT；Content-CRC32 强制；原始字节流）
 *     └─▶ CommitImageUpload（空 body，SessionKey 回传；UriStatus=2000 即成功）
 *
 * 安全根因：每层凭证逐级降权——STS 不能读删，TOS JWT 只能写单个对象，
 * 泄露任意一层都无法越权。持久层只存裸 StoreUri，签名 URL 由读取端动态重签。
 */

const IMAGEX_API_HOST = "https://imagex.bytedanceapi.com"
const IMAGEX_API_VERSION = "2018-08-01"
const IMAGEX_SIGN_REGION = "cn-north-1"
const IMAGEX_SIGN_SERVICE = "imagex"
// SigV4 未携带 x-amz-content-sha256 头时，canonical request 的 payload hash 固定为空体 SHA-256
const EMPTY_BODY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

/**
 * STS 临时凭证（来自平台网关，如掘金 `/imagex/v2/gen_token`）
 */
export interface ByteImagexStsToken {
  AccessKeyId: string
  SecretAccessKey: string
  SessionToken: string
}

/**
 * 注入的底层请求通道。由宿主适配器绑定基类 webFetch（内部走
 * publishTransport 统一解析 plugin-node-fetch / forward-proxy / middleware），
 * 本客户端不直接感知传输细节。
 */
export interface ByteImagexRequest {
  url: string
  method: "GET" | "POST"
  headers?: Record<string, string>
  params?: string | Uint8Array
  contentType?: string
}

export type ByteImagexRequestChannel = (request: ByteImagexRequest) => Promise<any>

interface ByteImagexClientDeps {
  logger?: ILogger
  requestJson: ByteImagexRequestChannel
}

interface ByteImagexUploadOptions {
  stsToken: ByteImagexStsToken
  /** ImageX 服务 ID（如掘金固定为 73owjymdk6） */
  serviceId: string
  /** 图片二进制内容 */
  bytes: Uint8Array
}

interface ByteImagexUploadResult {
  /** 规范存储 URI，形如 tos-cn-i-<serviceId>/<32hex>，即平台正文 markdown 应嵌入的裸形态 */
  storeUri: string
  uploadId?: string
  commitResult?: any
}

// ==========================
// CRC32（TOS Content-Crc32 强制校验，缺失报 400 MismatchChecksum）
// ==========================
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

const crc32Hex = (bytes: Uint8Array): string => {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0")
}

// ==========================
// AWS SigV4（volcengine imagex 兼容实现）
// ==========================
const encodeRfc3986 = (value: string): string => {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

const buildCanonicalQuery = (query: Record<string, string>): string => {
  return Object.keys(query)
    .sort()
    .map((key) => `${encodeRfc3986(key)}=${encodeRfc3986(query[key])}`)
    .join("&")
}

const getAmzDate = (): { amzDate: string; dateStamp: string } => {
  // ⚠️ SigV4 基本格式要求 yyyymmddThhmmssZ：必须剥掉 ISO 串中的冒号（以及毫秒），
  // 否则服务端头校验直接报 InvalidAuthorization（100024）
  const amzDate = new Date().toISOString().replace(/[-:]|\.\d{3}/g, "")
  return { amzDate, dateStamp: amzDate.slice(0, 8) }
}

const buildSigV4Authorization = async (
  method: "GET" | "POST",
  query: Record<string, string>,
  stsToken: ByteImagexStsToken
): Promise<{ authorization: string; amzDate: string }> => {
  const { amzDate, dateStamp } = getAmzDate()
  const canonicalQuery = buildCanonicalQuery(query)
  const canonicalHeaders = `x-amz-date:${amzDate}\nx-amz-security-token:${stsToken.SessionToken}\n`
  const signedHeaders = "x-amz-date;x-amz-security-token"
  const canonicalRequest = [
    method,
    "/",
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    EMPTY_BODY_SHA256,
  ].join("\n")

  const scope = `${dateStamp}/${IMAGEX_SIGN_REGION}/${IMAGEX_SIGN_SERVICE}/aws4_request`
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join("\n")

  // 密钥派生链：AWS4+SK → date → region → service → aws4_request，逐层原始字节 HMAC
  let signingKey = await hmacSha256Raw(`AWS4${stsToken.SecretAccessKey}`, dateStamp)
  signingKey = await hmacSha256Raw(signingKey, IMAGEX_SIGN_REGION)
  signingKey = await hmacSha256Raw(signingKey, IMAGEX_SIGN_SERVICE)
  signingKey = await hmacSha256Raw(signingKey, "aws4_request")
  const signature = bytesToHex(await hmacSha256Raw(signingKey, stringToSign))

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${stsToken.AccessKeyId}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`
  return { authorization, amzDate }
}

// ==========================
// 客户端
// ==========================
const createByteImagexClient = (deps: ByteImagexClientDeps) => {
  const logger = deps.logger

  const signedApiRequest = async (
    method: "GET" | "POST",
    action: string,
    extraQuery: Record<string, string>,
    stsToken: ByteImagexStsToken,
    serviceId: string
  ): Promise<any> => {
    // 与官方 web SDK 一致：实际 URL 用原始插入序原值查询串；canonical 用排序编码形态
    const query = { Action: action, Version: IMAGEX_API_VERSION, ServiceId: serviceId, ...extraQuery }
    const rawQuery = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&")
    const { authorization, amzDate } = await buildSigV4Authorization(method, query, stsToken)
    const url = `${IMAGEX_API_HOST}/?${rawQuery}`
    logger?.debug(`[byte-imagex] ${action} request =>`, url)
    return await deps.requestJson({
      url,
      method,
      // ⚠️ volcengine 网关对 x-amz-* 头名大小写敏感，必须保持官方 SDK 的 PascalCase，
      // 小写形式会被直接拒绝（100024 InvalidAuthorization）
      headers: {
        Authorization: authorization,
        "X-Amz-Date": amzDate,
        "X-Amz-Security-Token": stsToken.SessionToken,
      },
    })
  }

  /**
   * 三步直传：ApplyImageUpload → TOS 原始字节 PUT → CommitImageUpload。
   * 返回规范裸 StoreUri（平台正文 markdown 的原生嵌入形态）。
   */
  const uploadImage = async (options: ByteImagexUploadOptions): Promise<ByteImagexUploadResult> => {
    const { stsToken, serviceId, bytes } = options

    // 1. 申请上传地址
    const applyRes = await signedApiRequest("GET", "ApplyImageUpload", {}, stsToken, serviceId)
    const uploadAddress = applyRes?.Result?.UploadAddress
    const storeInfo = uploadAddress?.StoreInfos?.[0]
    const uploadHost = uploadAddress?.UploadHosts?.[0]
    if (!storeInfo?.StoreUri || !uploadHost || !storeInfo.Auth || !uploadAddress.SessionKey) {
      throw new Error("字节 ImageX 申请上传失败 => 缺少 StoreInfos/UploadHosts/SessionKey：" + JSON.stringify(applyRes)?.slice(0, 500))
    }

    // 2. TOS 直传（原始字节流 + 强制 CRC32 校验头）
    const crc32 = crc32Hex(bytes)
    const objectUrl = `https://${uploadHost}/${storeInfo.StoreUri}`
    logger?.info(`[byte-imagex] uploading ${bytes.length} bytes to ${objectUrl}, crc32=${crc32}`)
    const putRes = await deps.requestJson({
      url: objectUrl,
      method: "POST",
      headers: {
        Authorization: storeInfo.Auth,
        "Content-CRC32": crc32,
        "Content-Type": "application/octet-stream",
      },
      params: bytes,
      contentType: "application/octet-stream",
    })
    if (putRes?.payload?.key !== storeInfo.StoreUri.split("/")[1]) {
      throw new Error("字节 ImageX TOS 直传校验失败 => " + JSON.stringify(putRes)?.slice(0, 500))
    }

    // 3. 提交上传
    const commitRes = await signedApiRequest(
      "POST",
      "CommitImageUpload",
      { SessionKey: uploadAddress.SessionKey },
      stsToken,
      serviceId
    )
    const firstResult = commitRes?.Result?.Results?.[0]
    if (firstResult?.UriStatus !== 2000) {
      throw new Error("字节 ImageX 提交上传失败 => " + JSON.stringify(commitRes)?.slice(0, 500))
    }
    logger?.info(`[byte-imagex] upload committed, storeUri => ${firstResult.Uri}`)

    return {
      storeUri: firstResult.Uri ?? storeInfo.StoreUri,
      uploadId: storeInfo.UploadID,
      commitResult: firstResult,
    }
  }

  return { uploadImage }
}

/** @internal 单测用 */
const byteImagexTestExports = {
  crc32Hex,
  buildCanonicalQuery,
  encodeRfc3986,
  buildSigV4Authorization,
}

export type { ByteImagexClientDeps, ByteImagexUploadOptions, ByteImagexUploadResult }
export { createByteImagexClient, byteImagexTestExports }
