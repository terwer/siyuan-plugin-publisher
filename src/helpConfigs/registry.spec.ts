/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, it, expect, beforeEach } from "vitest"
import { helpRegistry } from "~/src/helpConfigs/registry"
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { yuqueHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-yuque"
import { notionHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-notion"
import { haloHelpConfig } from "~/src/helpConfigs/pages/platform-config/common-halo"
import { wordpressHelpConfig } from "~/src/helpConfigs/pages/platform-config/wordpress-wordpress"
import { yuquewebHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-yuqueweb"
import { halowebHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-haloweb"
import { localSystemHelpConfig } from "~/src/helpConfigs/pages/platform-config/fs-local-system"
import { zhihuHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-zhihu"
import { csdnHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-csdn"
import { jianshuHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-jianshu"
import { juejinHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-juejin"
import { wechatHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-wechat"
import { bilibiliHelpConfig } from "~/src/helpConfigs/pages/platform-config/custom-bilibili"
import { cnblogsHelpConfig } from "~/src/helpConfigs/pages/platform-config/metaweblog-cnblogs"
import { remainingT1HelpConfigs } from "~/src/helpConfigs/pages/platform-config/remaining-t1"

// 测试用配置
const testConfig: PageHelpConfig = {
  pageId: "test-page",
  helpUrl: "https://example.com/help",
  summary: "Test page summary",
  fields: {
    username: { tip: "Enter your username" },
    password: { tip: "Enter your password", link: "https://example.com/password-help" },
  },
  tour: [
    { target: ".field-username", title: "Step 1", content: "Fill username" },
    { target: ".field-password", title: "Step 2", content: "Fill password" },
  ],
  faq: [{ q: "How?", a: "Like this" }],
}

const dirDefaultConfig: PageHelpConfig = {
  pageId: "platform-config/_default",
  helpUrl: "https://example.com/platform-help",
  summary: "Platform config general help",
}

describe("HelpRegistry", () => {
  beforeEach(() => {
    // Reset registry by re-registering only test configs
    helpRegistry.register(testConfig)
    helpRegistry.register(dirDefaultConfig)
  })

  describe("get()", () => {
    it("should return exact match", () => {
      const result = helpRegistry.get("test-page")
      expect(result.pageId).toBe("test-page")
      expect(result.summary).toBe("Test page summary")
    })

    it("should fallback to directory _default when no exact match", () => {
      const result = helpRegistry.get("platform-config/metaweblog_Cnblogs")
      expect(result.pageId).toBe("platform-config/_default")
      expect(result.helpUrl).toBe("https://example.com/platform-help")
    })

    it("should normalize dynamic platform-config instance keys to preset platform help configs", () => {
      helpRegistry.register(yuqueHelpConfig)
      helpRegistry.register(yuquewebHelpConfig)

      expect(helpRegistry.get("platform-config/common_Yuque-z2jom6d").pageId).toBe("platform-config/common_Yuque")
      expect(helpRegistry.get("platform-config/custom_Yuqueweb-z2jom6d").pageId).toBe("platform-config/custom_Yuqueweb")
    })

    it("should fallback to global _default when no directory match either", () => {
      const result = helpRegistry.get("unknown-page-xyz")
      expect(result.pageId).toBe("_default")
      expect(result.helpUrl).toBe("https://siyuan.wiki/s/20230810132040-nn4q7vs")
    })
  })

  describe("getField()", () => {
    it("should return field help for exact match", () => {
      const field = helpRegistry.getField("test-page", "username")
      expect(field?.tip).toBe("Enter your username")
    })

    it("should return preset platform field help for dynamic platform-config instance keys", () => {
      helpRegistry.register(yuqueHelpConfig)

      const field = helpRegistry.getField("platform-config/common_Yuque-z2jom6d", "token")
      expect(field?.tip).toBe(yuqueHelpConfig.fields?.token.tip)
    })

    it("should return undefined for missing field", () => {
      const field = helpRegistry.getField("test-page", "nonexistent")
      expect(field).toBeUndefined()
    })
  })

  describe("getTour()", () => {
    it("should return tour steps", () => {
      const tour = helpRegistry.getTour("test-page")
      expect(tour).toHaveLength(2)
      expect(tour![0].target).toBe(".field-username")
    })

    it("should return preset platform tour for dynamic platform-config instance keys", () => {
      helpRegistry.register(yuquewebHelpConfig)

      const tour = helpRegistry.getTour("platform-config/custom_Yuqueweb-z2jom6d")
      expect(tour).toEqual(yuquewebHelpConfig.tour)
    })

    it("should return undefined for page without tour", () => {
      const tour = helpRegistry.getTour("platform-config/metaweblog_Cnblogs")
      expect(tour).toBeUndefined()
    })
  })

  describe("getHelpUrl()", () => {
    it("should return exact page helpUrl", () => {
      const url = helpRegistry.getHelpUrl("test-page")
      expect(url).toBe("https://example.com/help")
    })

    it("should return directory fallback helpUrl", () => {
      const url = helpRegistry.getHelpUrl("platform-config/metaweblog_Cnblogs")
      expect(url).toBe("https://example.com/platform-help")
    })

    it("should return preset helpUrl for dynamic platform-config instance keys", () => {
      helpRegistry.register(yuqueHelpConfig)

      const url = helpRegistry.getHelpUrl("platform-config/common_Yuque-z2jom6d")
      expect(url).toBe(yuqueHelpConfig.helpUrl)
    })

    it("should return global default helpUrl for unknown page", () => {
      const url = helpRegistry.getHelpUrl("unknown-xyz")
      expect(url).toBe("https://siyuan.wiki/s/20230810132040-nn4q7vs")
    })
  })

  describe("hasConfig()", () => {
    it("should return true for registered pageId", () => {
      expect(helpRegistry.hasConfig("test-page")).toBe(true)
    })

    it("should return false for unregistered pageId", () => {
      expect(helpRegistry.hasConfig("unknown")).toBe(false)
    })
  })
})

describe("verified platform help configs", () => {
  const verifiedConfigs = [
    yuqueHelpConfig,
    notionHelpConfig,
    haloHelpConfig,
    cnblogsHelpConfig,
    wordpressHelpConfig,
    yuquewebHelpConfig,
    halowebHelpConfig,
    localSystemHelpConfig,
    zhihuHelpConfig,
    csdnHelpConfig,
    jianshuHelpConfig,
    juejinHelpConfig,
    wechatHelpConfig,
    bilibiliHelpConfig,
  ]

  it("should provide complete panel, field, faq, and tour coverage for verified platforms", () => {
    for (const config of verifiedConfigs) {
      expect(config.summary, `${config.pageId} summary`).toBeTruthy()
      expect(Object.keys(config.fields ?? {}), `${config.pageId} fields`).not.toHaveLength(0)
      expect(config.faq, `${config.pageId} faq`).toBeDefined()
      expect(config.faq?.length, `${config.pageId} faq length`).toBeGreaterThan(0)
      expect(config.tour, `${config.pageId} tour`).toBeDefined()
      expect(config.tour?.length, `${config.pageId} tour length`).toBeGreaterThan(0)

      for (const step of config.tour ?? []) {
        expect(step.target, `${config.pageId} tour target`).toMatch(/^\[data-syp-tour='[^']+'\]$/)
      }
    }
  })

  it("should move verified split-out platforms out of remaining T1 help configs", () => {
    const remainingPageIds = remainingT1HelpConfigs.map((config) => config.pageId)

    for (const config of verifiedConfigs) {
      expect(remainingPageIds, `${config.pageId} should not stay in remaining T1`).not.toContain(config.pageId)
    }
  })
})
