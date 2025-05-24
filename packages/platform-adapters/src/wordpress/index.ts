import type {
  PlatformAdapter,
  PlatformCapabilities,
  PlatformConfig,
  PlatformMetadata,
  PlatformStatus,
  Post,
  PostStatus,
  PublishResult,
  WordPressConfig,
  WordPressPublishOptions,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

export class WordPressAdapter implements PlatformAdapter {
  readonly id = "wordpress"
  readonly name = "WordPress"
  readonly version = "1.0.0"
  readonly type = "wordpress"

  config: WordPressConfig = {
    type: "wordpress",
    enabled: true,
    settings: {
      apiUrl: "",
      username: "",
      password: "",
    },
    apiUrl: "",
    username: "",
    password: "",
  }

  private status: PlatformStatus = {
    isConnected: false,
  }

  async initialize(): Promise<void> {
    // 初始化逻辑
  }

  async destroy(): Promise<void> {
    await this.disconnect()
  }

  getConfig(): WordPressConfig {
    return this.config
  }

  async updateConfig(config: Partial<WordPressConfig>): Promise<void> {
    this.config = { ...this.config, ...config }
  }

  async validateConfig(config: PlatformConfig): Promise<boolean> {
    if (!config.settings?.apiUrl || !config.settings?.username || !config.settings?.password) {
      throw new PublisherError("INVALID_CONFIG", "Missing required WordPress configuration")
    }
    return true
  }

  getMetadata(): PlatformMetadata {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      type: this.type,
      description: "WordPress platform adapter for publishing posts",
      author: "SiYuan Publisher",
      homepage: "https://github.com/siyuan-note/siyuan-plugin-publisher",
      license: "MIT",
      supportedFeatures: ["publish", "update", "delete", "categories", "tags"],
      requiredConfig: ["apiUrl", "username", "password"],
    }
  }

  getCapabilities(): PlatformCapabilities {
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

  async connect(): Promise<void> {
    try {
      await this.validateConfig(this.config)
      const { apiUrl, username, password } = this.config.settings as {
        apiUrl: string
        username: string
        password: string
      }
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

  async getPostStatus(postId: string): Promise<PostStatus> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.settings as {
        apiUrl: string
        username: string
        password: string
      }
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts/${postId}`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      })

      if (!response.ok) {
        throw new PublisherError("GET_POST_STATUS_FAILED", `Failed to get post status: ${response.statusText}`)
      }

      const data = await response.json()
      return data.status as PostStatus
    } catch (error: any) {
      throw new PublisherError("GET_POST_STATUS_FAILED", `Failed to get post status: ${error.message}`)
    }
  }

  async publish(post: Post, options: WordPressPublishOptions = {}): Promise<PublishResult> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.settings as {
        apiUrl: string
        username: string
        password: string
      }
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

  async deletePost(postId: string): Promise<void> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to WordPress")
      }

      const { apiUrl, username, password } = this.config.settings as {
        apiUrl: string
        username: string
        password: string
      }
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
    } catch (error: any) {
      throw new PublisherError("DELETE_FAILED", error instanceof Error ? error.message : "删除失败")
    }
  }
}
