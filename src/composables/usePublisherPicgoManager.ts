/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {
  createSiyuanPicGoHeadlessManager,
  type ISiyuanPicGoHeadlessManager,
  type PicGoValidationFieldError,
} from "zhi-siyuan-picgo"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { isDev } from "~/src/utils/constants.ts"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"

type PublisherPicgoManagerMethod =
  | "getConfig"
  | "getCurrentUploader"
  | "setCurrentUploader"
  | "listUploaders"
  | "getUploaderSchema"
  | "getUploaderConfig"
  | "validateUploaderConfig"
  | "saveUploaderConfig"
  | "auditUploaderSchemas"
  | "upload"
  | "uploadMarkdownImages"

const REQUIRED_HEADLESS_METHODS: PublisherPicgoManagerMethod[] = [
  "getConfig",
  "getCurrentUploader",
  "setCurrentUploader",
  "listUploaders",
  "getUploaderSchema",
  "getUploaderConfig",
  "validateUploaderConfig",
  "saveUploaderConfig",
  "auditUploaderSchemas",
  "upload",
  "uploadMarkdownImages",
]

interface PublisherPicgoFormattedError {
  summary: string
  details: string
  fieldErrors: PicGoValidationFieldError[]
}

interface PublisherPicgoRuntimeStatus extends PublisherPicgoFormattedError {
  ok: boolean
  manager?: ISiyuanPicGoHeadlessManager
}

class PublisherPicgoContractError extends Error {
  public readonly missingMethods: string[]

  constructor(missingMethods: string[]) {
    super(`当前 zhi-siyuan-picgo 版本缺少 Publisher headless contract: ${missingMethods.join(", ")}`)
    this.name = "PublisherPicgoContractError"
    this.missingMethods = missingMethods
  }
}

const logger = createAppLogger("publisher-picgo-manager")

let managerPromise: Promise<ISiyuanPicGoHeadlessManager> | null = null
let managerKey = ""

const stringifyDiagnostic = (input: unknown): string => {
  const sanitized = sanitizeSensitiveForLog(input)
  if (sanitized === null || sanitized === undefined) {
    return ""
  }
  if (typeof sanitized === "string") {
    return sanitized
  }
  try {
    return JSON.stringify(sanitized, null, 2)
  } catch {
    return String(sanitized)
  }
}

const resolveErrorJson = (error: any) => {
  if (error && typeof error.toJSON === "function") {
    try {
      return error.toJSON()
    } catch {
      return undefined
    }
  }
  return undefined
}

const formatPublisherPicgoError = (error: unknown): PublisherPicgoFormattedError => {
  const err = error as any
  const errJson = resolveErrorJson(err)
  const summary = String(err?.message || errJson?.message || error || "PicGo headless runtime error")
  const fieldErrors = (
    Array.isArray(err?.errors) ? err.errors : Array.isArray(errJson?.errors) ? errJson.errors : []
  ) as PicGoValidationFieldError[]
  const diagnosticSource = errJson || err?.diagnosticMessage || err?.stack || err

  return {
    summary: stringifyDiagnostic(summary),
    details: stringifyDiagnostic(diagnosticSource || summary),
    fieldErrors,
  }
}

const createManagerKey = () => {
  const { siyuanConfig } = useSiyuanApi()
  return JSON.stringify({
    apiUrl: siyuanConfig.apiUrl,
    password: siyuanConfig.password,
    cookie: siyuanConfig.cookie,
  })
}

function assertPublisherPicgoHeadlessContract(manager: unknown): asserts manager is ISiyuanPicGoHeadlessManager {
  const api = manager as Record<string, unknown>
  const missingMethods = REQUIRED_HEADLESS_METHODS.filter((method) => typeof api?.[method] !== "function")
  if (missingMethods.length > 0) {
    throw new PublisherPicgoContractError(missingMethods)
  }
}

const getPublisherPicgoManager = async (): Promise<ISiyuanPicGoHeadlessManager> => {
  const { siyuanConfig } = useSiyuanApi()
  const nextManagerKey = createManagerKey()

  if (!managerPromise || managerKey !== nextManagerKey) {
    managerKey = nextManagerKey
    managerPromise = createSiyuanPicGoHeadlessManager(siyuanConfig, { isDev })
      .then((manager) => {
        assertPublisherPicgoHeadlessContract(manager)
        logger.info("PicGo headless manager is ready")
        return manager
      })
      .catch((error) => {
        managerPromise = null
        throw error
      })
  }

  return managerPromise
}

const checkPublisherPicgoRuntime = async (): Promise<PublisherPicgoRuntimeStatus> => {
  try {
    const manager = await getPublisherPicgoManager()
    const audit = manager.auditUploaderSchemas()
    if (!audit.ok) {
      return {
        ok: false,
        manager,
        summary: "PicGo headless uploader schema audit failed",
        details: stringifyDiagnostic({
          message: "PicGo headless uploader schema audit failed",
          errors: audit.errors,
        }),
        fieldErrors: audit.errors,
      }
    }

    return {
      ok: true,
      manager,
      summary: "PicGo headless runtime is ready",
      details: "",
      fieldErrors: [],
    }
  } catch (error) {
    const formatted = formatPublisherPicgoError(error)
    logger.error("PicGo headless runtime check failed", formatted.details)
    return {
      ok: false,
      ...formatted,
    }
  }
}

const usePublisherPicgoManager = () => ({
  getPublisherPicgoManager,
  checkPublisherPicgoRuntime,
  formatPublisherPicgoError,
})

export {
  PublisherPicgoContractError,
  checkPublisherPicgoRuntime,
  formatPublisherPicgoError,
  getPublisherPicgoManager,
  usePublisherPicgoManager,
  type PublisherPicgoFormattedError,
  type PublisherPicgoRuntimeStatus,
}
