import { ref, onMounted, onUnmounted } from "vue"
import { PluginSystem } from "@siyuan-publisher/plugin-system"
import { PlatformAdapterManager } from "@siyuan-publisher/plugin-system"
import { DefaultPlatformAdapterRegistry } from "@siyuan-publisher/platform-adapters"
import type { Plugin, PlatformAdapter, PluginManager, PlatformConfig } from "@siyuan-publisher/common"

export function usePluginSystem() {
  const pluginSystem = PluginSystem.getInstance() as PluginManager
  const platformAdapterManager = PlatformAdapterManager.getInstance()
  const platformAdapterRegistry = DefaultPlatformAdapterRegistry.getInstance()
  const plugins = ref<Plugin[]>([])
  const platformAdapters = ref<PlatformAdapter[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 获取插件配置
  const getPluginConfig = (pluginId: string): PlatformConfig | undefined => {
    const plugin = plugins.value.find((p) => p.id === pluginId)
    if (!plugin) {
      return undefined
    }
    return plugin.getConfig() as PlatformConfig
  }

  // 加载所有插件
  const loadPlugins = async () => {
    isLoading.value = true
    error.value = null
    try {
      // 获取所有内置平台适配器
      const builtInAdapters = platformAdapterRegistry.getAllAdapters()
      
      // 注册内置适配器到插件系统
      for (const adapter of builtInAdapters) {
        await pluginSystem.registerPlugin(adapter as any)
      }

      // 更新状态
      plugins.value = pluginSystem.getAllPlugins()
      platformAdapters.value = platformAdapterManager.getAllAdapters()
    } catch (err) {
      error.value = err instanceof Error ? err.message : "加载插件失败"
    } finally {
      isLoading.value = false
    }
  }

  // 动态加载外部插件
  const loadExternalPlugin = async (plugin: Plugin) => {
    try {
      await pluginSystem.registerPlugin(plugin)
      plugins.value = pluginSystem.getAllPlugins()
      if ("connect" in plugin) {
        platformAdapters.value = platformAdapterManager.getAllAdapters()
      }
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "加载外部插件失败"
      return { success: false, error: error.value }
    }
  }

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
