import { describe, expect, it } from "vitest"
import { normalizePreferenceConfig, parsePreferenceStorageValue } from "~/siyuan/store/preferenceConfigManager.ts"

describe("preferenceConfigManager", () => {
  it("parses serialized preference storage values", () => {
    const parsed = parsePreferenceStorageValue('{"useV2UI":true,"showQuickMenu":false}')
    const normalized = normalizePreferenceConfig(parsed)

    expect(normalized.useV2UI).toBe(true)
    expect(normalized.showQuickMenu).toBe(false)
    expect(normalized.showExtendMenu).toBe(true)
  })

  it("accepts object storage values for backward compatibility", () => {
    const parsed = parsePreferenceStorageValue({
      useV2UI: true,
      showExtendMenu: false,
    })
    const normalized = normalizePreferenceConfig(parsed)

    expect(normalized.useV2UI).toBe(true)
    expect(normalized.showExtendMenu).toBe(false)
    expect(normalized.showDocQuickMenu).toBe(true)
  })

  it("fills missing values with defaults", () => {
    const normalized = normalizePreferenceConfig()

    expect(normalized.useV2UI).toBe(false)
    expect(normalized.showQuickMenu).toBe(true)
    expect(normalized.showSingleMenu).toBe(true)
    expect(normalized.showBatchMenu).toBe(true)
  })
})
