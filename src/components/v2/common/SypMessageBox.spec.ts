/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi, beforeEach } from "vitest"
import { sypConfirm } from "~/src/components/v2/common/SypMessageBox.ts"

const mockConfirm = vi.hoisted(() => vi.fn())

vi.mock("element-plus", () => ({
  ElMessageBox: {
    confirm: mockConfirm,
  },
}))

describe("SypMessageBox", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("wraps Element Plus MessageBox with V2 visual classes and returns true on confirm", async () => {
    mockConfirm.mockResolvedValue("confirm")

    const result = await sypConfirm({
      title: "确认删除",
      message: "确认删除账号吗？",
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      customClass: "extra-class",
    })

    expect(result).toBe(true)
    expect(mockConfirm).toHaveBeenCalledWith(
      "确认删除账号吗？",
      "确认删除",
      expect.objectContaining({
        customClass: "syp-v2-message-box extra-class",
        modalClass: "syp-v2-message-box-modal",
        closeOnClickModal: false,
        buttonSize: "small",
      })
    )
  })

  it("returns false when the dialog is cancelled", async () => {
    mockConfirm.mockRejectedValue(new Error("cancel"))

    await expect(sypConfirm({ title: "提示", message: "确认？" })).resolves.toBe(false)
  })
})
