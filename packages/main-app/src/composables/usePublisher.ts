import { ref } from "vue"
import type { Post, PublishResult, PublishOptions, PlatformConfig, PlatformAdapter } from "@siyuan-publisher/common"

/**
 * 发布功能的核心组合式函数
 *
 * 职责：
 * 1. 处理文章发布流程
 * 2. 管理发布状态
 * 3. 处理平台连接测试
 * 4. 错误处理
 */
export function usePublisher() {
  const isPublishing = ref(false)
  const error = ref<string | null>(null)

  /**
   * 发布文章
   * @param platform 平台适配器
   * @param post 文章内容
   * @param options 发布选项
   */
  const publish = async (platform: PlatformAdapter, post: Post, options: PublishOptions): Promise<PublishResult> => {
    isPublishing.value = true
    error.value = null

    try {
      // 确保平台已连接
      if (!platform.isConnected) {
        await platform.connect()
      }

      // 发布文章
      const result = await platform.publish(post, options)
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

  /**
   * 测试平台连接
   * @param platform 平台适配器
   * @param config 平台配置
   */
  const testConnection = async (
    platform: PlatformAdapter,
    config: PlatformConfig,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // 更新平台配置
      await platform.updateConfig(config)

      // 测试连接
      await platform.connect()
      await platform.disconnect()

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "连接测试失败",
      }
    }
  }

  return {
    publish,
    testConnection,
    isPublishing,
    error,
  }
}
