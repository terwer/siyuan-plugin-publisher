import type { BaseConfig, BaseMetadata, Configurable, Lifecycle } from "./base"
import type { Post, PostStatus, PublishOptions, PublishResult } from "./publish"

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
  supportedPostStatus: PostStatus[]
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
 * 平台错误类型
 */
export type PlatformErrorType =
  | "CONNECTION_FAILED"
  | "AUTHENTICATION_FAILED"
  | "INVALID_CONFIG"
  | "PUBLISH_FAILED"
  | "DELETE_FAILED"
  | "STATUS_CHECK_FAILED"
  | "UNKNOWN_ERROR"

/**
 * 平台错误
 */
export interface PlatformError {
  type: PlatformErrorType
  message: string
  details?: any
  originalError?: Error
}

/**
 * 平台事件类型
 */
export type PlatformEventType =
  | "connected"
  | "disconnected"
  | "publish_started"
  | "publish_completed"
  | "publish_failed"
  | "delete_started"
  | "delete_completed"
  | "delete_failed"
  | "status_changed"

/**
 * 平台事件
 */
export interface PlatformEvent {
  type: PlatformEventType
  platform: string
  data?: any
  timestamp: Date
}

/**
 * 平台适配器接口
 */
export interface PlatformAdapter extends BaseMetadata, Lifecycle, Configurable {
  /**
   * 平台类型
   */
  type: string
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
  updateConfig(config: Partial<PlatformConfig>): Promise<void>

  /**
   * 验证配置
   */
  validateConfig(config: PlatformConfig): Promise<boolean>

  /**
   * 连接平台
   */
  connect(): Promise<void>

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
   * 更新文章
   */
  update(post: Post, options?: PublishOptions): Promise<PublishResult>

  /**
   * 删除文章
   */
  delete(postId: string): Promise<boolean>

  /**
   * 获取文章
   */
  getPost(postId: string): Promise<Post | null>

  /**
   * 获取文章列表
   */
  getPosts(options?: { page?: number; pageSize?: number }): Promise<Post[]>
}

/**
 * 平台适配器工厂
 */
export interface PlatformAdapterFactory {
  create(config: PlatformConfig): Promise<PlatformAdapter>
  validateConfig(config: PlatformConfig): Promise<boolean>
  getMetadata(): PlatformMetadata
}

/**
 * 平台适配器注册表接口
 */
export interface PlatformAdapterRegistry {
  /**
   * 注册适配器
   */
  register(adapter: PlatformAdapter): void
  /**
   * 注销适配器
   */
  unregister(type: string): void
  /**
   * 获取适配器
   */
  getAdapter(type: string): PlatformAdapter | undefined
  /**
   * 获取所有适配器
   */
  getAllAdapters(): PlatformAdapter[]
}

/**
 * GitHub 平台配置
 */
export interface GithubConfig extends PlatformConfig {
  /**
   * GitHub 访问令牌
   */
  token: string
  /**
   * 仓库所有者
   */
  owner: string
  /**
   * 仓库名称
   */
  repo: string
  /**
   * 分支名称
   */
  branch?: string
  /**
   * 文件路径
   */
  path?: string
}

/**
 * GitHub 发布选项
 */
export interface GithubPublishOptions extends PublishOptions {
  /**
   * 提交信息
   */
  commitMessage?: string
  /**
   * 分支名称
   */
  branch?: string
  /**
   * 文件路径
   */
  path?: string
}

/**
 * GitHub 发布结果
 */
export interface GithubPublishResult extends PublishResult {
  /**
   * 提交 SHA
   */
  commitSha?: string
  /**
   * HTML URL
   */
  htmlUrl?: string
  /**
   * 原始文件 URL
   */
  rawUrl?: string
}

/**
 * WordPress 平台配置
 */
export interface WordPressConfig extends PlatformConfig {
  /**
   * API URL
   */
  apiUrl: string
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string
}

/**
 * WordPress 发布选项
 */
export interface WordPressPublishOptions extends PublishOptions {
  /**
   * 分类 ID 列表
   */
  categories?: number[]
  /**
   * 标签 ID 列表
   */
  tags?: number[]
}
