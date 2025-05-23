import { describe, it, beforeEach, expect, vi } from "vitest"
import { PluginLoader } from "@/utils/pluginLoader.ts"
import { IPluginTemplate } from "siyuan-plugin-publisher-types"
import path from "path"
import logger from "./logger"

// Mock logger
vi.mock("@utils/appLogger.ts", () => ({
  createAppLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}))

describe("PluginLoader", () => {
  let loader: PluginLoader

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset singleton before each test
    // @ts-ignore
    PluginLoader.instance = undefined
    loader = PluginLoader.getInstance()
  })

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = PluginLoader.getInstance()
      const instance2 = PluginLoader.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe("loadTemplate", () => {
    it("should successfully load a test template", async () => {
      const templatePath = path.join(__dirname, "testdata/wordpress/index.js")
      const template = await loader.loadTemplate(templatePath)
      logger.debug("Loaded template", template)
    })

    it("should successfully load a valid template", async () => {
      const mockTemplate: IPluginTemplate = {
        id: "test-plugin",
        name: "Test Plugin",
        version: "1.0.0",
        entry: "index.js",
        author: "Test Author",
        description: "Test Description",
      } as IPluginTemplate

      // Mock dynamic import
      const mockImport = vi.fn().mockResolvedValue({
        default: mockTemplate,
      })
      vi.stubGlobal("import", mockImport)

      const templatePath = path.join(__dirname, "testdata/test-template/index.js")
      const template = await loader.loadTemplate(templatePath)
      expect(template).toEqual(mockTemplate)
    })

    it("should throw error when template is invalid", async () => {
      const invalidTemplate = {
        id: "test-plugin",
        // Missing required fields
      }

      // Mock dynamic import with invalid template
      const mockImport = vi.fn().mockResolvedValue({
        default: invalidTemplate,
      })
      vi.stubGlobal("import", mockImport)

      const templatePath = path.join(__dirname, "testdata/test-template/index.js")
      await expect(loader.loadTemplate(templatePath)).rejects.toThrow("Template must have name field")
    })

    it("should throw error when template loading fails", async () => {
      // Mock dynamic import failure
      const mockImport = vi.fn().mockRejectedValue(new Error("Failed to load template"))
      vi.stubGlobal("import", mockImport)

      const templatePath = path.join(__dirname, "testdata/test-template/index.js")
      await expect(loader.loadTemplate(templatePath)).rejects.toThrow("Failed to load template")
    })
  })
})
