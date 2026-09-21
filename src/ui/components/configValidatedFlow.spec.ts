/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import type { PlatformConfigValidationResult } from "~/src/ui/components/settings/bridge/platformConfigActionBridge.ts"

/**
 * Mirrors App.handleConfigValidated branching for regression guard.
 */
async function runHandleConfigValidated(
  result: PlatformConfigValidationResult,
  deps: {
    completeConfigIfPublishReady: () => Promise<void>
    showErrorDetails: (title: string, summary: string, details: string) => void
    hideErrorDetails: () => void
    clearErrorDetails: () => void
    t: (key: string) => string
  }
) {
  if (result.ok) {
    deps.hideErrorDetails()
    deps.clearErrorDetails()
    await deps.completeConfigIfPublishReady()
  } else {
    const summary = result.errorMessage || deps.t("platformConfig.validation.failedGeneric")
    deps.showErrorDetails(
      deps.t("platformConfig.validation.errorTitle"),
      summary,
      result.errorDetails || result.errorMessage || summary
    )
  }
}

describe("config validated flow", () => {
  it("only completes account config when validation ok is true", async () => {
    const completeConfigIfPublishReady = vi.fn(async () => undefined)
    const showErrorDetails = vi.fn()
    const hideErrorDetails = vi.fn()
    const clearErrorDetails = vi.fn()
    const t = (key: string) => key

    await runHandleConfigValidated(
      { ok: false, errorMessage: "TypeError: boom" },
      { completeConfigIfPublishReady, showErrorDetails, hideErrorDetails, clearErrorDetails, t }
    )
    expect(completeConfigIfPublishReady).not.toHaveBeenCalled()
    expect(showErrorDetails).toHaveBeenCalledOnce()

    await runHandleConfigValidated(
      { ok: true },
      { completeConfigIfPublishReady, showErrorDetails, hideErrorDetails, clearErrorDetails, t }
    )
    expect(hideErrorDetails).toHaveBeenCalled()
    expect(clearErrorDetails).toHaveBeenCalled()
    expect(completeConfigIfPublishReady).toHaveBeenCalledOnce()
  })
})
