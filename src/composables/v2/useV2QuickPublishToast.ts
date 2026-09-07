/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import {
  v2MessageError,
  v2MessageInfo,
  v2MessageSuccess,
  v2MessageWarning,
} from "~/src/composables/v2/v2FloatingUi.ts"

export type V2QuickPublishToastStatus =
  | "idle"
  | "preparing"
  | "publishing"
  | "success"
  | "success_with_warnings"
  | "failed"
  | "preview_ready"

export type V2QuickPublishToastAction = "" | "publish" | "update" | "delete" | "preview"

export interface V2QuickPublishToastInput {
  status: V2QuickPublishToastStatus
  platformName: string
  lastAction: V2QuickPublishToastAction
  errMsg?: string
}

type V2QuickPublishTranslate = (key: string, params?: Record<string, string | number>) => string

export interface V2QuickPublishToastPayload {
  type: "success" | "warning" | "error" | "info"
  message: string
  duration?: number
  showClose?: boolean
}

const TERMINAL_TOAST_STATUSES = new Set<V2QuickPublishToastStatus>([
  "success",
  "success_with_warnings",
  "failed",
  "preview_ready",
])

const resolvePlatformLabel = (t: V2QuickPublishTranslate, platformName: string) => {
  const trimmed = platformName.trim()
  return trimmed.length > 0 ? trimmed : t("v2.quickPublish.toast.defaultPlatform")
}

const toastKeyFor = (input: V2QuickPublishToastInput): string | null => {
  const { status, lastAction } = input
  if (status === "success") {
    if (lastAction === "update") {
      return "v2.quickPublish.toast.updateSuccess"
    }
    if (lastAction === "delete") {
      return "v2.quickPublish.toast.deleteSuccess"
    }
    return "v2.quickPublish.toast.publishSuccess"
  }
  if (status === "success_with_warnings") {
    return lastAction === "update" ? "v2.quickPublish.toast.updateWarn" : "v2.quickPublish.toast.publishWarn"
  }
  if (status === "failed") {
    return null
  }
  if (status === "preview_ready") {
    return "v2.quickPublish.toast.previewReady"
  }
  return null
}

/** 构建快速发布终态 Toast（纯函数，便于单测） */
export const buildV2QuickPublishToast = (
  t: V2QuickPublishTranslate,
  input: V2QuickPublishToastInput
): V2QuickPublishToastPayload | null => {
  if (!TERMINAL_TOAST_STATUSES.has(input.status)) {
    return null
  }

  const toastKey = toastKeyFor(input)
  if (!toastKey) {
    return null
  }

  const message = t(toastKey, { name: resolvePlatformLabel(t, input.platformName) })

  if (input.status === "success_with_warnings") {
    return {
      type: "warning",
      message,
      duration: 6000,
      showClose: true,
    }
  }

  if (input.status === "failed") {
    return {
      type: "error",
      message,
      duration: 8000,
      showClose: true,
    }
  }

  if (input.status === "preview_ready") {
    return {
      type: "info",
      message,
      duration: 4000,
    }
  }

  return {
    type: "success",
    message,
    duration: 4000,
  }
}

/** 快速发布终态弹出 Toast（保留页面状态条作为详情区） */
export const notifyV2QuickPublishResult = (
  t: V2QuickPublishTranslate,
  input: V2QuickPublishToastInput
) => {
  const payload = buildV2QuickPublishToast(t, input)
  if (!payload) {
    return
  }

  const options = {
    message: payload.message,
    duration: payload.duration,
    showClose: payload.showClose,
  }

  if (payload.type === "warning") {
    v2MessageWarning(options)
    return
  }
  if (payload.type === "error") {
    v2MessageError(options)
    return
  }
  if (payload.type === "info") {
    v2MessageInfo(options)
    return
  }
  v2MessageSuccess(options)
}
