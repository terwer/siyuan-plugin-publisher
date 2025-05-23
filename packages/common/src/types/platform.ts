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
  type: PlatformType
  supportedFeatures?: string[]
  requiredConfig?: string[]
}

/**
 * 平台适配器接口
 */
export interface PlatformAdapter {
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
   * 发布文章
   */
  publish(post: Post): Promise<PublishResult>

  /**
   * 获取已发布的文章
   */
  getPublishedPosts(): Promise<Post[]>

  /**
   * 删除已发布的文章
   */
  deletePost(postId: string): Promise<void>
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
