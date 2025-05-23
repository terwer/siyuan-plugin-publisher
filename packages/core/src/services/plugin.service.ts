import type { Plugin } from "../types"
import { PublisherError } from "../types"

export class PluginService {
  private plugins: Map<string, Plugin> = new Map()

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new PublisherError("PLUGIN_LOAD_FAILED", `Plugin ${plugin.name} (${plugin.id}) is already registered`)
    }

    try {
      await plugin.initialize()
      this.plugins.set(plugin.id, plugin)
    } catch (error) {
      throw new PublisherError("PLUGIN_INIT_FAILED", `Failed to initialize plugin ${plugin.name} (${plugin.id})`, {
        originalError: error,
      })
    }
  }

  async unregisterPlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id)
    if (!plugin) {
      throw new PublisherError("PLUGIN_DESTROY_FAILED", `Plugin with id ${id} is not registered`)
    }

    try {
      await plugin.destroy()
      this.plugins.delete(id)
    } catch (error) {
      throw new PublisherError("PLUGIN_DESTROY_FAILED", `Failed to destroy plugin ${plugin.name} (${id})`, {
        originalError: error,
      })
    }
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }
}
