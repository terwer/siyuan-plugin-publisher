import type {
  GithubConfig,
  GithubPublishOptions,
  GithubPublishResult,
  PlatformAdapter,
  PlatformCapabilities,
  PlatformConfig,
  PlatformMetadata,
  PlatformStatus,
  Post,
  PostStatus,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

export class GithubAdapter implements PlatformAdapter {
  readonly id = "github"
  readonly name = "GitHub"
  readonly version = "1.0.0"
  readonly type = "github"

  config: GithubConfig = {
    type: "github",
    enabled: true,
    settings: {
      token: "",
      owner: "",
      repo: "",
      branch: "main",
      path: "README.md",
    },
    token: "",
    owner: "",
    repo: "",
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

  getConfig(): GithubConfig {
    return this.config
  }

  async updateConfig(config: Partial<GithubConfig>): Promise<void> {
    this.config = { ...this.config, ...config }
  }
  async validateConfig(config: PlatformConfig): Promise<boolean> {
    if (!config.settings?.token || !config.settings?.owner || !config.settings?.repo) {
      throw new PublisherError("INVALID_CONFIG", "Missing required GitHub configuration")
    }
    return true
  }

  getMetadata(): PlatformMetadata {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      type: this.type,
      description: "GitHub platform adapter for publishing posts as issues",
      author: "SiYuan Publisher",
      homepage: "https://github.com/siyuan-note/siyuan-plugin-publisher",
      license: "MIT",
      supportedFeatures: ["publish", "update", "delete"],
      requiredConfig: ["token", "owner", "repo"],
    }
  }

  getCapabilities(): PlatformCapabilities {
    return {
      features: ["publish", "update", "delete"],
      supportedPostStatus: ["published", "draft"],
      supportedPostTypes: ["markdown"],
      supportsBatchPublish: false,
      supportsPostDeletion: true,
      supportsPostUpdate: true,
      supportsPostStatus: true,
    }
  }

  async connect(): Promise<void> {
    try {
      await this.validateConfig(this.config)
      const { token, owner, repo } = this.config.settings as { token: string; owner: string; repo: string }
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Authorization: `token ${token}` },
      })
      if (!response.ok) {
        throw new PublisherError("CONNECTION_FAILED", `Failed to connect to GitHub: ${response.statusText}`)
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
      const [owner, repo, issueNumber] = postId.split("/")
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
        headers: { Authorization: `token ${this.config.settings?.token}` },
      })

      if (!response.ok) {
        throw new PublisherError("GET_POST_STATUS_FAILED", `Failed to get post status: ${response.statusText}`)
      }

      const data = await response.json()
      return data.state === "open" ? "published" : "draft"
    } catch (error: any) {
      throw new PublisherError("GET_POST_STATUS_FAILED", `Failed to get post status: ${error.message}`)
    }
  }

  async publish(post: Post, options: GithubPublishOptions = {}): Promise<GithubPublishResult> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const { token, owner, repo, path = "README.md", branch = "main" } = this.config.settings ?? {}
      const content = btoa(unescape(encodeURIComponent(post.content)))
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      const body = {
        message: options.commitMessage || `Publish: ${post.title}`,
        content,
        branch: options.branch || branch,
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new PublisherError("PUBLISH_FAILED", error.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        url: data.content.html_url,
        postId: data.content.sha,
        commitSha: data.content.sha,
        htmlUrl: data.content.html_url,
        rawUrl: data.content.download_url,
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
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const [owner, repo, issueNumber] = postId.split("/")
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${this.config.settings?.token}`,
        },
        body: JSON.stringify({
          state: "closed",
        }),
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
