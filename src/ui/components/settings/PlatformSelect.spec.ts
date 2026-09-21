/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { mount } from "@vue/test-utils"
import { createI18n } from "vue-i18n"
import { describe, expect, it } from "vitest"
import PlatformSelect from "~/src/ui/components/settings/PlatformSelect.vue"
import { PlatformType, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import { pre } from "~/src/platforms/pre.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

describe("PlatformSelect", () => {
  it("renders each platform's translated preset description through SypTooltip", () => {
    const preset = pre.commonCfg.find((item) => item.platformKey === "common_Yuque")!
    const description = zhCN[preset.i18n!.description]

    const wrapper = mount(PlatformSelect, {
      props: {
        items: [
          {
            key: preset.platformKey,
            platformKey: preset.platformKey,
            platformName: preset.platformName,
            description,
            platformIcon: preset.platformIcon,
            platformType: PlatformType.Common,
            subPlatformType: SubPlatformType.Common_Yuque,
          },
        ],
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
          SypTooltip: {
            props: ["content", "triggerClass"],
            template: '<span :class="triggerClass">{{ content }}</span>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain(preset.platformName)
    expect(wrapper.text()).toContain(description)
    expect(wrapper.find("button").attributes("aria-label")).toContain(description)
  })
})
