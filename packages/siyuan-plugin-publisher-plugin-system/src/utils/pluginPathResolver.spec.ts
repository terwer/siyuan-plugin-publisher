import { describe, it, beforeEach, expect } from "vitest"
import { PluginPathResolver } from "@/utils/pluginPathResolver"
import { PLUGIN_BASE_PATH } from "@/constants/pluginConstants"

describe("PluginPathResolver", () => {
  let resolver: PluginPathResolver

  beforeEach(() => {
    // Reset singleton before each test
    // @ts-ignore
    PluginPathResolver.instance = undefined
    resolver = PluginPathResolver.getInstance()
  })

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = PluginPathResolver.getInstance()
      const instance2 = PluginPathResolver.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe("getTemplatePath", () => {
    const templateId = "test-plugin"

    it("should return correct root path", () => {
      const path = resolver.getTemplatePath(templateId, "root")
      expect(path).toBe(`${PLUGIN_BASE_PATH}/${templateId}`)
    })

    it("should return correct package path", () => {
      const path = resolver.getTemplatePath(templateId, "package")
      expect(path).toBe(`${PLUGIN_BASE_PATH}/${templateId}/package.json`)
    })

    it("should return correct entry path", () => {
      const path = resolver.getTemplatePath(templateId, "entry")
      expect(path).toBe(`${PLUGIN_BASE_PATH}/${templateId}/index.js`)
    })

    it("should return root path by default", () => {
      const path = resolver.getTemplatePath(templateId)
      expect(path).toBe(`${PLUGIN_BASE_PATH}/${templateId}`)
    })

    it("should cache path results", () => {
      const path1 = resolver.getTemplatePath(templateId, "root")
      const path2 = resolver.getTemplatePath(templateId, "root")
      expect(path1).toBe(path2)
    })
  })

  describe("resolvePluginId", () => {
    it("should correctly resolve plugin ID from path", () => {
      const path = `${PLUGIN_BASE_PATH}/test-plugin/some/file.js`
      const pluginId = resolver.resolvePluginId(path)
      expect(pluginId).toBe("test-plugin")
    })

    it("should return null when path doesn't match", () => {
      const path = "/some/other/path"
      const pluginId = resolver.resolvePluginId(path)
      expect(pluginId).toBeNull()
    })
  })
})
