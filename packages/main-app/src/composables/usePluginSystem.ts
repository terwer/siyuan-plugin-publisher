import { ref, onMounted, onUnmounted } from "vue"
import { PluginSystem } from "@siyuan-publisher/plugin-system"
import { PlatformAdapterManager } from "@siyuan-publisher/plugin-system"
import { DefaultPlatformAdapterRegistry } from "@siyuan-publisher/platform-adapters"
import { createAppLogger } from "@/utils/appLogger.ts"
import type { Plugin, PlatformAdapter, PluginManager, PlatformConfig } from "@siyuan-publisher/common"

/**
 * 插件系统组合式函数
 *
 * 职责：
 * 1. 管理插件生命周期（加载、卸载、状态管理）
 * 2. 管理平台适配器（注册、连接、配置）
 * 3. 提供插件和适配器的访问接口
 *
 * 初始化顺序：
 * 1. DefaultPlatformAdapterRegistry - 内置适配器注册表
 * 2. PlatformAdapterManager - 平台适配器管理器
 * 3. PluginSystem - 插件系统核心
 */
export const usePluginSystem = () => {
  // 核心管理器实例
  const platformAdapterRegistry = DefaultPlatformAdapterRegistry.getInstance()
  const platformAdapterManager = PlatformAdapterManager.getInstance()
  const pluginSystem = PluginSystem.getInstance() as PluginManager
  const logger = createAppLogger("use-plugin-system")

  // 响应式状态
  const plugins = ref<Plugin[]>([])
  const platformAdapters = ref<PlatformAdapter[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取插件配置
   * @param pluginId 插件ID
   * @returns 插件配置或undefined
   */
  const getPluginConfig = (pluginId: string): PlatformConfig | undefined => {
    const plugin = plugins.value.find((p) => p.id === pluginId)
    if (!plugin) {
      return undefined
    }
    return plugin.getConfig() as PlatformConfig
  }

  /**
   * 加载所有插件
   *
   * 流程：
   * 1. 获取内置适配器
   * 2. 注册到插件系统
   * 3. 初始化适配器
   * 4. 注册到平台适配器管理器
   * 5. 更新状态
   */
  const loadPlugins = async () => {
    isLoading.value = true
    error.value = null
    try {
      // 获取所有内置平台适配器
      const builtInAdapters = platformAdapterRegistry.getAllAdapters()
      logger.info("内置平台适配器", { adapters: builtInAdapters })

      // 注册内置适配器到插件系统
      for (const adapter of builtInAdapters) {
        try {
          // 先注册到插件系统
          await pluginSystem.registerPlugin(adapter as any)
          // 初始化适配器
          if (typeof adapter.initialize === "function") {
            await adapter.initialize()
          }
          // 注册到平台适配器管理器
          if (typeof platformAdapterManager.registerAdapter === "function") {
            platformAdapterManager.registerAdapter(adapter)
          } else {
            logger.error("platformAdapterManager.registerAdapter 不是一个函数")
            throw new Error("platformAdapterManager.registerAdapter 不是一个函数")
          }
        } catch (err) {
          logger.error(`注册适配器 ${adapter.id} 失败`, { error: err })
          throw err
        }
      }

      // 更新状态
      plugins.value = pluginSystem.getAllPlugins()
      platformAdapters.value = platformAdapterManager.getAllAdapters()
      logger.info("已加载的平台适配器", { adapters: platformAdapters.value })
    } catch (err) {
      logger.error("加载插件失败", { error: err })
      error.value = err instanceof Error ? err.message : "加载插件失败"
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 动态加载外部插件
   *
   * 流程：
   * 1. 注册到插件系统
   * 2. 如果是平台适配器，注册到平台适配器管理器
   * 3. 更新状态
   *
   * @param plugin 插件实例
   * @returns 加载结果
   */
  const loadExternalPlugin = async (plugin: Plugin) => {
    try {
      await pluginSystem.registerPlugin(plugin)
      plugins.value = pluginSystem.getAllPlugins()
      if ("connect" in plugin) {
        if (typeof platformAdapterManager.registerAdapter === "function") {
          platformAdapterManager.registerAdapter(plugin as PlatformAdapter)
          platformAdapters.value = platformAdapterManager.getAllAdapters()
        } else {
          logger.error("platformAdapterManager.registerAdapter 不是一个函数")
          throw new Error("platformAdapterManager.registerAdapter 不是一个函数")
        }
      }
      return { success: true }
    } catch (err) {
      logger.error("加载外部插件失败", { error: err })
      error.value = err instanceof Error ? err.message : "加载外部插件失败"
      return { success: false, error: error.value }
    }
  }

  // 生命周期钩子
  onMounted(loadPlugins)
  onUnmounted(() => {
    pluginSystem.unloadAll()
    platformAdapterManager.unloadAll()
  })

  return {
    plugins,
    platformAdapters,
    isLoading,
    error,
    loadExternalPlugin,
    getPluginConfig,
    loadPlugins,
  }
}
