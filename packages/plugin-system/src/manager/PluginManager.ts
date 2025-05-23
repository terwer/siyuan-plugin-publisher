import { Plugin } from '@siyuan-publisher/core'
import { PluginManagerOptions, PluginLoadResult, PluginUnloadResult } from '../types'
import { PluginLoader } from '../loader/PluginLoader'

export class PluginManager {
  private static instance: PluginManager
  private plugins: Map<string, Plugin> = new Map()
  private loader: PluginLoader

  private constructor(options: PluginManagerOptions = {}) {
    this.loader = PluginLoader.getInstance()
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
    const loadPromises = plugins.map(plugin => this.loadPlugin(plugin))
    await Promise.all(loadPromises)
  }

  async loadPlugin(plugin: Plugin): Promise<PluginLoadResult> {
    if (this.plugins.has(plugin.name)) {
      return {
        success: false,
        error: new Error(`Plugin ${plugin.name} is already loaded`)
      }
    }

    try {
      await plugin.init()
      this.plugins.set(plugin.name, plugin)
      return {
        success: true,
        plugin
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      }
    }
  }

  async unloadPlugin(name: string): Promise<PluginUnloadResult> {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      return {
        success: false,
        error: new Error(`Plugin ${name} is not loaded`)
      }
    }

    try {
      await plugin.destroy()
      this.plugins.delete(name)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      }
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  async unloadAll(): Promise<PluginUnloadResult[]> {
    const unloadPromises = Array.from(this.plugins.keys()).map(name =>
      this.unloadPlugin(name)
    )
    return Promise.all(unloadPromises)
  }

  isPluginLoaded(name: string): boolean {
    return this.plugins.has(name)
  }

  getPluginCount(): number {
    return this.plugins.size
  }
} 