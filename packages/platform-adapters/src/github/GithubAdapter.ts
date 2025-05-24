import type {
  PlatformAdapter,
  PlatformConfig,
  Post,
  PublishOptions,
  PublishResult,
  GithubConfig,
  GithubPublishOptions,
  GithubPublishResult,
  PlatformStatus,
  PlatformCapabilities,
  PostStatus,
} from "@siyuan-publisher/common"
import { PublisherError } from "@siyuan-publisher/common"

export class GithubAdapter implements PlatformAdapter {
  readonly id = "github"
  readonly name = "GitHub"
  readonly version = "1.0.0"
  readonly type = "github"

  private config: GithubConfig = {
    type: "github",
    config: {
      token: "",
      owner: "",
      repo: "",
      branch: "main",
      path: "README.md",
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

  getConfig(): GithubConfig {
    return this.config
  }

  async updateConfig(config: Partial<GithubConfig>): Promise<void> {
    this.config = { ...this.config, ...config }
  }

  async validateConfig(config: GithubConfig): Promise<boolean> {
    if (!config.config.token || !config.config.owner || !config.config.repo) {
      throw new PublisherError("INVALID_CONFIG", "Missing required GitHub configuration")
    }
    return true
  }

  async connect(): Promise<void> {
    try {
      await this.validateConfig(this.config)
      const { token, owner, repo } = this.config.config
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

  async getCapabilities(): Promise<PlatformCapabilities> {
    return {
      features: ["publish", "update", "delete"],
      supportedPostStatus: ["published"],
      supportedPostTypes: ["markdown"],
      supportsBatchPublish: false,
      supportsPostDeletion: true,
      supportsPostUpdate: true,
      supportsPostStatus: true,
    }
  }

  async publish(post: Post, options: GithubPublishOptions = {}): Promise<GithubPublishResult> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const { token, owner, repo, path = "README.md", branch = "main" } = this.config.config
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

  async update(post: Post, options: GithubPublishOptions = {}): Promise<GithubPublishResult> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const { token, owner, repo, path = "README.md", branch = "main" } = this.config.config
      const content = btoa(unescape(encodeURIComponent(post.content)))
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

      // 获取当前文件 SHA
      const getResponse = await fetch(url, {
        headers: { Authorization: `token ${token}` },
      })
      if (!getResponse.ok) {
        throw new PublisherError("PUBLISH_FAILED", "Failed to get current file SHA")
      }
      const currentFile = await getResponse.json()

      const body = {
        message: options.commitMessage || `Update: ${post.title}`,
        content,
        branch: options.branch || branch,
        sha: currentFile.sha,
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
        commitSha: data.content.sha,
        htmlUrl: data.content.html_url,
        rawUrl: data.content.download_url,
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
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const { token, owner, repo, path = "README.md", branch = "main" } = this.config.config
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

      // 获取当前文件 SHA
      const getResponse = await fetch(url, {
        headers: { Authorization: `token ${token}` },
      })
      if (!getResponse.ok) {
        throw new PublisherError("DELETE_FAILED", "Failed to get current file SHA")
      }
      const currentFile = await getResponse.json()

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          message: `Delete: ${postId}`,
          sha: currentFile.sha,
          branch,
        }),
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
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const { token, owner, repo, path = "README.md", branch = "main" } = this.config.config
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`

      const response = await fetch(url, {
        headers: { Authorization: `token ${token}` },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new PublisherError("STATUS_CHECK_FAILED", `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const content = decodeURIComponent(escape(atob(data.content)))

      return {
        id: data.sha,
        title: path.split("/").pop() || "Untitled",
        content,
        status: "published" as PostStatus,
        publishDate: new Date(data.last_modified),
      }
    } catch (error) {
      throw new PublisherError("STATUS_CHECK_FAILED", error instanceof Error ? error.message : "获取文章失败")
    }
  }

  async getPosts(options: { page?: number; pageSize?: number } = {}): Promise<Post[]> {
    try {
      if (!this.status.isConnected) {
        throw new PublisherError("CONNECTION_FAILED", "Not connected to GitHub")
      }

      const { token, owner, repo, branch = "main" } = this.config.config
      const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`

      const response = await fetch(url, {
        headers: { Authorization: `token ${token}` },
      })

      if (!response.ok) {
        throw new PublisherError("STATUS_CHECK_FAILED", `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const posts: Post[] = []

      for (const item of data.tree) {
        if (item.type === "blob" && item.path.endsWith(".md")) {
          const post = await this.getPost(item.sha)
          if (post) {
            posts.push(post)
          }
        }
      }

      return posts
    } catch (error) {
      throw new PublisherError("STATUS_CHECK_FAILED", error instanceof Error ? error.message : "获取文章列表失败")
    }
  }
}
