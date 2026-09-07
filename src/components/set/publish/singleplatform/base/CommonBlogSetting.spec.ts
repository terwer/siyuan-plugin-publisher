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
import { describe, expect, it, vi } from "vitest"
import { PasswordType } from "zhi-blog-api"
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const mockGetSetting = vi.hoisted(() => vi.fn())
const mockUpdateSetting = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({
    getSetting: mockGetSetting,
    updateSetting: mockUpdateSetting,
  }),
}))

vi.mock("~/src/composables/usePicgoBridge.ts", () => ({
  usePicgoBridge: () => ({
    getPicbedServiceType: vi.fn().mockResolvedValue(0),
  }),
}))

vi.mock("~/src/composables/useProxy.ts", () => ({
  useProxy: () => ({
    isUseSiyuanProxy: true,
  }),
}))

vi.mock("~/src/composables/useSiyuanDevice.ts", () => ({
  useSiyuanDevice: () => ({
    isInSiyuanOrSiyuanNewWin: () => true,
  }),
}))

describe("CommonBlogSetting Cookie field", () => {
  it("allows Cookie editing and shows editable guidance", async () => {
    mockGetSetting.mockResolvedValue({})
    mockUpdateSetting.mockResolvedValue(undefined)

    const wrapper = mount(CommonBlogSetting, {
      props: {
        apiType: "custom_Yuqueweb",
        cfg: {
          homeEnabled: false,
          apiUrlEnabled: false,
          usernameEnabled: false,
          passwordType: PasswordType.PasswordType_Cookie,
          password: "",
          placeholder: {},
          previewUrlEnabled: false,
          knowledgeSpaceEnabled: false,
          picgoPicbedSupported: false,
          bundledPicbedSupported: false,
          apiStatus: false,
        },
      },
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
        ],
        stubs: {
          "el-skeleton": { template: "<div class='skeleton-stub' />" },
          "el-form": { template: "<form><slot /></form>" },
          "el-form-item": { template: "<div class='form-item'><slot /></div>" },
          "el-input": {
            props: ["modelValue", "placeholder", "type", "rows", "disabled"],
            emits: ["update:modelValue"],
            template: `
              <textarea
                v-if="type === 'textarea'"
                class="input-stub textarea-stub"
                :disabled="disabled"
                :placeholder="placeholder"
                :rows="rows"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
              <input
                v-else
                class="input-stub"
                :disabled="disabled"
                :placeholder="placeholder"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
            `,
          },
          "el-alert": {
            props: ["title", "type"],
            template: '<div class="alert-stub" :data-type="type">{{ title }}</div>',
          },
          "el-radio-group": { template: "<div><slot /></div>" },
          "el-radio": { template: "<label><slot /></label>" },
          "el-select": { template: "<select><slot /></select>" },
          "el-option": { template: "<option />" },
          "el-button": { template: "<button type='button'><slot /></button>" },
        },
      },
    })

    await flushPromises()

    const textarea = wrapper.find("textarea.textarea-stub")
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes("disabled")).toBeUndefined()
    expect(textarea.attributes("placeholder")).toBe(zhCN["setting.blog.cookie.placeholder"])
    expect(wrapper.text()).toContain(zhCN["setting.blog.cookie.editable.tip"])
    expect(wrapper.find(".alert-stub").attributes("data-type")).toBe("warning")
  })

  it("exposes a cookie-actions slot near the editable Cookie field without rendering V2 UI by default", async () => {
    mockGetSetting.mockResolvedValue({})
    mockUpdateSetting.mockResolvedValue(undefined)

    const mountOptions = {
      props: {
        apiType: "custom_Yuqueweb",
        cfg: {
          homeEnabled: false,
          apiUrlEnabled: false,
          usernameEnabled: false,
          passwordType: PasswordType.PasswordType_Cookie,
          password: "",
          placeholder: {},
          previewUrlEnabled: false,
          knowledgeSpaceEnabled: false,
          picgoPicbedSupported: false,
          bundledPicbedSupported: false,
          apiStatus: false,
        },
      },
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
        ],
        stubs: {
          "el-skeleton": { template: "<div class='skeleton-stub' />" },
          "el-form": { template: "<form><slot /></form>" },
          "el-form-item": { template: "<div class='form-item'><slot /></div>" },
          "el-input": {
            props: ["modelValue", "placeholder", "type", "rows", "disabled"],
            emits: ["update:modelValue"],
            template: `
              <textarea
                v-if="type === 'textarea'"
                class="input-stub textarea-stub"
                :disabled="disabled"
                :placeholder="placeholder"
                :rows="rows"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
              <input
                v-else
                class="input-stub"
                :disabled="disabled"
                :placeholder="placeholder"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
            `,
          },
          "el-alert": {
            props: ["title", "type"],
            template: '<div class="alert-stub" :data-type="type">{{ title }}</div>',
          },
          "el-radio-group": { template: "<div><slot /></div>" },
          "el-radio": { template: "<label><slot /></label>" },
          "el-select": { template: "<select><slot /></select>" },
          "el-option": { template: "<option />" },
          "el-button": { template: "<button type='button'><slot /></button>" },
        },
      },
    }

    const plainWrapper = mount(CommonBlogSetting, mountOptions)
    await flushPromises()
    expect(plainWrapper.find(".cookie-actions-slot").exists()).toBe(false)

    const slotWrapper = mount(CommonBlogSetting, {
      ...mountOptions,
      slots: {
        "cookie-actions": `<div class="cookie-actions-slot">Cookie actions slot</div>`,
      },
    })
    await flushPromises()

    expect(slotWrapper.find("textarea.textarea-stub").exists()).toBe(false)
    expect(slotWrapper.find(".cookie-actions-slot").exists()).toBe(true)
    expect(slotWrapper.text()).toContain("Cookie actions slot")
  })

  it("lets the injected V2 cookie slot toggle the manual Cookie editor on demand", async () => {
    mockGetSetting.mockResolvedValue({})
    mockUpdateSetting.mockResolvedValue(undefined)

    const wrapper = mount(CommonBlogSetting, {
      props: {
        apiType: "custom_Yuqueweb",
        cfg: {
          homeEnabled: false,
          apiUrlEnabled: false,
          usernameEnabled: false,
          passwordType: PasswordType.PasswordType_Cookie,
          password: "",
          placeholder: {},
          previewUrlEnabled: false,
          knowledgeSpaceEnabled: false,
          picgoPicbedSupported: false,
          bundledPicbedSupported: false,
          apiStatus: false,
        },
      },
      slots: {
        "cookie-actions": `
          <template #default="slotProps">
            <button class="toggle-cookie" type="button" @click="slotProps.toggleManualEditor()">toggle</button>
          </template>
        `,
      },
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
        ],
        stubs: {
          "el-skeleton": { template: "<div class='skeleton-stub' />" },
          "el-form": { template: "<form><slot /></form>" },
          "el-form-item": { template: "<div class='form-item'><slot /></div>" },
          "el-input": {
            props: ["modelValue", "placeholder", "type", "rows", "disabled"],
            emits: ["update:modelValue"],
            template: `
              <textarea
                v-if="type === 'textarea'"
                class="input-stub textarea-stub"
                :disabled="disabled"
                :placeholder="placeholder"
                :rows="rows"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
              <input
                v-else
                class="input-stub"
                :disabled="disabled"
                :placeholder="placeholder"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
            `,
          },
          "el-alert": {
            props: ["title", "type"],
            template: '<div class="alert-stub" :data-type="type">{{ title }}</div>',
          },
          "el-radio-group": { template: "<div><slot /></div>" },
          "el-radio": { template: "<label><slot /></label>" },
          "el-select": { template: "<select><slot /></select>" },
          "el-option": { template: "<option />" },
          "el-button": { template: "<button type='button'><slot /></button>" },
        },
      },
    })

    await flushPromises()
    expect(wrapper.find("textarea.textarea-stub").exists()).toBe(false)

    await wrapper.find(".toggle-cookie").trigger("click")
    await flushPromises()

    expect(wrapper.find("textarea.textarea-stub").exists()).toBe(true)
    expect(wrapper.find("textarea.textarea-stub").attributes("placeholder")).toBe(zhCN["setting.blog.cookie.placeholder"])

    await wrapper.find(".toggle-cookie").trigger("click")
    await flushPromises()

    expect(wrapper.find("textarea.textarea-stub").exists()).toBe(false)
  })
})
