import type {
  Plugin,
  PluginConfig,
  PluginMetadata,
  PluginManifest,
  PluginLoader,
  PluginLoadResult,
  PluginUnloadResult,
  PluginState,
  Logger,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

/**
 * 插件服务类
 *
 * 核心功能：
 * 1. 插件生命周期管理
 *    - 加载/卸载插件
 *    - 初始化/销毁插件
 *    - 管理插件状态
 *
 * 2. 插件配置管理
 *    - 获取/更新插件配置
 *    - 验证插件配置
 *    - 保存插件配置
 *
 * 3. 插件依赖管理
 *    - 检查插件依赖
 *    - 解析依赖关系
 *    - 处理依赖冲突
 *
 * 4. 错误处理
 *    - 统一的错误类型
 *    - 详细的错误信息
 *    - 错误日志记录
 *
 * 5. 日志记录
 *    - 操作日志
 *    - 错误日志
 *    - 状态变更日志
 */
export class PluginService {
  /**
   * 已加载的插件映射表
   * key: 插件ID
   * value: 插件实例
   */
  private plugins: Map<string, Plugin> = new Map()

  /**
   * 插件状态映射表
   * key: 插件ID
   * value: 插件状态
   */
  private pluginStates: Map<string, PluginState> = new Map()

  /**
   * 插件加载器
   * 用于加载和卸载插件
   */
  private loader: PluginLoader

  /**
   * 日志记录器
   * 用于记录操作日志和错误日志
   */
  private logger: Logger

  constructor(loader: PluginLoader, logger: Logger) {
    this.loader = loader
    this.logger = logger
  }

  /**
   * 加载插件
   *
   * 流程：
   * 1. 检查插件是否已加载
   * 2. 验证插件清单
   * 3. 检查插件依赖
   * 4. 加载插件
   * 5. 初始化插件
   * 6. 记录操作日志
   *
   * @param plugin 插件实例
   * @param manifest 插件清单
   * @throws PublisherError 当插件加载失败时
   */
  async loadPlugin(plugin: Plugin, manifest: PluginManifest): Promise<void> {
    try {
      if (this.plugins.has(plugin.id)) {
        throw new PublisherError("PLUGIN_NOT_FOUND", `Plugin ${plugin.id} is already loaded`)
      }

      // 检查插件依赖
      await this.checkDependencies(manifest)

      // 加载插件
      const result = await this.loader.loadPlugin(plugin, manifest)
      if (!result.success) {
        throw new PublisherError("PLUGIN_LOAD_FAILED", `Failed to load plugin ${plugin.id}: ${result.error}`)
      }

      // 初始化插件
      await plugin.initialize()

      // 保存插件实例和状态
      this.plugins.set(plugin.id, plugin)
      this.pluginStates.set(plugin.id, {
        status: "loaded",
        dependencies: manifest.dependencies,
      })

      this.logger.info(`Loaded plugin: ${plugin.id}`, {
        module: "PluginService",
        action: "loadPlugin",
        plugin: plugin.id,
      })
    } catch (error: any) {
      this.logger.error(`Failed to load plugin: ${plugin.id}`, error, {
        module: "PluginService",
        action: "loadPlugin",
        plugin: plugin.id,
      })
      throw error
    }
  }

  /**
   * 卸载插件
   *
   * 流程：
   * 1. 检查插件是否存在
   * 2. 销毁插件
   * 3. 卸载插件
   * 4. 移除插件实例和状态
   * 5. 记录操作日志
   *
   * @param pluginId 插件ID
   * @throws PublisherError 当插件不存在或卸载失败时
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    try {
      const plugin = this.plugins.get(pluginId)
      if (!plugin) {
        throw new PublisherError("PLUGIN_NOT_FOUND", `Plugin ${pluginId} is not loaded`)
      }

      // 销毁插件
      await plugin.destroy()

      // 卸载插件
      const result = await this.loader.unloadPlugin(pluginId)
      if (!result.success) {
        throw new PublisherError(
          "PLUGIN_DESTROY_FAILED",
          `Failed to unload plugin ${pluginId}: ${result.error?.message}`,
        )
      }

      // 移除插件实例和状态
      this.plugins.delete(pluginId)
      this.pluginStates.delete(pluginId)

      this.logger.info(`Unloaded plugin: ${pluginId}`, {
        module: "PluginService",
        action: "unloadPlugin",
        plugin: pluginId,
      })
    } catch (error: any) {
      this.logger.error(`Failed to unload plugin: ${pluginId}`, error, {
        module: "PluginService",
        action: "unloadPlugin",
        plugin: pluginId,
      })
      throw error
    }
  }

  /**
   * 获取插件配置
   *
   * @param pluginId 插件ID
   * @throws PublisherError 当插件不存在时
   */
  getPluginConfig(pluginId: string): PluginConfig {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new PublisherError("PLUGIN_NOT_FOUND", `Plugin ${pluginId} is not loaded`)
    }
    const config = plugin.getConfig()
    return {
      enabled: config.enabled ?? false,
      settings: config.settings ?? {},
    }
  }

  /**
   * 更新插件配置
   *
   * 流程：
   * 1. 检查插件是否存在
   * 2. 验证配置
   * 3. 更新配置
   * 4. 记录操作日志
   *
   * @param pluginId 插件ID
   * @param config 插件配置
   * @throws PublisherError 当插件不存在或配置无效时
   */
  async updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): Promise<void> {
    try {
      const plugin = this.plugins.get(pluginId)
      if (!plugin) {
        throw new PublisherError("PLUGIN_NOT_FOUND", `Plugin ${pluginId} is not loaded`)
      }

      // 验证配置
      const currentConfig = plugin.getConfig() as PluginConfig
      const newConfig: PluginConfig = {
        enabled: config.enabled ?? currentConfig.enabled,
        settings: config.settings ?? currentConfig.settings,
      }

      if (!this.validateConfig(newConfig)) {
        throw new PublisherError("PLUGIN_CONFIG_INVALID", `Invalid configuration for plugin ${pluginId}`)
      }

      // 更新配置
      await plugin.updateConfig(newConfig)

      this.logger.info(`Updated plugin config: ${pluginId}`, {
        module: "PluginService",
        action: "updatePluginConfig",
        plugin: pluginId,
      })
    } catch (error: any) {
      this.logger.error(`Failed to update plugin config: ${pluginId}`, error, {
        module: "PluginService",
        action: "updatePluginConfig",
        plugin: pluginId,
      })
      throw error
    }
  }

  /**
   * 获取插件元数据
   *
   * @param pluginId 插件ID
   * @throws PublisherError 当插件不存在时
   */
  getPluginMetadata(pluginId: string): PluginMetadata {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new PublisherError("PLUGIN_NOT_FOUND", `Plugin ${pluginId} is not loaded`)
    }
    return {
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      description: plugin.description,
      author: plugin.author,
      homepage: plugin.homepage,
      license: plugin.license,
      dependencies: plugin.dependencies,
    }
  }

  /**
   * 获取插件状态
   *
   * @param pluginId 插件ID
   */
  getPluginState(pluginId: string): PluginState | undefined {
    return this.pluginStates.get(pluginId)
  }

  /**
   * 获取所有已加载的插件
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * 检查插件依赖
   *
   * 流程：
   * 1. 获取所有依赖
   * 2. 检查每个依赖是否已加载
   * 3. 检查版本兼容性
   *
   * @param manifest 插件清单
   * @throws PublisherError 当依赖不满足时
   */
  private async checkDependencies(manifest: PluginManifest): Promise<void> {
    if (!manifest.dependencies) {
      return
    }

    for (const [depId, depVersion] of Object.entries(manifest.dependencies)) {
      const depPlugin = this.plugins.get(depId)
      if (!depPlugin) {
        throw new PublisherError(
          "PLUGIN_DEPENDENCY_NOT_FOUND",
          `Required dependency ${depId} is not loaded for plugin ${manifest.id}`,
        )
      }

      // TODO: 实现版本兼容性检查
      // if (!this.isVersionCompatible(depPlugin.version, depVersion)) {
      //   throw new PublisherError(
      //     "PLUGIN_DEPENDENCY_VERSION_MISMATCH",
      //     `Dependency ${depId} version ${depVersion} is not compatible with ${depPlugin.version}`
      //   )
      // }
    }
  }

  /**
   * 验证插件配置
   *
   * @param config 插件配置
   */
  private validateConfig(config: PluginConfig): boolean {
    // TODO: 实现配置验证逻辑
    return true
  }
}
