import type { Post, PublishResult } from "./platform"

/**
 * 发布状态
 */
export type PublishStatus = "pending" | "publishing" | "published" | "failed"

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
