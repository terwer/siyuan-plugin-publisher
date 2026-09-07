/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { describe, expect, it } from "vitest"
import { buildV2QuickPublishToast } from "~/src/composables/v2/useV2QuickPublishToast.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const t = (key: string, params?: Record<string, string | number>) => {
  let text = (zhCN as Record<string, string>)[key] ?? key
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.split(`{${paramKey}}`).join(String(paramValue ?? ""))
    }
  }
  return text
}

describe("buildV2QuickPublishToast", () => {
  it("returns null for non-terminal statuses", () => {
    expect(
      buildV2QuickPublishToast(t, {
        status: "publishing",
        platformName: "语雀",
        lastAction: "publish",
      })
    ).toBeNull()
  })

  it("uses conversational success copy with platform name", () => {
    const payload = buildV2QuickPublishToast(t, {
      status: "success",
      platformName: "语雀网页版",
      lastAction: "publish",
    })
    expect(payload?.type).toBe("success")
    expect(payload?.message).toBe("文章已发布到「语雀网页版」")
    expect(payload?.message).not.toContain("·")
  })

  it("uses warning copy without dumping technical errMsg", () => {
    const payload = buildV2QuickPublishToast(t, {
      status: "success_with_warnings",
      platformName: "语雀",
      lastAction: "update",
      errMsg: "image.png 同步失败(使用平台图床)",
    })
    expect(payload?.type).toBe("warning")
    expect(payload?.message).toBe("已在「语雀」更新，部分图片未上传")
    expect(payload?.message).not.toContain("image.png")
  })

  it("returns null for failed statuses because page details own failure feedback", () => {
    const payload = buildV2QuickPublishToast(t, {
      status: "failed",
      platformName: "知乎",
      lastAction: "publish",
      errMsg: "main.opt.failure=>YuquewebRequestError",
    })
    expect(payload).toBeNull()
  })
})
