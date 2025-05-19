import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Post } from "zhi-blog-api"
import path from "path"
import { PluginLoaderManager } from "@/plugin/loader/manager.ts"
import { IPlugin } from "@/plugin"
import { normalizePath } from "@utils/fileUtils.ts"

// 模拟 window 对象
vi.stubGlobal("window", {})

describe("PluginLoader", () => {
  let pluginLoader: PluginLoaderManager

  beforeEach(() => {
    const basePath = path.resolve(__dirname, "../../../../../dist/siyuan/plugins")
    console.log(basePath)
    const options = {
      basePath: basePath,
    }
    pluginLoader = PluginLoaderManager.getInstance(options)
    pluginLoader.clearAllPlugins()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Plugin Loading", () => {
    // it("should successfully load a valid plugin", async () => {
    //   const pluginPath = "wordpress/index.js"
    //   const result = await pluginLoader.loadPlugin(pluginPath)
    //   if (result.error) {
    //     console.error(result.error)
    //   }
    //   expect(result.success).toBe(true)
    //   expect(result.error).toBeUndefined()
    //   expect(pluginLoader.getPlugin("wordpress")).toBeDefined()
    // })
    //
    // it("should not load invalid plugins", async () => {
    //   const invalidPlugin = "invalid-plugin"
    //   const result = await pluginLoader.loadPlugin(invalidPlugin)
    //   expect(result.success).toBe(false)
    //   expect(result.error).toBeDefined()
    //   expect(pluginLoader.getPlugin("invalid-plugin")).toBeUndefined()
    // })
    //
    // it("should not load plugins with duplicate names", async () => {
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //   const result = await pluginLoader.loadPlugin(pluginPath)
    //   expect(result.success).toBe(false)
    //   expect(result.error).toBeDefined()
    // })
    //
    // it("should validate plugin configuration during loading", async () => {
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //   const mockPlugin = pluginLoader.getPlugin("wordpress")
    //   if (!mockPlugin) {
    //     return
    //   }
    // })
  })

  describe("Plugin Management", () => {
    // it("should be able to retrieve loaded plugins", async () => {
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //   const plugin = pluginLoader.getPlugin("wordpress")
    //   expect(plugin).toBeDefined()
    //   expect(plugin?.name).toBe("WordPress")
    // })
    //
    // it("should be able to unload plugins", async () => {
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //   const result = await pluginLoader.unloadPlugin("wordpress")
    //   expect(result.success).toBe(true)
    //   expect(pluginLoader.getPlugin("wordpress")).toBeUndefined()
    // })
    //
    // it("should return false when unloading non-existent plugin", async () => {
    //   const result = await pluginLoader.unloadPlugin("non-existent-plugin")
    //   expect(result.success).toBe(false)
    // })
    //
    // it("should clear all plugins", async () => {
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //
    //   pluginLoader.clearAllPlugins()
    //   expect(pluginLoader.getPlugin("wordpress")).toBeUndefined()
    // })
  })

  describe("Plugin Publishing", () => {
    // it("should successfully publish content through plugin", async () => {
    //   const mockPost = {
    //     title: "Test Post",
    //     description: "Test Description",
    //   } as Post
    //
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //
    //   const mockPlugin = pluginLoader.getPlugin("wordpress")
    //   if (!mockPlugin) {
    //     return
    //   }
    //   const result = await mockPlugin.publish(mockPost)
    //   expect(result.success).toBe(true)
    //   expect(result.data).toBe("test-post-id")
    // })
    //
    // it("should handle publishing errors", async () => {
    //   const mockPost = {
    //     title: "Test Post",
    //     description: "Test Description",
    //   } as Post
    //
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //
    //   const mockPlugin = pluginLoader.getPlugin("wordpress")
    //   if (!mockPlugin) {
    //     return
    //   }
    //   const result = await mockPlugin.publish(mockPost)
    //   expect(result.success).toBe(false)
    //   expect(result.error).toBeDefined()
    //   expect(result.error?.message).toBe("Publish failed")
    // })
    //
    // it("should handle publishing through non-existent plugin", async () => {
    //   const mockPost = {
    //     title: "Test Post",
    //     description: "Test Description",
    //   } as Post
    //
    //   const pluginPath = "wordpress/index.js"
    //   await pluginLoader.loadPlugin(pluginPath)
    //
    //   const mockPlugin = pluginLoader.getPlugin("non-existent-plugin")
    //   if (!mockPlugin) {
    //     return
    //   }
    //   const result = await mockPlugin.publish(mockPost)
    //   expect(result.success).toBe(false)
    //   expect(result.error).toBeDefined()
    // })
  })
})
