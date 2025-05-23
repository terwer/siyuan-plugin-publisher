import { Plugin } from "@siyuan-publisher/core"
import { PluginManagerOptions, PluginLoadResult, PluginUnloadResult, PluginState, PluginManifest } from "../types"
import { PluginLoader } from "../loader/PluginLoader"

export class PluginManager {
  private static instance: PluginManager
  private plugins: Map<string, Plugin> = new Map()
  private pluginStates: Map<string, PluginState> = new Map()
  private loader: PluginLoader
  private pluginDir?: string

  private constructor(options: PluginManagerOptions = {}) {
    this.loader = PluginLoader.getInstance()
    this.pluginDir = options.pluginDir
    if (options.autoLoad && options.plugins) {
      this.loadPlugins(options.plugins)
    }
  }

  static getInstance(options?: PluginManagerOptions): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager(options)
    }
    return PluginManager.instance
  }

  private async loadPlugins(plugins: Plugin[]): Promise<void> {
    const loadPromises = plugins.map((plugin) => this.loadPlugin(plugin))
    await Promise.all(loadPromises)
  }

  private async resolveDependencies(manifest: PluginManifest): Promise<boolean> {
    if (!manifest.dependencies) {
      return true
    }

    for (const depId of manifest.dependencies) {
      const depPlugin = this.getPlugin(depId)
      if (!depPlugin) {
        throw new Error(`Dependency plugin ${depId} not found`)
      }
      const depState = this.pluginStates.get(depId)
      if (!depState || depState.status !== "loaded") {
        throw new Error(`Dependency plugin ${depId} is not loaded`)
      }
    }
    return true
  }

  async loadPlugin(plugin: Plugin): Promise<PluginLoadResult> {
    if (this.plugins.has(plugin.id)) {
      return {
        success: false,
        error: `Plugin ${plugin.id} is already loaded`,
      }
    }

    try {
      this.pluginStates.set(plugin.id, { status: "loading" })

      // 获取插件清单
      const module = await import(plugin.id)
      const manifest = module.manifest as PluginManifest

      // 解析依赖
      await this.resolveDependencies(manifest)

      // 初始化插件
      await plugin.initialize()

      this.plugins.set(plugin.id, plugin)
      this.pluginStates.set(plugin.id, {
        status: "loaded",
        dependencies: manifest.dependencies,
      })

      return {
        success: true,
        plugin,
      }
    } catch (error) {
      this.pluginStates.set(plugin.id, {
        status: "error",
        error: error instanceof Error ? error : new Error("Unknown error occurred"),
      })
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async unloadPlugin(id: string): Promise<PluginUnloadResult> {
    const plugin = this.plugins.get(id)
    if (!plugin) {
      return {
        success: false,
        error: new Error(`Plugin ${id} is not loaded`),
      }
    }

    // 检查是否有其他插件依赖此插件
    for (const [pluginId, state] of this.pluginStates.entries()) {
      if (state.dependencies?.includes(id)) {
        return {
          success: false,
          error: new Error(`Cannot unload plugin ${id} as it is required by ${pluginId}`),
        }
      }
    }

    try {
      await plugin.destroy()
      this.plugins.delete(id)
      this.pluginStates.set(id, { status: "unloaded" })
      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Unknown error occurred"),
      }
    }
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  getPluginState(id: string): PluginState | undefined {
    return this.pluginStates.get(id)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  async unloadAll(): Promise<PluginUnloadResult[]> {
    const unloadPromises = Array.from(this.plugins.keys()).map((id) => this.unloadPlugin(id))
    return Promise.all(unloadPromises)
  }

  isPluginLoaded(id: string): boolean {
    return this.plugins.has(id)
  }

  getPluginCount(): number {
    return this.plugins.size
  }
}
