import type { PlatformAdapter, Post } from "@siyuan-publisher/common"
import type { PlatformConfig, PublishOptions, PublishResult } from "@siyuan-publisher/common"
import type { WordPressConfig, WordPressPublishOptions } from "../types"

export class WordPressAdapter implements PlatformAdapter {
  readonly id = "wordpress"
  readonly name = "WordPress"
  readonly version = "1.0.0"
  readonly type = "wordpress"

  private config: WordPressConfig = { type: "wordpress", config: {} }

  async initialize() {
    // 初始化逻辑
  }

  async destroy() {
    // 清理逻辑
  }

  getConfig(): WordPressConfig {
    return this.config
  }

  async updateConfig(config: WordPressConfig) {
    this.config = config
  }

  async connect(config: WordPressConfig): Promise<void> {
    this.config = config
    // 可扩展：测试连接有效性
  }

  async disconnect(): Promise<void> {
    // WordPress 无需显式断开
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { apiUrl, username, password } = this.config.config
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "连接测试失败" }
    }
  }

  async publish(post: Post, options: WordPressPublishOptions): Promise<PublishResult> {
    try {
      const { apiUrl, username, password } = this.config.config
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          status: options.status || "publish",
          categories: options.categories || [],
          tags: options.tags || [],
          meta: post.metadata || {},
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { success: true, url: data.link }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "发布失败" }
    }
  }
}
