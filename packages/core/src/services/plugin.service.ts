import { Plugin } from '../types';

export class PluginService {
  private plugins: Map<string, Plugin> = new Map();

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`);
    }

    try {
      await plugin.init();
      this.plugins.set(plugin.name, plugin);
    } catch (error) {
      throw new Error(`Failed to initialize plugin ${plugin.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async unregisterPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} is not registered`);
    }

    try {
      await plugin.destroy();
      this.plugins.delete(name);
    } catch (error) {
      throw new Error(`Failed to destroy plugin ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
} 