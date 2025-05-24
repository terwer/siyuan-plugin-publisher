import type { Post, PublishOptions, PublishResult, Logger } from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"
import { PlatformService } from "./platform.service"
import { PluginService } from "./plugin.service"

/**
 * 发布服务类
 *
 * 核心功能：
 * 1. 文章发布管理
 *    - 单篇文章发布
 *    - 批量文章发布
 *    - 发布状态查询
 *    - 文章删除
 *
 * 2. 平台适配器管理
 *    - 获取活动平台
 *    - 验证平台连接
 *    - 错误处理
 *
 * 3. 错误处理
 *    - 统一的错误类型
 *    - 详细的错误信息
 *    - 错误日志记录
 *
 * 4. 日志记录
 *    - 操作日志
 *    - 错误日志
 *    - 状态变更日志
 */
export class PublisherService {
  private platformService: PlatformService
  private pluginService: PluginService
  private logger: Logger

  constructor(platformService: PlatformService, pluginService: PluginService, logger: Logger) {
    this.platformService = platformService
    this.pluginService = pluginService
    this.logger = logger
  }

  /**
   * 发布文章
   *
   * 流程：
   * 1. 验证文章数据
   * 2. 获取活动平台
   * 3. 发布文章
   * 4. 记录操作日志
   *
   * @param post 文章数据
   * @param options 发布选项
   * @throws PublisherError 当发布失败时
   */
  async publish(post: Post, options: PublishOptions): Promise<PublishResult> {
    try {
      // 验证文章数据
      if (!post.title || !post.content) {
        throw new PublisherError("INVALID_POST", "Post must have title and content")
      }

      // 获取当前活动的平台适配器
      const activeAdapter = this.platformService.getActiveAdapter()
      if (!activeAdapter) {
        throw new PublisherError("PLATFORM_NOT_CONNECTED", "No active platform adapter")
      }

      // 发布文章
      const result = await this.platformService.publish(post, options)

      this.logger.info(`Published post: ${post.title}`, {
        module: "PublisherService",
        action: "publish",
        platform: activeAdapter.name,
        postId: result.url,
      })

      return result
    } catch (error: any) {
      this.logger.error(`Failed to publish post: ${post.title}`, error, {
        module: "PublisherService",
        action: "publish",
      })
      throw error
    }
  }

  /**
   * 批量发布文章
   *
   * 流程：
   * 1. 遍历文章列表
   * 2. 逐个发布文章
   * 3. 收集发布结果
   * 4. 处理错误情况
   *
   * @param posts 文章列表
   * @param options 发布选项
   * @throws PublisherError 当批量发布失败时
   */
  async publishBatch(posts: Post[], options: PublishOptions): Promise<PublishResult[]> {
    const results: PublishResult[] = []
    const errors: Error[] = []

    for (const post of posts) {
      try {
        const result = await this.publish(post, options)
        results.push(result)
      } catch (error: any) {
        errors.push(error as Error)
        this.logger.error(`Failed to publish post in batch: ${post.title}`, error, {
          module: "PublisherService",
          action: "publishBatch",
        })
      }
    }

    if (errors.length > 0) {
      throw new PublisherError("BATCH_PUBLISH_FAILED", `Failed to publish ${errors.length} posts`, { errors } as any)
    }

    return results
  }

  /**
   * 获取发布状态
   *
   * 流程：
   * 1. 获取活动平台
   * 2. 查询文章状态
   * 3. 返回状态信息
   *
   * @param postId 文章ID
   * @throws PublisherError 当获取状态失败时
   */
  async getPublishStatus(postId: string): Promise<{
    status: "published" | "failed" | "pending"
    url?: string
    error?: string
  }> {
    try {
      const activeAdapter = this.platformService.getActiveAdapter()
      if (!activeAdapter) {
        throw new PublisherError("PLATFORM_NOT_CONNECTED", "No active platform adapter")
      }

      const postStatus = await activeAdapter.getPostStatus(postId)
      
      // 将 PostStatus 转换为 PublishStatus
      let status: "published" | "failed" | "pending"
      switch (postStatus) {
        case "published":
        case "publish":
          status = "published"
          break
        case "draft":
          status = "pending"
          break
        default:
          status = "failed"
      }

      return {
        status,
        url: postStatus === "published" || postStatus === "publish" ? postId : undefined,
      }
    } catch (error: any) {
      this.logger.error(`Failed to get publish status for post: ${postId}`, error, {
        module: "PublisherService",
        action: "getPublishStatus",
      })
      return {
        status: "failed",
        error: error instanceof Error ? error.message : "获取发布状态失败",
      }
    }
  }

  /**
   * 删除已发布的文章
   *
   * 流程：
   * 1. 获取活动平台
   * 2. 删除文章
   * 3. 记录操作日志
   *
   * @param postId 文章ID
   * @throws PublisherError 当删除失败时
   */
  async deletePost(postId: string): Promise<void> {
    try {
      const activeAdapter = this.platformService.getActiveAdapter()
      if (!activeAdapter) {
        throw new PublisherError("PLATFORM_NOT_CONNECTED", "No active platform adapter")
      }

      await activeAdapter.deletePost(postId)

      this.logger.info(`Deleted post: ${postId}`, {
        module: "PublisherService",
        action: "deletePost",
        platform: activeAdapter.name,
      })
    } catch (error: any) {
      this.logger.error(`Failed to delete post: ${postId}`, error, {
        module: "PublisherService",
        action: "deletePost",
      })
      throw error
    }
  }
}
