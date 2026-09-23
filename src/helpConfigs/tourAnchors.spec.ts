/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { PasswordType } from "zhi-blog-api"
import "~/src/helpConfigs/pages/index"
import { helpRegistry } from "~/src/helpConfigs/registry"
import { VERIFIED_PLATFORM_ROWS, mergedPlatformConfig, renderableTourAnchors } from "~/src/helpConfigs/verifiedPlatformRows"

/**
 * 引导步骤锚点契约。
 *
 * 表单行的 `data-syp-tour` 由设置组件按行渲染条件提供，帮助配置的 `tour.target` 必须命中其中之一，
 * 否则该步骤定位不到真实控件（历史上曾出现 defaultPath 与 password 两种不落地写法）。
 *
 * **两套命名空间**（易错点）：鉴权行的 `fields` 键恒为 `password`，而它的**引导锚点**按
 * `passwordType` 三选一渲染（密码 → `password`、Token → `token`、Cookie → `cookie`）。
 * 本站 `fields` 有 `password` 不代表引导能用 `password` 锚点：Token 型平台的鉴权输入框渲染的是
 * `token` 锚点（#21 博客园就曾因此出现「永远命中不到」的死步骤）。
 * 该断言此前把平台硬编码为 6 个 GitHub 站，故漏检；现改为按 `passwordType` 数据驱动，
 * 覆盖 `verifiedPlatformRows.ts` 里的全部已验证平台。
 */
const COMMON_BLOG_ANCHORS = [
  "home",
  "apiUrl",
  "username",
  "password",
  "token",
  "cookie",
  "previewUrl",
  "pageType",
  "knowledgeSpaceSearch",
  "knowledgeSpace",
  "picbedService",
  "corsProxy",
  "validate",
]

const LOCAL_SYSTEM_ANCHORS = ["storePath", "imageStorePath", "fsYamlType"]

const KNOWN_ANCHORS = [...COMMON_BLOG_ANCHORS, ...LOCAL_SYSTEM_ANCHORS]

// 鉴权行按 passwordType 三选一渲染，同一引导里不允许同时出现两种
const AUTH_ANCHORS = ["password", "token", "cookie"]

function anchorOf(target: string | undefined): string {
  const matched = /^\/?\[data-syp-tour='([^']+)'\]$/.exec(target ?? "")
  return matched ? matched[1] : `__invalid__:${target}`
}

function tourTargets(pageId: string): string[] {
  const tour = helpRegistry.getTour(pageId) ?? []
  return tour.map((step) => anchorOf(step.target))
}

describe("platform help tour anchors", () => {
  const platformPageIds = helpRegistry.getAllPageIds().filter((id) => id.startsWith("platform-config/"))

  it("should register every verified platform help config", () => {
    for (const entry of VERIFIED_PLATFORM_ROWS) {
      expect(platformPageIds, `platform-config/${entry.platformKey}`).toContain(`platform-config/${entry.platformKey}`)
    }
  })

  it("should point every tour step at a real form anchor", () => {
    for (const pageId of platformPageIds) {
      const targets = tourTargets(pageId)
      for (const target of targets) {
        expect(KNOWN_ANCHORS, `${pageId} -> ${target}`).toContain(target)
      }
    }
  })

  it("should use at most one auth anchor per tour", () => {
    for (const pageId of platformPageIds) {
      const used = tourTargets(pageId).filter((t) => AUTH_ANCHORS.includes(t))
      expect(used.length, `${pageId} auth anchors: ${used.join(",")}`).toBeLessThanOrEqual(1)
    }
  })

  it("should keep every verified tour step inside the anchors that platform really renders", () => {
    const dead: string[] = []
    for (const entry of VERIFIED_PLATFORM_ROWS) {
      const renderable = renderableTourAnchors(entry)
      for (const target of tourTargets(`platform-config/${entry.platformKey}`)) {
        if (!renderable.has(target)) dead.push(`${entry.platformKey} -> ${target}`)
      }
    }
    expect(dead, "tour 锚点必须是该平台真实渲染的行").toEqual([])
  })

  it("should anchor the auth step to the row the passwordType renders", () => {
    const mismatched: string[] = []
    for (const entry of VERIFIED_PLATFORM_ROWS) {
      const merged = mergedPlatformConfig(entry)
      const expected =
        merged.passwordType === PasswordType.PasswordType_Password
          ? "password"
          : merged.passwordType === PasswordType.PasswordType_Token
            ? "token"
            : merged.passwordType === PasswordType.PasswordType_Cookie
              ? "cookie"
              : ""
      const used = tourTargets(`platform-config/${entry.platformKey}`).filter((t) => AUTH_ANCHORS.includes(t))
      if (used.length === 0) continue // 无鉴权步骤的平台（如本地系统）不适用
      if (!expected || used[0] !== expected) {
        mismatched.push(`${entry.platformKey} expected=${expected || "(none)"} used=[${used.join(",")}]`)
      }
    }
    expect(mismatched, "Token 型平台必须用 token 锚点，Cookie 型必须用 cookie 锚点").toEqual([])
  })
})