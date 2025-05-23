import { ref, onMounted, onUnmounted } from "vue"
import { PluginSystem } from "@siyuan-publisher/plugin-system"
import type { Plugin, PlatformConfig } from "@siyuan-publisher/core"

export function usePluginSystem() {
  const pluginSystem = PluginSystem.getInstance()
  const plugins = ref<Plugin[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pluginStates = ref<Map<string, { status: string; error?: Error }>>(new Map())

  // 加载所有可用的平台适配器插件
  const loadPlugins = async () => {
    isLoading.value = true
    error.value = null
    try {
      const loadedPlugins = pluginSystem.getAllPlugins()
      plugins.value = loadedPlugins

      // 更新插件状态
      loadedPlugins.forEach((plugin) => {
        const state = pluginSystem.getPluginState(plugin.id)
        if (state) {
          pluginStates.value.set(plugin.id, {
            status: state.status,
            error: state.error,
          })
        }
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : "加载插件失败"
      console.error("Failed to load plugins:", err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载特定插件
  const loadPlugin = async (pluginId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const plugin = pluginSystem.getPlugin(pluginId)
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`)
      }

      const result = await pluginSystem.loadPlugin(plugin)
      if (result.success && result.plugin) {
        plugins.value = [...plugins.value, result.plugin]
        pluginStates.value.set(pluginId, {
          status: "loaded",
        })
        return result.plugin
      } else {
        throw new Error(result.error || `Failed to load plugin ${pluginId}`)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `加载插件 ${pluginId} 失败`
      console.error(`Failed to load plugin ${pluginId}:`, err)
      pluginStates.value.set(pluginId, {
        status: "error",
        error: err instanceof Error ? err : new Error("Unknown error"),
      })
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 获取插件配置
  const getPluginConfig = (pluginId: string): PlatformConfig | null => {
    const plugin = plugins.value.find((p) => p.id === pluginId)
    if (!plugin) {
      return null
    }
    const config = plugin.getConfig()
    // 确保返回的配置符合 PlatformConfig 类型
    if (config && typeof config === "object" && "type" in config && "config" in config) {
      return config as PlatformConfig
    }
    // 如果配置不符合要求，返回一个默认的配置结构
    return {
      type: plugin.id,
      config: config || {},
    }
  }

  // 更新插件配置
  const updatePluginConfig = async (pluginId: string, config: PlatformConfig) => {
    const plugin = plugins.value.find((p) => p.id === pluginId)
    if (plugin) {
      try {
        await plugin.updateConfig(config)
        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : `更新插件 ${pluginId} 配置失败`
        console.error(`Failed to update plugin ${pluginId} config:`, err)
        return false
      }
    }
    return false
  }

  // 卸载插件
  const unloadPlugin = async (pluginId: string) => {
    try {
      await pluginSystem.unloadPlugin(pluginId)
      plugins.value = plugins.value.filter((p) => p.id !== pluginId)
      pluginStates.value.delete(pluginId)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : `卸载插件 ${pluginId} 失败`
      console.error(`Failed to unload plugin ${pluginId}:`, err)
      return false
    }
  }

  // 获取插件状态
  const getPluginState = (pluginId: string) => {
    return pluginStates.value.get(pluginId)
  }

  // 初始化插件系统
  onMounted(async () => {
    await loadPlugins()
  })

  // 清理插件系统
  onUnmounted(async () => {
    await pluginSystem.unloadAll()
  })

  return {
    plugins,
    isLoading,
    error,
    pluginStates,
    loadPlugin,
    unloadPlugin,
    getPluginConfig,
    updatePluginConfig,
    getPluginState,
  }
}
