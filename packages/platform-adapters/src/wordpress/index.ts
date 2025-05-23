import type { PlatformAdapter, PlatformConfig, Post, PublishResult, PublishOptions } from "@siyuan-publisher/core"

export class WordPressAdapter implements PlatformAdapter {
  name = "WordPress"
  version = "1.0.0"
  private apiUrl: string = ""
  private username: string = ""
  private password: string = ""

  async connect(config: PlatformConfig): Promise<void> {
    if (!config.config.apiUrl || !config.config.username || !config.config.password) {
      throw new Error("WordPress 配置不完整")
    }
    this.apiUrl = config.config.apiUrl
    this.username = config.config.username
    this.password = config.config.password
  }

  async disconnect(): Promise<void> {
    // WordPress 不需要显式断开连接
  }

  async publish(post: Post, options: PublishOptions): Promise<PublishResult> {
    try {
      if (!this.apiUrl || !this.username || !this.password) {
        throw new Error("WordPress 未连接")
      }

      const response = await fetch(`${this.apiUrl}/wp-json/wp/v2/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
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
      return {
        success: true,
        url: data.link,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "发布失败",
      }
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "连接测试失败",
      }
    }
  }
}
