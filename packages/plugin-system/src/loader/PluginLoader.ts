import { Plugin } from "@siyuan-publisher/core"
import { PluginLoadResult, PluginManifest } from "../types"
import { validateManifest, validatePluginType } from "../utils"

export class PluginLoader {
  private static instance: PluginLoader

  private constructor() {}

  static getInstance(): PluginLoader {
    if (!PluginLoader.instance) {
      PluginLoader.instance = new PluginLoader()
    }
    return PluginLoader.instance
  }

  async loadPlugin(plugin: Plugin, manifest: PluginManifest): Promise<PluginLoadResult> {
    try {
      if (!validateManifest(manifest)) {
        return {
          success: false,
          error: "Invalid plugin manifest",
        }
      }

      if (!this.validatePlugin(plugin, manifest)) {
        return {
          success: false,
          error: "Invalid plugin structure",
        }
      }

      // 初始化插件
      await plugin.initialize()

      return {
        success: true,
        plugin,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  private validatePlugin(plugin: any, manifest: PluginManifest): plugin is Plugin {
    if (typeof plugin !== "object" || plugin === null) {
      return false
    }

    const requiredFields = ["id", "name", "version"]
    const hasRequiredFields = requiredFields.every(
      (field) => typeof plugin[field] === "string" && plugin[field].length > 0,
    )

    if (!hasRequiredFields) {
      return false
    }

    const hasRequiredMethods =
      typeof plugin.initialize === "function" &&
      typeof plugin.destroy === "function" &&
      typeof plugin.getConfig === "function" &&
      typeof plugin.updateConfig === "function"

    if (!hasRequiredMethods) {
      return false
    }

    // 验证插件类型特定的方法
    return validatePluginType(plugin, manifest.type)
  }
}
