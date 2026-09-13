/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { useV2ErrorDetails } from "~/src/composables/v2/useV2ErrorDetails.ts"

describe("useV2ErrorDetails", () => {
  it("initializes with hidden state", () => {
    const { errorDetailsState } = useV2ErrorDetails()

    expect(errorDetailsState.value.visible).toBe(false)
    expect(errorDetailsState.value.title).toBe("")
    expect(errorDetailsState.value.summary).toBe("")
    expect(errorDetailsState.value.details).toBe("")
  })

  it("shows error details with sanitized content", () => {
    const { errorDetailsState, showErrorDetails } = useV2ErrorDetails()

    showErrorDetails(
      "Validation Failed",
      "API error: token=secret123",
      "Full error: cookie=abc123; Authorization: Bearer xyz"
    )

    expect(errorDetailsState.value.visible).toBe(true)
    expect(errorDetailsState.value.title).toBe("Validation Failed")
    expect(errorDetailsState.value.summary).not.toContain("secret123")
    expect(errorDetailsState.value.details).not.toContain("abc123")
    expect(errorDetailsState.value.details).not.toContain("xyz")
  })

  it("uses summary as details fallback when details not provided", () => {
    const { errorDetailsState, showErrorDetails } = useV2ErrorDetails()

    showErrorDetails("Error", "Something failed")

    expect(errorDetailsState.value.details).toBe("Something failed")
  })

  it("hides error details", () => {
    const { errorDetailsState, showErrorDetails, hideErrorDetails } = useV2ErrorDetails()

    showErrorDetails("Error", "Summary", "Details")
    expect(errorDetailsState.value.visible).toBe(true)

    hideErrorDetails()
    expect(errorDetailsState.value.visible).toBe(false)
    // title/summary/details preserved so re-show is possible
    expect(errorDetailsState.value.title).toBe("Error")
  })

  it("reopens error details when title is set", () => {
    const { errorDetailsState, showErrorDetails, hideErrorDetails, reopenErrorDetails } = useV2ErrorDetails()

    showErrorDetails("Validation Failed", "Summary", "Details")
    hideErrorDetails()
    expect(errorDetailsState.value.visible).toBe(false)

    reopenErrorDetails()
    expect(errorDetailsState.value.visible).toBe(true)
    expect(errorDetailsState.value.title).toBe("Validation Failed")
  })

  it("clears all error details state", () => {
    const { errorDetailsState, showErrorDetails, clearErrorDetails } = useV2ErrorDetails()

    showErrorDetails("Error", "Summary", "Details")
    clearErrorDetails()

    expect(errorDetailsState.value.visible).toBe(false)
    expect(errorDetailsState.value.title).toBe("")
    expect(errorDetailsState.value.summary).toBe("")
    expect(errorDetailsState.value.details).toBe("")
  })
})
