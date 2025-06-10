import {
  PluginManager as IPluginManager,
  PlatformAdaptor,
  Plugin,
  PluginState,
  PublisherError
} from "@siyuan-publisher/common"

export class PluginManager implements IPluginManager {
  private static instance: PluginManager
  private plugins: Map<string, Plugin> = new Map()
  private platformAdaptors: Map<string, PlatformAdaptor> = new Map()
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
      throw new PublisherError("PLUGIN_ALREADY_REGISTERED", `Plugin ${plugin.id} already registered`, {
        metadata: {
          pluginId: plugin.id,
          pluginType: plugin.type,
          existingPlugin: this.plugins.get(plugin.id),
        },
      })
    }

    try {
      this.plugins.set(plugin.id, plugin)
      this.pluginStates.set(plugin.id,  { status: "registered" } )

      if (this.isPlatformAdaptor(plugin)) {
        this.platformAdaptors.set(plugin.id, plugin as any)
      }

      if (typeof plugin.initialize === "function") {
        await plugin.initialize()
      }
    } catch (error: any) {
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
      if (typeof plugin.destroy === "function") {
        await plugin.destroy()
      }
      this.plugins.delete(id)
      this.pluginStates.delete(id)

      if (this.isPlatformAdaptor(plugin)) {
        this.platformAdaptors.delete(plugin.id)
      }
    } catch (error: any) {
      throw new PublisherError("PLUGIN_DESTROY_FAILED", `Failed to destroy plugin ${id}`, {
        originalError: error,
      })
    }
  }

  private isPlatformAdaptor(plugin: Plugin): boolean {
    return plugin.type === "adaptor"
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  getPlatformAdaptor(type: string): PlatformAdaptor | undefined {
    return this.platformAdaptors.get(type)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getAllPlatformAdaptors(): PlatformAdaptor[] {
    return Array.from(this.platformAdaptors.values())
  }

  getPluginState(id: string): PluginState | undefined {
    return this.pluginStates.get(id)
  }

  async unloadAll(): Promise<void> {
    const plugins = this.getAllPlugins()
    for (const plugin of plugins) {
      try {
        await this.unregisterPlugin(plugin.id)
      } catch (error) {
        console.error(`Failed to unload plugin ${plugin.id}:`, error)
      }
    }
  }
}
