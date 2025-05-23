import { ref } from "vue"
import { usePluginSystem } from "./usePluginSystem"
import type { Post, PublishResult, PublishOptions, PlatformConfig, PlatformAdapter } from "@siyuan-publisher/common"

interface PublisherService {
  publish: (options: PublishOptions) => Promise<PublishResult>
  testConnection: (platformId: string, config: PlatformConfig) => Promise<{ success: boolean; error?: string }>
}

export function usePublisher() {
  const { plugins, getPluginConfig } = usePluginSystem()
  const isPublishing = ref(false)
  const error = ref<string | null>(null)

  // 发布文章
  const publish = async (options: PublishOptions): Promise<PublishResult> => {
    isPublishing.value = true
    error.value = null

    try {
      const platform = plugins.value.find((p) => p.id === options.platform.type)
      if (!platform) {
        throw new Error(`平台 ${options.platform.type} 未找到`)
      }

      // 获取平台配置
      const config = getPluginConfig(options.platform.type)
      if (!config) {
        throw new Error(`平台 ${options.platform.type} 配置未找到`)
      }

      // 更新平台配置
      await platform.updateConfig({
        type: options.platform.type,
        config: options.platform.config,
      })

      // 确保平台实现了 PlatformAdapter 接口
      if (!isPlatformAdapter(platform)) {
        throw new Error(`平台 ${options.platform.type} 不支持发布功能`)
      }

      // 发布文章
      const result = await platform.publish(options.post, options)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "发布失败"
      error.value = errorMessage
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      isPublishing.value = false
    }
  }

  // 测试平台连接
  const testConnection = async (
    platformId: string,
    config: PlatformConfig,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const platform = plugins.value.find((p) => p.id === platformId)
      if (!platform) {
        throw new Error(`平台 ${platformId} 未找到`)
      }

      // 确保平台实现了 PlatformAdapter 接口
      if (!isPlatformAdapter(platform)) {
        throw new Error(`平台 ${platformId} 不支持连接测试`)
      }

      // 更新平台配置
      await platform.updateConfig(config)

      // 测试连接
      await platform.connect(config)
      await platform.disconnect()

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "连接测试失败",
      }
    }
  }

  // 类型守卫：检查插件是否实现了 PlatformAdapter 接口
  const isPlatformAdapter = (plugin: any): plugin is PlatformAdapter => {
    return (
      typeof plugin === "object" &&
      plugin !== null &&
      typeof plugin.connect === "function" &&
      typeof plugin.disconnect === "function" &&
      typeof plugin.publish === "function"
    )
  }

  const publisherService: PublisherService = {
    publish,
    testConnection,
  }

  return {
    publish: publisherService,
    isPublishing,
    error,
  }
}
