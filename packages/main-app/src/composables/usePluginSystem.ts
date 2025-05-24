import { ref, onMounted, onUnmounted } from "vue"
import { PluginSystem } from "@siyuan-publisher/plugin-system"
import type { Plugin, PlatformAdapter, PluginManager } from "@siyuan-publisher/common"
import { WordPressAdapter } from "@siyuan-publisher/platform-adapters"
import { GithubAdapter } from "@siyuan-publisher/platform-adapters"

export function usePluginSystem() {
  const pluginSystem = PluginSystem.getInstance() as PluginManager
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

  // 加载所有插件
  const loadPlugins = async () => {
    isLoading.value = true
    error.value = null
    try {
      // 注册内置适配器
      await registerBuiltinAdapters()
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
  const loadExternalPlugin = async (plugin: Plugin) => {
    try {
      await pluginSystem.registerPlugin(plugin)
      plugins.value = pluginSystem.getAllPlugins()
      if ("connect" in plugin) {
        platformAdapters.value = pluginSystem.getAllPlatformAdapters()
      }
      return { success: true }
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
