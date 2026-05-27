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