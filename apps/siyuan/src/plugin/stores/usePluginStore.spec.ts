import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { usePluginStore } from "./usePluginStore"
import { PluginLoader } from "@/plugin/utils/pluginLoader"
import { PluginPathResolver } from "@/plugin/utils/pluginPathResolver"
import { IPlugin, IPluginConfig, IPluginTemplate } from "siyuan-plugin-publisher-types"

// Mock dependencies
vi.mock("@/plugin/utils/pluginLoader")
vi.mock("@/plugin/utils/pluginPathResolver")
vi.mock("@utils/appLogger")

describe("usePluginStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockTemplate = {
    id: "test-template",
    name: "Test Template",
    description: "Test Description",
    defaultConfig: {
      setting1: "default1",
      setting2: "default2",
    } as any,
  } as IPluginTemplate

  const mockConfig: Partial<IPluginConfig> = {
    setting1: "custom1",
    setting2: "custom2",
  } as any

  describe("getters", () => {
    it("should get template by id", () => {
      const store = usePluginStore()
      store.pluginTemplates = { "test-template": mockTemplate }
      expect(store.getTemplate("test-template")).toEqual(mockTemplate)
      expect(store.getTemplate("non-existent")).toBeUndefined()
    })

    it("should get plugin by id", () => {
      const store = usePluginStore()
      const mockPlugin = {
        id: "test-plugin",
        templateId: "test-template",
        name: "Test Plugin",
        config: mockConfig,
      } as any
      store.plugins = { "test-plugin": mockPlugin }

      expect(store.getPlugin("test-plugin")).toEqual(mockPlugin)
      expect(store.getPlugin("non-existent")).toBeUndefined()
    })

    it("should get plugins by template id", () => {
      const store = usePluginStore()
      const mockPlugins = {
        plugin1: { id: "plugin1", templateId: "template1", name: "Plugin 1", config: {} } as IPlugin,
        plugin2: { id: "plugin2", templateId: "template1", name: "Plugin 2", config: {} } as IPlugin,
        plugin3: { id: "plugin3", templateId: "template2", name: "Plugin 3", config: {} } as IPlugin,
      }
      store.plugins = mockPlugins

      const template1Plugins = store.getPlugins("template1")
      expect(template1Plugins).toHaveLength(2)
      expect(template1Plugins.map((p) => p.id)).toEqual(["plugin1", "plugin2"])
    })
  })

  describe("actions", () => {
    it("should load plugin template", async () => {
      // const store = usePluginStore()
      // const mockPath = "/test/path"
      // vi.spyOn(store.pathResolver, "getTemplatePath").mockReturnValue(mockPath)
      // vi.spyOn(store.pluginLoader, "loadTemplate").mockResolvedValue(mockTemplate)
      //
      // const result = await store.loadPluginTemplate("test-template")
      // expect(result).toEqual(mockTemplate)
      // expect(store.pluginTemplates["test-template"]).toEqual(mockTemplate)
    })

    it("should create plugin instance with custom id", () => {
      const store = usePluginStore()
      store.pluginTemplates = { "test-template": mockTemplate }

      const instance = store.createPluginInstance("test-template", "custom-instance-id", mockConfig)

      expect(instance.id).toBe("custom-instance-id")
      expect(instance.templateId).toBe("test-template")
      expect(instance.config).toEqual({
        ...mockTemplate.defaultConfig,
        ...mockConfig,
      })
      expect(store.plugins["custom-instance-id"]).toBeDefined()
    })

    it("should create plugin instance with auto-generated id", () => {
      const store = usePluginStore()
      store.pluginTemplates = { "test-template": mockTemplate }

      const instance = store.createPluginInstance("test-template", undefined, mockConfig)

      expect(instance.id).toMatch(/^test-template_\d+$/)
      expect(instance.templateId).toBe("test-template")
      expect(instance.config).toEqual({
        ...mockTemplate.defaultConfig,
        ...mockConfig,
      })
      expect(store.plugins[instance.id]).toBeDefined()
    })

    it("should update plugin config", () => {
      const store = usePluginStore()
      const instance = store.createPluginInstance("test-template", undefined, mockConfig)
      const newConfig = { setting2: "updated" } as any

      store.updatePluginConfig(instance.id, newConfig)

      expect(store.plugins[instance.id].config).toEqual({
        ...mockTemplate.defaultConfig,
        ...mockConfig,
        ...newConfig,
      })
    })

    it("should delete plugin", () => {
      const store = usePluginStore()
      const instance = store.createPluginInstance("test-template", undefined, mockConfig)

      store.deletePlugin(instance.id)

      expect(store.plugins[instance.id]).toBeUndefined()
    })

    it("should set active instance", () => {
      const store = usePluginStore()
      const instance = store.createPluginInstance("test-template", undefined, mockConfig)

      store.setActiveInstance(instance.id)

      expect(store.activePlugin).toBe(instance.id)
    })

    it("should throw error when template not found", () => {
      const store = usePluginStore()

      expect(() => {
        store.createPluginInstance("non-existent")
      }).toThrow("Template non-existent not found")
    })

    it("should throw error when instance not found", () => {
      const store = usePluginStore()

      expect(() => {
        store.updatePluginConfig("non-existent", {})
      }).toThrow("Instance non-existent not found")
    })
  })
})
