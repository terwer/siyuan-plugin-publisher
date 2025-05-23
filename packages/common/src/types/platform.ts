import type { BaseConfig, BaseMetadata } from "./base"

/**
 * 平台类型
 */
export type PlatformType = "wordpress" | "github" | "custom"

/**
 * 平台配置
 */
export interface PlatformConfig extends BaseConfig {
  type: PlatformType
  url?: string
  token?: string
  username?: string
  password?: string
  [key: string]: any
}

/**
 * 平台元数据
 */
export interface PlatformMetadata extends BaseMetadata {
  /**
   * 平台类型
   */
  type: PlatformType
  /**
   * 平台名称
   */
  name: string
  /**
   * 平台版本
   */
  version: string
  /**
   * 平台描述
   */
  description?: string
  /**
   * 支持的功能列表
   */
  supportedFeatures?: string[]
  /**
   * 必需的配置项
   */
  requiredConfig?: string[]
  /**
   * 平台图标
   */
  icon?: string
  /**
   * 平台网站
   */
  website?: string
  /**
   * 平台文档
   */
  documentation?: string
  /**
   * 平台作者
   */
  author?: string
  /**
   * 平台许可证
   */
  license?: string
  /**
   * 平台标签
   */
  tags?: string[]
  /**
   * 自定义属性
   */
  [key: string]: any
}

/**
 * 平台能力
 */
export interface PlatformCapabilities {
  /**
   * 支持的功能列表
   */
  features: string[]
  /**
   * 支持的文章状态
   */
  supportedPostStatus: string[]
  /**
   * 支持的文章类型
   */
  supportedPostTypes: string[]
  /**
   * 是否支持批量发布
   */
  supportsBatchPublish: boolean
  /**
   * 是否支持文章删除
   */
  supportsPostDeletion: boolean
  /**
   * 是否支持文章更新
   */
  supportsPostUpdate: boolean
  /**
   * 是否支持文章状态查询
   */
  supportsPostStatus: boolean
}

/**
 * 发布选项
 */
export interface PublishOptions {
  /**
   * 是否发布为草稿
   */
  draft?: boolean
  /**
   * 发布时间
   */
  publishDate?: Date
  /**
   * 文章状态
   */
  status?: "draft" | "published"
  /**
   * 自定义选项
   */
  [key: string]: any
}

/**
 * 平台状态
 */
export interface PlatformStatus {
  /**
   * 是否已连接
   */
  isConnected: boolean
  /**
   * 连接时间
   */
  connectedAt?: Date
  /**
   * 错误信息
   */
  error?: string
}

/**
 * 平台适配器接口
 */
export interface PlatformAdapter {
  /**
   * 平台名称
   */
  name: string
  /**
   * 平台版本
   */
  version: string
  /**
   * 平台元数据
   */
  metadata?: PlatformMetadata
  /**
   * 平台配置
   */
  config: PlatformConfig

  /**
   * 获取平台元数据
   */
  getMetadata(): PlatformMetadata

  /**
   * 获取平台配置
   */
  getConfig(): PlatformConfig

  /**
   * 更新平台配置
   */
  updateConfig(config: Partial<PlatformConfig>): void

  /**
   * 验证配置
   */
  validateConfig(config: PlatformConfig): Promise<boolean>

  /**
   * 连接平台
   */
  connect(config: PlatformConfig): Promise<void>

  /**
   * 断开连接
   */
  disconnect(): Promise<void>

  /**
   * 获取平台状态
   */
  getStatus(): Promise<PlatformStatus>

  /**
   * 获取平台能力
   */
  getCapabilities(): Promise<PlatformCapabilities>

  /**
   * 发布文章
   */
  publish(post: Post, options?: PublishOptions): Promise<PublishResult>

  /**
   * 获取已发布的文章
   */
  getPublishedPosts(): Promise<Post[]>

  /**
   * 删除已发布的文章
   */
  deletePost(postId: string): Promise<void>

  /**
   * 获取文章状态
   */
  getPostStatus(postId: string): Promise<{
    status: "published" | "failed" | "pending"
    url?: string
    error?: string
  }>
}

/**
 * 文章接口
 */
export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  tags?: string[]
  categories?: string[]
  status?: "draft" | "published"
  publishDate?: Date
  [key: string]: any
}

/**
 * 发布结果
 */
export interface PublishResult {
  success: boolean
  postId?: string
  url?: string
  error?: string
}
