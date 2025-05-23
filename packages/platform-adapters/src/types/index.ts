import type { PlatformConfig, PublishOptions, PublishResult, Post } from "@siyuan-publisher/core"

// 平台适配器统一接口
export interface PlatformAdapter {
  readonly name: string
  readonly version: string
  readonly type: string

  initialize(): Promise<void>
  destroy(): Promise<void>

  getConfig(): PlatformConfig
  updateConfig(config: PlatformConfig): Promise<void>

  connect(config: PlatformConfig): Promise<void>
  disconnect(): Promise<void>
  testConnection(): Promise<{ success: boolean; error?: string }>
  publish(post: Post, options: PublishOptions): Promise<PublishResult>
}

// 平台适配器注册器接口
export interface PlatformAdapterRegistry {
  register(adapter: PlatformAdapter): void
  unregister(type: string): void
  getAdapter(type: string): PlatformAdapter | undefined
  getAllAdapters(): PlatformAdapter[]
}

export interface GithubConfig extends PlatformConfig {
  token: string
  owner: string
  repo: string
  branch?: string
  path?: string
}

export interface GithubPublishOptions extends PublishOptions {
  commitMessage?: string
  branch?: string
  path?: string
}

export interface GithubPublishResult extends PublishResult {
  commitSha?: string
  htmlUrl?: string
  rawUrl?: string
}
