/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { IPlugin } from "@/plugin"
import { PluginLoader, PluginLoaderOptions } from "./types"
import { normalizePath } from "@utils/fileUtils.ts"
import { PLUGIN_BASE_PATH } from "@/plugin/constants/PluginConstants.ts"

const logger = createAppLogger("plugin-loader")

/**
 * 插件加载器管理器
 *
 * @author terwer
 * @since 2.0.0
 * @version 2.0.0
 */
export class PluginLoaderManager implements PluginLoader {
  private static instance: PluginLoaderManager
  private plugins: Map<string, IPlugin> = new Map()
  private options: PluginLoaderOptions

  private constructor(options: PluginLoaderOptions = {}) {
    this.options = {
      basePath: PLUGIN_BASE_PATH,
      autoLoad: false,
      ...options,
    }
  }

  static getInstance(options?: PluginLoaderOptions): PluginLoaderManager {
    if (!PluginLoaderManager.instance) {
      PluginLoaderManager.instance = new PluginLoaderManager(options)
    }
    return PluginLoaderManager.instance
  }

  registerPlugin(plugin: IPlugin): void {
    if (this.plugins.has(plugin.platform)) {
      logger.warn(`Plugin already registered for platform: ${plugin.platform}`)
      return
    }
    this.plugins.set(plugin.platform, plugin)
    logger.info(`Plugin registered: ${plugin.name} (${plugin.platform})`)
  }

  getPlugin(platform: string): IPlugin | undefined {
    return this.plugins.get(platform)
  }

  async unloadPlugin(platform: string): Promise<{ success: boolean; error?: Error }> {
    const plugin = this.plugins.get(platform)
    if (!plugin) {
      const error = new Error(`Plugin not found for platform: ${platform}`)
      logger.error(error.message)
      return { success: false, error }
    }

    try {
      // 如果插件有 destroy 生命周期钩子，执行清理
      if (plugin.destroy) {
        await plugin.destroy()
        logger.info(`Plugin destroyed: ${plugin.name}`)
      }

      // 从 Map 中移除插件
      this.plugins.delete(platform)
      logger.info(`Plugin unloaded: ${plugin.name} (${platform})`)
      return { success: true }
    } catch (e: any) {
      logger.error(`Failed to unload plugin ${plugin.name}: ${e.message}`)
      return { success: false, error: e }
    }
  }

  getAllPlugins(): IPlugin[] {
    return Array.from(this.plugins.values())
  }

  clearAllPlugins(): void {
    this.plugins.clear()
    logger.info("All plugins cleared")
  }

  async loadPlugin(pluginPath: string): Promise<{ success: boolean; error?: Error }> {
    try {
      const fullPath = normalizePath(this.options.basePath!, pluginPath)
      logger.info(`Loading plugin from: ${fullPath}`)

      // 1. 加载插件模块
      const module = await import(fullPath)
      const plugin = module.default

      // 2. 验证插件
      if (!this.validatePlugin(plugin)) {
        const error = new Error(`Invalid plugin: ${pluginPath}`)
        logger.error(error.message)
        return { success: false, error }
      }

      // 3. 初始化插件
      if (plugin.init) {
        try {
          await plugin.init(plugin.defaultConfig || {})
          logger.info(`Plugin initialized: ${plugin.name}`)
        } catch (initError: any) {
          logger.error(`Failed to initialize plugin ${plugin.name}: ${initError}`)
          return { success: false, error: initError }
        }
      }

      // 4. 注册插件
      this.registerPlugin(plugin)
      logger.info(`Plugin loaded successfully: ${plugin.name}`)
      return { success: true }
    } catch (e: any) {
      logger.error(`Failed to load plugin: ${JSON.stringify(e)}`)
      return { success: false, error: e }
    }
  }

  private validatePlugin(plugin: any): plugin is IPlugin {
    const requiredFields = ["id", "name", "version", "platform"]
    const missingFields = requiredFields.filter((field) => !plugin[field])

    if (missingFields.length > 0) {
      logger.error(`Plugin validation failed. Missing required fields: ${missingFields.join(", ")}`)
      return false
    }

    return true
  }
}
