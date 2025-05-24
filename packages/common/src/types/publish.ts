/**
 * 发布状态
 */
export type PublishStatus = "pending" | "publishing" | "published" | "failed"

/**
 * 文章状态类型
 */
export type PostStatus = "draft" | "published" | "publish" | "private"

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
  status?: PostStatus
  publishDate?: Date
  metadata?: Record<string, any>
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
  status?: PostStatus
  /**
   * 自定义选项
   */
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

/**
 * 发布配置
 */
export interface PublishConfig {
  /**
   * 是否自动保存草稿
   */
  autoSaveDraft?: boolean

  /**
   * 是否自动同步标签
   */
  syncTags?: boolean

  /**
   * 是否自动同步分类
   */
  syncCategories?: boolean

  /**
   * 发布前处理函数
   */
  beforePublish?: (post: Post) => Promise<Post>

  /**
   * 发布后处理函数
   */
  afterPublish?: (result: PublishResult) => Promise<void>
}

/**
 * 发布任务
 */
export interface PublishTask {
  id: string
  post: Post
  status: PublishStatus
  result?: PublishResult
  error?: string
  startTime?: Date
  endTime?: Date
}

/**
 * 发布历史
 */
export interface PublishHistory {
  tasks: PublishTask[]
  total: number
  success: number
  failed: number
}
