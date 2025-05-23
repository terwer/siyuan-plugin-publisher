import type { Plugin, PluginManifest, PluginLoadResult } from "../types"
import { PluginLoader as CorePluginLoader } from "./PluginLoader"
import { checkDependencies } from "../utils"

export class BrowserPluginLoader {
  private static instance: BrowserPluginLoader
  private coreLoader: CorePluginLoader
  private loadedPlugins: Map<string, Plugin> = new Map()

  private constructor() {
    this.coreLoader = CorePluginLoader.getInstance()
  }

  static getInstance(): BrowserPluginLoader {
    if (!BrowserPluginLoader.instance) {
      BrowserPluginLoader.instance = new BrowserPluginLoader()
    }
    return BrowserPluginLoader.instance
  }

  async loadPlugin(url: string): Promise<PluginLoadResult> {
    try {
      // 加载插件清单
      const manifestResponse = await fetch(`${url}/manifest.json`)
      if (!manifestResponse.ok) {
        throw new Error(`Failed to load plugin manifest: ${manifestResponse.statusText}`)
      }

      const manifest: PluginManifest = await manifestResponse.json()

      // 检查插件是否已加载
      if (this.loadedPlugins.has(manifest.id)) {
        return {
          success: false,
          error: `Plugin ${manifest.id} is already loaded`,
        }
      }

      // 加载插件主文件
      const plugin = await this.loadPluginScript(url, manifest)

      // 检查依赖
      if (!checkDependencies(plugin, this.loadedPlugins)) {
        return {
          success: false,
          error: `Plugin ${manifest.id} dependencies not satisfied`,
        }
      }

      // 使用核心加载器验证和初始化插件
      const validationResult = await this.coreLoader.loadPlugin(plugin, manifest)
      if (!validationResult.success) {
        throw new Error(validationResult.error)
      }

      this.loadedPlugins.set(manifest.id, plugin)

      return {
        success: true,
        plugin,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load plugin",
      }
    }
  }

  private async loadPluginScript(url: string, manifest: PluginManifest): Promise<Plugin> {
    return new Promise<Plugin>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = `${url}/${manifest.main}`
      script.type = "module"

      script.onload = async () => {
        try {
          // 假设插件导出了一个默认的工厂函数
          const pluginFactory = (window as any)[`__plugin_${manifest.id}`]
          if (!pluginFactory) {
            throw new Error(`Plugin factory not found for ${manifest.id}`)
          }

          const plugin = await pluginFactory()
          resolve(plugin)
        } catch (error) {
          reject(error)
        }
      }

      script.onerror = () => reject(new Error(`Failed to load plugin script: ${manifest.main}`))
      document.head.appendChild(script)
    })
  }

  async unloadPlugin(pluginId: string): Promise<boolean> {
    const plugin = this.loadedPlugins.get(pluginId)
    if (!plugin) {
      return false
    }

    try {
      await plugin.destroy()
      this.loadedPlugins.delete(pluginId)
      return true
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginId}:`, error)
      return false
    }
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.loadedPlugins.get(pluginId)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.loadedPlugins.values())
  }

  async loadPlugins(urls: string[]): Promise<PluginLoadResult[]> {
    const loadPromises = urls.map((url) => this.loadPlugin(url))
    return Promise.all(loadPromises)
  }

  async unloadAll(): Promise<boolean[]> {
    const unloadPromises = Array.from(this.loadedPlugins.keys()).map((id) => this.unloadPlugin(id))
    return Promise.all(unloadPromises)
  }
}
