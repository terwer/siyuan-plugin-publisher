/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { flushPromises, mount } from "@vue/test-utils"
import { createI18n } from "vue-i18n"
import { beforeEach, describe, expect, it, vi } from "vitest"
import V2PreferenceSettings from "~/src/components/v2/settings/V2PreferenceSettings.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockSypConfirm = vi.hoisted(() => vi.fn())
const preferenceState = vi.hoisted(() => ({ value: { allowChangeSlug: false } as Record<string, any> }))

vi.mock("~/src/components/v2/common/SypMessageBox.ts", () => ({
  sypConfirm: mockSypConfirm,
}))

vi.mock("~/src/stores/usePreferenceSettingStore.ts", () => ({
  usePreferenceSettingStore: () => ({
    getPublishPreferenceSetting: () => preferenceState,
  }),
}))

vi.mock("~/src/composables/useNotebookOptions.ts", () => ({
  useNotebookOptions: () => ({
    options: { value: [] },
    isLoading: { value: false },
    load: vi.fn(),
  }),
}))

vi.mock("~/src/composables/useSiyuanDevice.ts", () => ({
  useSiyuanDevice: () => ({
    isInSiyuanWin: () => true,
    isInSiyuanWidget: () => false,
  }),
}))

vi.mock("~/src/utils/siyuanUtils.ts", () => ({
  getSiyuanWidgetId: () => "",
}))

const mountPreference = () =>
  mount(V2PreferenceSettings, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "zh_CN",
          messages: { zh_CN: zhCN },
        }),
      ],
      stubs: {
        SypTooltip: {
          props: ["content", "triggerClass"],
          template: '<label :class="triggerClass"><slot>{{ content }}</slot></label>',
        },
      },
    },
  })

describe("V2PreferenceSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    preferenceState.value = { allowChangeSlug: false }
    mockSypConfirm.mockResolvedValue(false)
  })

  it("uses the unified V2 message box before enabling slug editing", async () => {
    mockSypConfirm.mockResolvedValue(true)
    const wrapper = mountPreference()
    const allowChangeSlugRow = wrapper
      .findAll(".syp-settings-form-row")
      .find((row) => row.text().includes(zhCN["preference.setting.allowChangeSlug"]))!

    await allowChangeSlugRow.find('input[type="checkbox"]').setValue(true)
    await flushPromises()

    expect(mockSypConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: zhCN["v2.preference.confirm.allowChangeSlug.title"],
        message: zhCN["preference.setting.allowChangeSlug.tips"],
        confirmButtonClass: "syp-v2-message-box__confirm-danger",
      })
    )
    expect(preferenceState.value.allowChangeSlug).toBe(true)
  })

  it("keeps slug editing disabled when the unified V2 message box is cancelled", async () => {
    mockSypConfirm.mockResolvedValue(false)
    const wrapper = mountPreference()
    const allowChangeSlugRow = wrapper
      .findAll(".syp-settings-form-row")
      .find((row) => row.text().includes(zhCN["preference.setting.allowChangeSlug"]))!

    await allowChangeSlugRow.find('input[type="checkbox"]').setValue(true)
    await flushPromises()

    expect(preferenceState.value.allowChangeSlug).toBe(false)
  })
})
