import type {
  PlatformAdapter,
  Post,
  WordPressConfig,
  WordPressPublishOptions,
  PlatformStatus,
  PlatformCapabilities,
  PublishResult,
  PostStatus,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

export class WordPressAdapter implements PlatformAdapter {
  readonly id = "wordpress"
  readonly name = "WordPress"
  readonly version = "1.0.0"
  readonly type = "wordpress"

  private config: WordPressConfig = {
    type: "wordpress",
    config: {
      apiUrl: "",
      username: "",
      password: "",
    },
  }

  private status: PlatformStatus = {
    isConnected: false,
  }

  async initialize() {
    // 初始化逻辑
  }

  async destroy() {
    await this.disconnect()
  }

  getConfig(): WordPressConfig {
    return this.config
  }

  async updateConfig(config: Partial<WordPressConfig>): Promise<void> {
    this.config = { ...this.config, ...config }
  }

  async validateConfig(config: WordPressConfig): Promise<boolean> {
    if (!config.config.apiUrl || !config.config.username || !config.config.password) {
      throw new PublisherError("INVALID_CONFIG", "Missing required WordPress configuration")
    }
    return true
  }

  async connect(): Promise<void> {
    try {
      await this.validateConfig(this.config)
      const { apiUrl, username, password } = this.config.config
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      })
      if (!response.ok) {
        throw new PublisherError("CONNECTION_FAILED", `Failed to connect to WordPress: ${response.statusText}`)
      }
      this.status = {
        isConnected: true,
        connectedAt: new Date(),
      }
    } catch (error) {
      this.status = {
        isConnected: false,
        error: error instanceof Error ? error.message : "Connection failed",
      }
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.status = {
      isConnected: false,
    }
  }

  async getStatus(): Promise<PlatformStatus> {
    return this.status
  }

  async getCapabilities(): Promise<PlatformCapabilities> {
    return {
      features: ["publish", "update", "delete", "categories", "tags"],
      supportedPostStatus: ["draft", "publish", "private"],
      supportedPostTypes: ["post", "page"],
      supportsBatchPublish: false,
      supportsPostDeletion: true,
      supportsPostUpdate: true,
      supportsPostStatus: true,
    }
  }

  async publish(post: Post, options: WordPressPublishOptions = {}): Promise<PublishResult> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

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
        throw new PublisherError("PUBLISH_FAILED", error.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        url: data.link,
        postId: data.id.toString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "发布失败",
      }
    }
  }

  async update(post: Post, options: WordPressPublishOptions = {}): Promise<PublishResult> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.config
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          status: options.status,
          categories: options.categories,
          tags: options.tags,
          meta: post.metadata,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new PublisherError("PUBLISH_FAILED", error.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        url: data.link,
        postId: data.id.toString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "更新失败",
      }
    }
  }

  async delete(postId: string): Promise<boolean> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.config
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new PublisherError("DELETE_FAILED", error.message || `HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      throw new PublisherError("DELETE_FAILED", error instanceof Error ? error.message : "删除失败")
    }
  }

  async getPost(postId: string): Promise<Post | null> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.config
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts/${postId}`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new PublisherError("STATUS_CHECK_FAILED", `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        id: data.id.toString(),
        title: data.title.rendered,
        content: data.content.rendered,
        status: data.status as PostStatus,
        publishDate: new Date(data.date),
        metadata: data.meta,
      }
    } catch (error) {
      throw new PublisherError("STATUS_CHECK_FAILED", error instanceof Error ? error.message : "获取文章失败")
    }
  }

  async getPosts(options: { page?: number; pageSize?: number } = {}): Promise<Post[]> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.config
      const { page = 1, pageSize = 10 } = options
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts?page=${page}&per_page=${pageSize}`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      })

      if (!response.ok) {
        throw new PublisherError("STATUS_CHECK_FAILED", `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.map((post: any) => ({
        id: post.id.toString(),
        title: post.title.rendered,
        content: post.content.rendered,
        status: post.status as PostStatus,
        publishDate: new Date(post.date),
        metadata: post.meta,
      }))
    } catch (error) {
      throw new PublisherError("STATUS_CHECK_FAILED", error instanceof Error ? error.message : "获取文章列表失败")
    }
  }
}
