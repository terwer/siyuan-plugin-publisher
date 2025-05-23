import { Plugin } from '@siyuan-publisher/core'
import { PluginLoadResult } from '../types'

export class PluginLoader {
  private static instance: PluginLoader

  private constructor() {}

  static getInstance(): PluginLoader {
    if (!PluginLoader.instance) {
      PluginLoader.instance = new PluginLoader()
    }
    return PluginLoader.instance
  }

  async loadPlugin(pluginPath: string): Promise<PluginLoadResult> {
    try {
      const module = await import(pluginPath)
      const plugin = module.default as Plugin

      if (!this.validatePlugin(plugin)) {
        return {
          success: false,
          error: new Error('Invalid plugin structure')
        }
      }

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

  private validatePlugin(plugin: any): plugin is Plugin {
    return (
      typeof plugin === 'object' &&
      plugin !== null &&
      typeof plugin.name === 'string' &&
      typeof plugin.init === 'function' &&
      typeof plugin.destroy === 'function'
    )
  }
} 