import type {
  Logger,
  PlatformAdapter,
  PlatformCapabilities,
  PlatformConfig,
  PlatformMetadata,
  Post,
  PublishOptions,
  PublishResult,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

/**
 * 平台服务类
 *
 * 核心功能：
 * 1. 平台适配器管理
 *    - 注册/注销平台适配器
 *    - 管理活动适配器
 *    - 获取适配器列表和元数据
 *
 * 2. 平台连接管理
 *    - 连接/断开平台
 *    - 验证平台配置
 *    - 检查连接状态
 *
 * 3. 文章发布管理
 *    - 发布单篇文章
 *    - 获取已发布文章
 *    - 删除已发布文章
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
export class PlatformService {
  /**
   * 已注册的平台适配器映射表
   * key: 平台名称
   * value: 平台适配器实例
   */
  private adapters: Map<string, PlatformAdapter> = new Map()

  /**
   * 当前活动的平台适配器
   * 用于执行发布等操作
   */
  private activeAdapter?: PlatformAdapter

  /**
   * 日志记录器
   * 用于记录操作日志和错误日志
   */
  private logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  /**
   * 注册平台适配器
   *
   * 流程：
   * 1. 检查适配器是否已注册
   * 2. 验证适配器配置
   * 3. 保存适配器实例
   * 4. 记录操作日志
   *
   * @param adapter 平台适配器实例
   * @throws PublisherError 当适配器已注册或配置无效时
   */
  async registerAdapter(adapter: PlatformAdapter): Promise<void> {
    try {
      if (this.adapters.has(adapter.name)) {
        this.logger.info(`Platform adapter ${adapter.name} is already registered, ignoring...`, {
          module: "PlatformService",
          action: "registerAdapter",
          platform: adapter.name,
        })
        return
      }

      // 验证适配器配置
      const isValid = await adapter.validateConfig(adapter.config)
      if (!isValid) {
        throw new PublisherError("INVALID_CONFIG", `Invalid configuration for platform adapter ${adapter.name}`)
      }

      this.adapters.set(adapter.name, adapter)
      this.logger.info(`Registered platform adapter: ${adapter.name}`, {
        module: "PlatformService",
        action: "registerAdapter",
        platform: adapter.name,
      })
    } catch (error: any) {
      this.logger.error(`Failed to register platform adapter: ${adapter.name}`, error, {
        module: "PlatformService",
        action: "registerAdapter",
        platform: adapter.name,
      })
      throw error
    }
  }

  /**
   * 批量注册平台适配器
   *
   * @param adapters 平台适配器实例数组
   */
  async registerAdapters(adapters: PlatformAdapter[]): Promise<void> {
    for (const adapter of adapters) {
      await this.registerAdapter(adapter)
    }
  }

  /**
   * 注销平台适配器
   *
   * 流程：
   * 1. 检查适配器是否存在
   * 2. 如果是活动适配器，先断开连接
   * 3. 从映射表中移除
   * 4. 记录操作日志
   *
   * @param name 平台名称
   * @throws PublisherError 当适配器不存在时
   */
  async unregisterAdapter(name: string): Promise<void> {
    try {
      const adapter = this.adapters.get(name)
      if (!adapter) {
        throw new PublisherError("PLATFORM_NOT_FOUND", `Platform adapter ${name} is not registered`)
      }

      if (this.activeAdapter === adapter) {
        await this.disconnect()
      }

      this.adapters.delete(name)
      this.logger.info(`Unregistered platform adapter: ${name}`, {
        module: "PlatformService",
        action: "unregisterAdapter",
        platform: name,
      })
    } catch (error: any) {
      this.logger.error(`Failed to unregister platform adapter: ${name}`, error, {
        module: "PlatformService",
        action: "unregisterAdapter",
        platform: name,
      })
      throw error
    }
  }

  /**
   * 连接平台
   *
   * 流程：
   * 1. 检查适配器是否存在
   * 2. 如果有活动适配器，先断开连接
   * 3. 验证配置
   * 4. 连接平台
   * 5. 设置为活动适配器
   * 6. 记录操作日志
   *
   * @param name 平台名称
   * @param config 平台配置（可选）
   * @throws PublisherError 当适配器不存在或配置无效时
   */
  async connect(name: string, config?: PlatformConfig): Promise<void> {
    try {
      const adapter = this.adapters.get(name)
      if (!adapter) {
        throw new PublisherError("PLATFORM_NOT_FOUND", `Platform adapter ${name} is not registered`)
      }

      if (this.activeAdapter) {
        await this.disconnect()
      }

      // 如果提供了新的配置，更新适配器配置
      if (config) {
        await adapter.updateConfig(config)
      }

      // 验证配置
      const isValid = await adapter.validateConfig(adapter.config)
      if (!isValid) {
        throw new PublisherError("INVALID_CONFIG", `Invalid configuration for platform ${name}`)
      }

      await adapter.connect()
      this.activeAdapter = adapter

      this.logger.info(`Connected to platform: ${name}`, {
        module: "PlatformService",
        action: "connect",
        platform: name,
      })
    } catch (error: any) {
      this.logger.error(`Failed to connect to platform: ${name}`, error, {
        module: "PlatformService",
        action: "connect",
        platform: name,
      })
      throw new PublisherError("PLATFORM_CONNECT_FAILED", `Failed to connect to platform ${name}`, {
        originalError: error,
      })
    }
  }

  /**
   * 断开平台连接
   *
   * 流程：
   * 1. 检查是否有活动适配器
   * 2. 断开连接
   * 3. 清除活动适配器
   * 4. 记录操作日志
   */
  async disconnect(): Promise<void> {
    if (this.activeAdapter) {
      try {
        await this.activeAdapter.disconnect()
        const name = this.activeAdapter.name
        this.activeAdapter = undefined

        this.logger.info(`Disconnected from platform: ${name}`, {
          module: "PlatformService",
          action: "disconnect",
          platform: name,
        })
      } catch (error: any) {
        this.logger.error(`Failed to disconnect from platform: ${this.activeAdapter!.name}`, error, {
          module: "PlatformService",
          action: "disconnect",
          platform: this.activeAdapter!.name,
        })
        throw new PublisherError(
          "PLATFORM_DISCONNECT_FAILED",
          `Failed to disconnect from platform ${this.activeAdapter!.name}`,
          { originalError: error },
        )
      }
    }
  }

  /**
   * 发布文章
   *
   * 流程：
   * 1. 检查是否有活动适配器
   * 2. 发布文章
   * 3. 记录操作日志
   *
   * @param post 文章数据
   * @param options 发布选项
   * @throws PublisherError 当没有活动适配器或发布失败时
   */
  async publish(post: Post, options: PublishOptions): Promise<PublishResult> {
    if (!this.activeAdapter) {
      throw new PublisherError("PLATFORM_NOT_CONNECTED", "No active platform adapter")
    }

    try {
      const result = await this.activeAdapter.publish(post, options)

      this.logger.info(`Published post to platform: ${this.activeAdapter.name}`, {
        module: "PlatformService",
        action: "publish",
        platform: this.activeAdapter.name,
        postId: result.url,
      })

      return result
    } catch (error: any) {
      this.logger.error(`Failed to publish to platform: ${this.activeAdapter.name}`, error, {
        module: "PlatformService",
        action: "publish",
        platform: this.activeAdapter.name,
      })
      throw new PublisherError("PUBLISH_FAILED", `Failed to publish to platform ${this.activeAdapter.name}`, {
        originalError: error,
      })
    }
  }

  /**
   * 获取当前活动的适配器
   */
  getActiveAdapter(): PlatformAdapter | undefined {
    return this.activeAdapter
  }

  /**
   * 获取所有已注册的适配器
   */
  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.adapters.values())
  }

  /**
   * 获取平台元数据
   *
   * 流程：
   * 1. 检查适配器是否存在
   * 2. 获取并返回元数据
   *
   * @param name 平台名称
   */
  async getPlatformMetadata(name: string): Promise<PlatformMetadata | undefined> {
    const adapter = this.adapters.get(name)
    if (!adapter) {
      return undefined
    }

    const metadata = adapter.getMetadata()
    return {
      id: metadata.id,
      type: metadata.type,
      name: metadata.name,
      version: metadata.version,
      description: metadata.description,
      supportedFeatures: metadata.supportedFeatures,
      requiredConfig: metadata.requiredConfig,
      author: metadata.author,
      homepage: metadata.homepage,
      license: metadata.license,
      dependencies: metadata.dependencies,
    }
  }

  /**
   * 获取平台能力
   */
  async getPlatformCapabilities(name: string): Promise<PlatformCapabilities | undefined> {
    const adapter = this.adapters.get(name)
    if (!adapter) {
      return undefined
    }

    return adapter.getCapabilities()
  }

  /**
   * 检查平台连接状态
   *
   * 流程：
   * 1. 检查适配器是否存在
   * 2. 获取平台状态
   * 3. 返回连接状态
   *
   * @param name 平台名称
   */
  async checkConnection(name: string): Promise<boolean> {
    const adapter = this.adapters.get(name)
    if (!adapter) {
      return false
    }

    try {
      const status = await adapter.getStatus()
      return status.isConnected
    } catch (error: any) {
      this.logger.error(`Failed to check connection status for platform: ${name}`, error, {
        module: "PlatformService",
        action: "checkConnection",
        platform: name,
      })
      return false
    }
  }
}
