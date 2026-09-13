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
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { JekyllConfig } from "~/src/adaptors/api/jekyll/jekyllConfig.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { VuepressConfig } from "~/src/adaptors/api/vuepress/vuepressConfig.ts"
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"

/**
 * 引导步骤锚点契约。
 *
 * 表单行的 data-syp-tour 由设置组件固定提供，帮助配置的 tour.target 必须命中其中之一，
 * 否则该步骤无法定位到真实控件（历史上曾出现 defaultPath 与 password 两种不落地写法）。
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

// CommonGithub 族平台的鉴权行固定为 Token
const TOKEN_PLATFORM_KEYS = [
  "github_Hexo",
  "github_Hugo",
  "github_Jekyll",
  "github_Quartz",
  "github_Vuepress",
  "github_Vuepress2",
]

const TOKEN_CONFIG_CLASSES: Record<string, any> = {
  github_Hexo: HexoConfig,
  github_Hugo: HugoConfig,
  github_Jekyll: JekyllConfig,
  github_Quartz: QuartzConfig,
  github_Vuepress: VuepressConfig,
  github_Vuepress2: Vuepress2Config,
}

function tourTargets(pageId: string): string[] {
  const tour = helpRegistry.getTour(pageId) ?? []
  return tour.map((step) => {
    const matched = /^\/?\[data-syp-tour='([^']+)'\]$/.exec(step.target ?? "")
    return matched ? matched[1] : `__invalid__:${step.target}`
  })
}

describe("platform help tour anchors", () => {
  const platformPageIds = helpRegistry.getAllPageIds().filter((id) => id.startsWith("platform-config/"))

  it("should register platform help configs for the verified github family", () => {
    for (const key of TOKEN_PLATFORM_KEYS) {
      expect(platformPageIds, `platform-config/${key}`).toContain(`platform-config/${key}`)
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

  it("should anchor Token platforms to the token row instead of the password row", () => {
    for (const key of TOKEN_PLATFORM_KEYS) {
      const cfg = safeMergeConfig<TokenShape>("{}", TOKEN_CONFIG_CLASSES[key], ["", "", "", "", ""])
      expect(cfg.passwordType, `${key} passwordType`).toBe(PasswordType.PasswordType_Token)

      const targets = tourTargets(`platform-config/${key}`)
      expect(targets, `${key} tour must use the token anchor`).toContain("token")
      expect(targets, `${key} tour must not use the password anchor`).not.toContain("password")
    }
  })

  type TokenShape = { passwordType: PasswordType }
})
