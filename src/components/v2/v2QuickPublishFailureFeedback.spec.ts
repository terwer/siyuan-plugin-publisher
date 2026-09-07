/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { describe, expect, it } from "vitest"
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

const quickPublishFailedDescription = (
  action: "publish" | "update" | "delete",
  platformName: string,
  reason: string
) => {
  if (action === "update") {
    return platformName
      ? t("v2.publish.desc.updateFailedWithReason.named", { name: platformName, reason })
      : t("v2.publish.desc.updateFailedWithReason.default", { reason })
  }
  if (action === "delete") {
    return platformName
      ? t("v2.publish.desc.deleteFailedWithReason.named", { name: platformName, reason })
      : t("v2.publish.desc.deleteFailedWithReason.default", { reason })
  }
  return platformName
    ? t("v2.publish.desc.publishFailedWithReason.named", { name: platformName, reason })
    : t("v2.publish.desc.publishFailedWithReason.default", { reason })
}

describe("V2 quick publish failure feedback copy", () => {
  it("shows platform, action, and short summary on the page", () => {
    expect(quickPublishFailedDescription("publish", "CSDN", "标题过短")).toBe("CSDN 发布失败：标题过短")
    expect(quickPublishFailedDescription("update", "知乎", "账号未授权")).toBe("知乎 更新失败：账号未授权")
    expect(quickPublishFailedDescription("delete", "掘金", "文章不存在")).toBe("掘金 删除失败：文章不存在")
  })
})
