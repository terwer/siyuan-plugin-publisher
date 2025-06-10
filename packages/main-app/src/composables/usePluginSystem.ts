// packages/main-app/src/composables/usePluginSystem.ts

import { ref, onMounted, onUnmounted } from "vue"
import { PluginSystem } from "@siyuan-publisher/plugin-system"
import { PlatformAdapterManager } from "@siyuan-publisher/plugin-system"
import { DefaultPlatformAdapterRegistry } from "@siyuan-publisher/platform-adapters"
import { createAppLogger } from "@/utils/appLogger.ts"
import {
  Plugin,
  PlatformAdapter,
  PluginManager,
  PlatformConfig,
  PluginState,
  PluginLoadResult,
  PluginManifest,
  PluginType,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

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
  const pluginStates = ref<Record<string, PluginState>>({})

  /**
   * 更新插件状态
   * @param pluginId 插件ID
   * @param state 插件状态
   */
  const updatePluginState = (pluginId: string, state: PluginState) => {
    pluginStates.value[pluginId] = state
  }

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
   * 加载插件清单
   * @param path 插件路径
   * @returns 插件清单
   */
  const loadManifest = async (path: string): Promise<PluginManifest> => {
    try {
      const response = await fetch(`${path}/manifest.json`)
      if (!response.ok) {
        throw new Error(`Failed to load plugin manifest: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      logger.error("加载插件清单失败", { error, path })
      throw new PublisherError("PLUGIN_MANIFEST_LOAD_FAILED", "加载插件清单失败")
    }
  }

  /**
   * 检查插件依赖
   * @param manifest 插件清单
   * @returns 依赖是否满足
   */
  const checkDependencies = (manifest: PluginManifest): boolean => {
    const { dependencies } = manifest
    if (!dependencies) return true

    try {
      return Object.entries(dependencies).every(([name, version]) => {
        // TODO: 实现版本检查逻辑
        return true
      })
    } catch (error) {
      logger.error("检查插件依赖失败", { error, manifest })
      return false
    }
  }

  /**
   * 扫描插件目录
   * @param pluginDir 插件目录
   * @returns 插件路径列表
   */
  const scanPluginDirectory = async (pluginDir: string): Promise<string[]> => {
    try {
      // TODO: 实现目录扫描逻辑
      return []
    } catch (error) {
      logger.error("扫描插件目录失败", { error, pluginDir })
      return []
    }
  }

  /**
   * 加载外部插件
   * @param path 插件路径
   * @returns 加载结果
   */
  const loadExternalPlugin = async (path: string): Promise<PluginLoadResult> => {
    try {
      // 1. 加载插件清单
      const manifest = await loadManifest(path)

      // 2. 验证插件类型
      if (!manifest.type) {
        return {
          success: false,
          error: "插件清单缺少 type 字段",
        }
      }
      // const type = manifest.type.toLowerCase()
      // if (!type.includes("adapter") && !type.includes("plugin")) {
      //   return {
      //     success: false,
      //     error: `插件类型 ${manifest.type} 无效，type 字段必须包含 adapter 或 plugin 关键字。例如：githubAdapter、wordpressAdapter、markdownPlugin、imagePlugin 等`,
      //   }
      // }

      // 3. 检查依赖
      if (!checkDependencies(manifest)) {
        return {
          success: false,
          error: "插件依赖不满足",
        }
      }

      // 4. 加载插件代码
      const plugin = await import(manifest.main)

      // 5. 注册到插件系统
      await pluginSystem.registerPlugin(plugin)

      // 6. 更新状态
      plugins.value = pluginSystem.getAllPlugins()
      if (manifest.type != "plugin") {
        platformAdapters.value = platformAdapterManager.getAllAdapters()
      }

      // 7. 更新插件状态
      updatePluginState(plugin.id, {
        status: "loaded",
        dependencies: manifest.dependencies,
      })

      return { success: true, plugin }
    } catch (err) {
      const errorResult = handlePluginError(err, path)
      logger.error("加载外部插件失败", { error: err })
      return errorResult
    }
  }

  /**
   * 处理插件错误
   * @param error 错误对象
   * @param pluginId 插件ID
   * @returns 错误结果
   */
  const handlePluginError = (error: unknown, pluginId: string) => {
    if (error instanceof PublisherError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      }
    }
    return {
      success: false,
      error: "未知错误",
    }
  }

  /**
   * 加载所有插件
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
          await pluginSystem.registerPlugin(adapter as any)
          updatePluginState(adapter.id, { status: "loaded" })
        } catch (err) {
          logger.error(`注册适配器 ${adapter.id} 失败`, { error: err })
          throw err
        }
      }

      // 扫描并加载外部插件
      const pluginDir = "plugins" // TODO: 从配置中获取
      logger.info(`准备从 ${pluginDir} 加载外部插件...`)
      const pluginPaths = await scanPluginDirectory(pluginDir)
      logger.info("扫描到的外部插件路径", { pluginPaths })
      // 检测是否有插件
      if (pluginPaths.length === 0) {
        logger.info("没有找到插件目录，跳过加载外部插件")
        return
      }
      for (const path of pluginPaths) {
        try {
          await loadExternalPlugin(path)
        } catch (err) {
          logger.error(`加载外部插件失败: ${path}`, { error: err })
        }
      }

      // 更新状态
      plugins.value = pluginSystem.getAllPlugins()
      platformAdapters.value = platformAdapterManager.getAllAdapters()
      logger.info("已加载的插件", { plugins: plugins.value })
      logger.info("已加载的平台适配器", { adapters: platformAdapters.value })
    } catch (err) {
      logger.error("加载插件失败", { error: err })
      error.value = err instanceof Error ? err.message : "加载插件失败"
    } finally {
      isLoading.value = false
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
    pluginStates,
    loadExternalPlugin,
    getPluginConfig,
    getPluginState: (pluginId: string) => pluginStates.value[pluginId],
    loadPlugins,
  }
}
