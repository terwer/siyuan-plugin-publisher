import { ref, onMounted, onUnmounted } from "vue"
import { PluginSystem } from "@siyuan-publisher/plugin-system"
import type { Plugin, PlatformAdapter, PluginLoader } from "@siyuan-publisher/core"
import { WordPressAdapter } from "@siyuan-publisher/platform-adapters"
import { GithubAdapter } from "@siyuan-publisher/platform-adapters"

export function usePluginSystem() {
  const pluginSystem = PluginSystem.getInstance()
  const plugins = ref<Plugin[]>([])
  const platformAdapters = ref<PlatformAdapter[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 注册内置平台适配器
  const registerBuiltinAdapters = async () => {
    const adapters = [new WordPressAdapter(), new GithubAdapter()]
    for (const adapter of adapters) {
      await pluginSystem.registerPlugin(adapter)
    }
  }

  // 注册外部插件加载器
  const registerExternalLoaders = () => {
    // 这里可以注册各种类型的插件加载器
    // 例如：npm包加载器、本地文件加载器等
  }

  // 加载所有插件
  const loadPlugins = async () => {
    isLoading.value = true
    error.value = null
    try {
      // 注册内置适配器
      await registerBuiltinAdapters()
      // 注册外部插件加载器
      registerExternalLoaders()
      // 更新状态
      plugins.value = pluginSystem.getAllPlugins()
      platformAdapters.value = pluginSystem.getAllPlatformAdapters()
    } catch (err) {
      error.value = err instanceof Error ? err.message : "加载插件失败"
    } finally {
      isLoading.value = false
    }
  }

  // 动态加载外部插件
  const loadExternalPlugin = async (type: string, config: any) => {
    try {
      const result = await pluginSystem.loadPlugin(type, config)
      if (result.success && result.plugin) {
        plugins.value = pluginSystem.getAllPlugins()
        if ("connect" in result.plugin) {
          platformAdapters.value = pluginSystem.getAllPlatformAdapters()
        }
      }
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : "加载外部插件失败"
      return { success: false, error: error.value }
    }
  }

  onMounted(loadPlugins)
  onUnmounted(() => pluginSystem.unloadAll())

  return {
    plugins,
    platformAdapters,
    isLoading,
    error,
    loadExternalPlugin,
  }
}
