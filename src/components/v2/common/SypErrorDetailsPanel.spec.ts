/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { mount } from "@vue/test-utils"
import { describe, expect, it, vi } from "vitest"
import SypErrorDetailsPanel from "~/src/components/v2/common/SypErrorDetailsPanel.vue"

const createWrapper = (overrides: Partial<InstanceType<typeof SypErrorDetailsPanel>["$props"]> = {}) => {
  return mount(SypErrorDetailsPanel, {
    props: {
      visible: true,
      title: "错误详情",
      summary: "图片上传失败，请检查 Cookie。",
      details:
        "stage: forward-proxy\nstatus: 403\nCookie: <redacted>\nError: Cannot find module '/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js'",
      copyLabel: "复制",
      copySuccessText: "复制成功",
      copyFailureText: "复制失败",
      closeLabel: "确认",
      ...overrides,
    },
    attachTo: document.body,
  })
}

describe("SypErrorDetailsPanel", () => {
  it("renders local V2 error details without using Element Plus global alert", () => {
    const wrapper = createWrapper()

    expect(wrapper.find(".syp-error-details-panel").exists()).toBe(true)
    expect(wrapper.find(".syp-error-details-panel__title").text()).toBe("错误详情")
    expect(wrapper.find(".syp-error-details-panel__summary").text()).toContain("图片上传失败")
    expect(wrapper.get('[data-testid="syp-error-details-content"]').text()).toContain("stage: forward-proxy")

    wrapper.unmount()
  })

  it("copies diagnostic details and emits close from the local panel", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })
    const wrapper = createWrapper()

    await wrapper.get('[data-testid="syp-error-details-copy"]').trigger("click")
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("status: 403"))
    expect(wrapper.get('[data-testid="syp-error-details-copy"]').text()).toBe("复制成功")

    await wrapper.get('[data-testid="syp-error-details-close"]').trigger("click")
    expect(wrapper.emitted("close")).toHaveLength(1)

    wrapper.unmount()
  })
})
