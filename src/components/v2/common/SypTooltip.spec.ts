/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import SypTooltip from "~/src/components/v2/common/SypTooltip.vue"

describe("SypTooltip", () => {
  it("renders default content with ellipsis classes and unified tooltip props", () => {
    const wrapper = mount(SypTooltip, {
      props: {
        content: "很长的平台名称与描述",
        ellipsis: true,
        block: true,
        triggerClass: "custom-trigger",
      },
      global: {
        stubs: {
          ElTooltip: {
            props: ["content", "disabled", "effect", "popperClass"],
            template: `
              <div
                class="tooltip-stub"
                :data-content="content"
                :data-disabled="String(disabled)"
                :data-effect="effect"
                :data-popper-class="popperClass"
              >
                <slot />
              </div>
            `,
          },
        },
      },
    })

    const trigger = wrapper.find(".syp-v2-tooltip-trigger")
    expect(trigger.text()).toBe("很长的平台名称与描述")
    expect(trigger.classes()).toContain("is-ellipsis")
    expect(trigger.classes()).toContain("is-block")
    expect(trigger.classes()).toContain("custom-trigger")
    expect(wrapper.find(".tooltip-stub").attributes("data-effect")).toBe("dark")
    expect(wrapper.find(".tooltip-stub").attributes("data-popper-class")).toBe("syp-v2-tooltip-popper")
    expect(wrapper.find(".tooltip-stub").attributes("data-disabled")).toBe("false")
  })

  it("disables tooltip for empty content", () => {
    const wrapper = mount(SypTooltip, {
      props: {
        content: "   ",
      },
      global: {
        stubs: {
          ElTooltip: {
            props: ["disabled"],
            template: `
              <div class="tooltip-stub" :data-disabled="String(disabled)">
                <slot />
              </div>
            `,
          },
        },
      },
    })

    expect(wrapper.find(".tooltip-stub").attributes("data-disabled")).toBe("true")
  })
})
