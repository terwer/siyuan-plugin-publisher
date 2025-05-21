/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { IPlugin, mountPtAttr, PluginLoader, PluginLoaderOptions } from "siyuan-plugin-publisher-types"
import { normalizePath } from "@utils/fileUtils.ts"
import { PLUGIN_BASE_PATH } from "@/plugin/constants/PluginConstants.ts"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { useSiyuanSettingStore } from "@stores/useSiyuanSettingStore.ts"
import * as _ from "lodash-es"
import { WINDOW_SIYUAN } from "@/Constants.ts"
import { useProxyFetch } from "@composables/useProxyFetch.ts"
import { getTemplatePlatformKey } from "@/models/dynamicConfig.ts"

const logger = createAppLogger("plugin-loader")

/**
 * 插件加载器管理器
 *
 * @author terwer
 * @since 2.0.0
 * @version 2.0.0
 */
export class PluginLoaderManager implements PluginLoader {
  private readonly kernelApi: SiyuanKernelApi
  private readonly proxyFetch: any
  private static instance: PluginLoaderManager
  private plugins: Map<string, IPlugin> = new Map()
  private options: PluginLoaderOptions

  private constructor(options: PluginLoaderOptions = {}) {
    this.options = {
      basePath: PLUGIN_BASE_PATH,
      autoLoad: false,
      ...options,
    }
    const { readonlySiyuanCfg } = useSiyuanSettingStore()
    this.kernelApi = new SiyuanKernelApi(readonlySiyuanCfg as SiyuanConfig)
    const { proxyFetch } = useProxyFetch()
    this.proxyFetch = proxyFetch
    // 挂载 API 给插件使用
    this.mountApi()
  }

  static getInstance(options?: PluginLoaderOptions): PluginLoaderManager {
    if (!PluginLoaderManager.instance) {
      PluginLoaderManager.instance = new PluginLoaderManager(options)
    }
    return PluginLoaderManager.instance
  }

  registerPlugin(plugin: IPlugin): void {
    if (this.plugins.has(plugin.id)) {
      logger.warn(`Plugin already registered for platform: ${plugin.id}`)
      return
    }
    this.plugins.set(plugin.id, plugin)
    logger.info(`Plugin registered: ${plugin.name} (${plugin.id})`)
  }

  getPlugin(id: string): IPlugin | undefined {
    const platform = this.getPlatform(id)
    return this.plugins.get(platform)
  }

  async unloadPlugin(id: string): Promise<{ success: boolean; error?: Error }> {
    const plugin = this.plugins.get(id)
    if (!plugin) {
      const error = new Error(`Plugin not found for platform: ${id}`)
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
      this.plugins.delete(id)
      logger.info(`Plugin unloaded: ${plugin.name} (${id})`)
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

  async loadPlugin(pluginPath: string): Promise<{ success: boolean; instance?: IPlugin; error?: Error }> {
    try {
      // 1. 加载插件模块
      const fullPath = normalizePath(this.options.basePath!, pluginPath)
      logger.info(`Loading plugin from: ${fullPath}`)

      // 获取插件所在目录
      let pluginDir = fullPath.substring(0, fullPath.lastIndexOf("/"))
      if (pluginDir === "") {
        pluginDir = "."
      }

      // 读取 package.json
      const pkgPath = normalizePath("/data", pluginDir, "package.json")
      const pkg = await this.kernelApi.getFile(pkgPath, "json")
      logger.info(`Read plugin package.json:`, pkg)

      // 动态加载插件文件
      await import(fullPath)

      // 新增：等待 window.pt[pkg.id] 出现，最多等待 5 秒
      const plugin = await this.waitForPluginToLoad(pkg.id, 5000)
      if (!plugin) {
        const error = new Error(`Plugin did not load into window.pt.plugins within timeout: ${pkg.id}`)
        logger.error(error.message)
        return { success: false, error }
      }

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
      return { success: true, instance: plugin }
    } catch (e: any) {
      logger.error(`Failed to load plugin: ${JSON.stringify(e)}`)
      return { success: false, error: e }
    }
  }

  private validatePlugin(plugin: any): plugin is IPlugin {
    const requiredFields = ["id", "name", "version"]
    const missingFields = requiredFields.filter((field) => !plugin[field])

    if (missingFields.length > 0) {
      logger.error(`Plugin validation failed. Missing required fields: ${missingFields.join(", ")}`)
      return false
    }

    return true
  }

  private waitForPluginToLoad(id: string, timeout: number = 3000): Promise<IPlugin | null> {
    const platform = this.getPlatform(id)
    return new Promise((resolve) => {
      const startTime = Date.now()
      const checkInterval = setInterval(() => {
        const ptWin = window.pt
        logger.debug("try get widnow.pt", ptWin)
        if (ptWin === undefined) {
          return
        }
        const ptPlugins = ptWin.plugins
        if (ptPlugins && ptPlugins[platform]) {
          clearInterval(checkInterval)
          resolve(ptPlugins[platform])
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval)
          resolve(null)
        }
      }, 1000)
    })
  }

  private getPlatform(id: string) {
    const platform = getTemplatePlatformKey(id)
    if (platform !== id) {
      logger.info(`use new instance for platform template: ${platform}, original id: ${id}`)
    }
    return platform
  }

  private mountApi() {
    // 挂载 API 给插件使用
    mountPtAttr("api.siyuan", {
      config: WINDOW_SIYUAN.config,
      kernelApi: this.kernelApi,
    })
    mountPtAttr("api.util.fetch", this.proxyFetch)
    mountPtAttr("api.util.Lodash", _)
  }
}
