/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ref } from "vue"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"

export interface ErrorDetailsState {
  visible: boolean
  title: string
  summary: string
  details: string
}

export const useV2ErrorDetails = () => {
  const errorDetailsState = ref<ErrorDetailsState>({
    visible: false,
    title: "",
    summary: "",
    details: "",
  })

  const showErrorDetails = (title: string, summary: string, details?: string) => {
    storeErrorDetails(title, summary, details)
    errorDetailsState.value.visible = true
  }

  const storeErrorDetails = (title: string, summary: string, details?: string) => {
    const sanitizedSummary = typeof summary === "string" ? sanitizeSensitiveForLog(summary) : ""
    const sanitizedDetails = typeof details === "string" ? sanitizeSensitiveForLog(details) : sanitizedSummary

    errorDetailsState.value = {
      visible: false,
      title,
      summary: sanitizedSummary,
      details: sanitizedDetails,
    }
  }

  const hideErrorDetails = () => {
    errorDetailsState.value.visible = false
  }

  const clearErrorDetails = () => {
    errorDetailsState.value = {
      visible: false,
      title: "",
      summary: "",
      details: "",
    }
  }

  const reopenErrorDetails = () => {
    if (errorDetailsState.value.title) {
      errorDetailsState.value.visible = true
    }
  }

  return {
    errorDetailsState,
    showErrorDetails,
    storeErrorDetails,
    hideErrorDetails,
    clearErrorDetails,
    reopenErrorDetails,
  }
}
