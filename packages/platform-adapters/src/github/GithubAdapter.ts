import type { PlatformAdapter } from "../types"
import type { PlatformConfig, Post, PublishOptions, PublishResult } from "@siyuan-publisher/common"

export class GithubAdapter implements PlatformAdapter {
  readonly name = "GitHub"
  readonly version = "1.0.0"
  readonly type = "github"

  private config: PlatformConfig = { type: "github", config: {} }

  async initialize() {}
  async destroy() {}

  getConfig(): PlatformConfig {
    return this.config
  }

  async updateConfig(config: PlatformConfig) {
    this.config = config
  }

  async connect(config: PlatformConfig): Promise<void> {
    this.config = config
    // 可扩展：测试 token 有效性
  }

  async disconnect(): Promise<void> {
    // GitHub 无需显式断开
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { token, owner, repo } = this.config.config
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Authorization: `token ${token}` },
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "连接测试失败" }
    }
  }

  async publish(post: Post, options: PublishOptions): Promise<PublishResult> {
    try {
      const { token, owner, repo, path = "README.md", branch = "main" } = this.config.config
      const content = btoa(unescape(encodeURIComponent(post.content)))
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      const body = {
        message: options.commitMessage || `Publish: ${post.title}`,
        content,
        branch,
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
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { success: true, url: data.content.html_url }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "发布失败" }
    }
  }
}
