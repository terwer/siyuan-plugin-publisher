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
import PreferenceSettings from "~/src/ui/components/settings/PreferenceSettings.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockSypConfirm = vi.hoisted(() => vi.fn())
const preferenceState = vi.hoisted(() => ({ value: { allowChangeSlug: false } as Record<string, any> }))

vi.mock("~/src/ui/components/common/SypMessageBox.ts", () => ({
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

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    kernelApi: {
      pushErrMsg: vi.fn(),
    },
  }),
}))

const mockOpenPathOrUrl = vi.hoisted(() => vi.fn())
vi.mock("~/src/utils/pathUtils.ts", () => ({
  openPathOrUrl: mockOpenPathOrUrl,
}))

vi.mock("~/src/utils/siyuanUtils.ts", () => ({
  getSiyuanWidgetId: () => "",
}))

const mountPreference = () =>
  mount(PreferenceSettings, {
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

describe("PreferenceSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    preferenceState.value = { allowChangeSlug: false }
    mockSypConfirm.mockResolvedValue(false)
  })

  it("uses the unified message box before enabling slug editing", async () => {
    mockSypConfirm.mockResolvedValue(true)
    const wrapper = mountPreference()
    const allowChangeSlugRow = wrapper
      .findAll(".syp-settings-form-row")
      .find((row) => row.text().includes(zhCN["preference.setting.allowChangeSlug"]))!

    await allowChangeSlugRow.find('input[type="checkbox"]').setValue(true)
    await flushPromises()

    expect(mockSypConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: zhCN["preference.confirm.allowChangeSlug.title"],
        message: zhCN["preference.setting.allowChangeSlug.tips"],
        confirmButtonClass: "syp-message-box__confirm-danger",
      })
    )
    expect(preferenceState.value.allowChangeSlug).toBe(true)
  })

  it("keeps slug editing disabled when the unified message box is cancelled", async () => {
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
