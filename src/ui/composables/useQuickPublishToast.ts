/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import {
  MessageError,
  MessageInfo,
  MessageSuccess,
  MessageWarning,
} from "~/src/ui/composables/floatingUi.ts"

export type QuickPublishToastStatus =
  | "idle"
  | "preparing"
  | "publishing"
  | "success"
  | "success_with_warnings"
  | "failed"
  | "preview_ready"

export type QuickPublishToastAction = "" | "publish" | "update" | "delete" | "preview"

export interface QuickPublishToastInput {
  status: QuickPublishToastStatus
  platformName: string
  lastAction: QuickPublishToastAction
  errMsg?: string
}

type QuickPublishTranslate = (key: string, params?: Record<string, string | number>) => string

export interface QuickPublishToastPayload {
  type: "success" | "warning" | "error" | "info"
  message: string
  duration?: number
  showClose?: boolean
}

const TERMINAL_TOAST_STATUSES = new Set<QuickPublishToastStatus>([
  "success",
  "success_with_warnings",
  "failed",
  "preview_ready",
])

const resolvePlatformLabel = (t: QuickPublishTranslate, platformName: string) => {
  const trimmed = platformName.trim()
  return trimmed.length > 0 ? trimmed : t("quickPublish.toast.defaultPlatform")
}

const toastKeyFor = (input: QuickPublishToastInput): string | null => {
  const { status, lastAction } = input
  if (status === "success") {
    if (lastAction === "update") {
      return "quickPublish.toast.updateSuccess"
    }
    if (lastAction === "delete") {
      return "quickPublish.toast.deleteSuccess"
    }
    return "quickPublish.toast.publishSuccess"
  }
  if (status === "success_with_warnings") {
    return lastAction === "update" ? "quickPublish.toast.updateWarn" : "quickPublish.toast.publishWarn"
  }
  if (status === "failed") {
    return null
  }
  if (status === "preview_ready") {
    return "quickPublish.toast.previewReady"
  }
  return null
}

/** 构建快速发布终态 Toast（纯函数，便于单测） */
export const buildQuickPublishToast = (
  t: QuickPublishTranslate,
  input: QuickPublishToastInput
): QuickPublishToastPayload | null => {
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
export const notifyQuickPublishResult = (
  t: QuickPublishTranslate,
  input: QuickPublishToastInput
) => {
  const payload = buildQuickPublishToast(t, input)
  if (!payload) {
    return
  }

  const options = {
    message: payload.message,
    duration: payload.duration,
    showClose: payload.showClose,
  }

  if (payload.type === "warning") {
    MessageWarning(options)
    return
  }
  if (payload.type === "error") {
    MessageError(options)
    return
  }
  if (payload.type === "info") {
    MessageInfo(options)
    return
  }
  MessageSuccess(options)
}
