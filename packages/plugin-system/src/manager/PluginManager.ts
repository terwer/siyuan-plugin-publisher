import type { Plugin, PlatformAdapter, PlatformConfig } from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/core"
import type { PluginLoadResult, PluginUnloadResult, PluginState } from "../types"

export class PluginManager {
  private static instance: PluginManager
  private plugins: Map<string, Plugin> = new Map()
  private platformAdapters: Map<string, PlatformAdapter> = new Map()
  private pluginStates: Map<string, PluginState> = new Map()

  private constructor() {}

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager()
    }
    return PluginManager.instance
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new PublisherError("PLUGIN_ALREADY_REGISTERED", `Plugin ${plugin.id} already registered`)
    }

    try {
      await plugin.initialize()
      this.plugins.set(plugin.id, plugin)
      this.pluginStates.set(plugin.id, { status: "loaded" })

      // 如果是平台适配器，额外注册
      if (this.isPlatformAdapter(plugin)) {
        this.platformAdapters.set(plugin.type, plugin)
      }
    } catch (error) {
      throw new PublisherError("PLUGIN_INIT_FAILED", `Failed to initialize plugin ${plugin.id}`, {
        originalError: error,
      })
    }
  }

  async unregisterPlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id)
    if (!plugin) {
      throw new PublisherError("PLUGIN_NOT_FOUND", `Plugin ${id} not found`)
    }

    try {
      await plugin.destroy()
      this.plugins.delete(id)
      this.pluginStates.delete(id)

      // 如果是平台适配器，额外注销
      if (this.isPlatformAdapter(plugin)) {
        this.platformAdapters.delete(plugin.type)
      }
    } catch (error) {
      throw new PublisherError("PLUGIN_DESTROY_FAILED", `Failed to destroy plugin ${id}`, {
        originalError: error,
      })
    }
  }

  private isPlatformAdapter(plugin: Plugin): plugin is PlatformAdapter {
    return "connect" in plugin && "publish" in plugin
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  getPlatformAdapter(type: string): PlatformAdapter | undefined {
    return this.platformAdapters.get(type)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getAllPlatformAdapters(): PlatformAdapter[] {
    return Array.from(this.platformAdapters.values())
  }

  getPluginState(id: string): PluginState | undefined {
    return this.pluginStates.get(id)
  }

  async unloadAll(): Promise<void> {
    const plugins = this.getAllPlugins()
    for (const plugin of plugins) {
      await this.unregisterPlugin(plugin.id)
    }
  }
}
