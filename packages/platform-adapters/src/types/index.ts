import type { 
  PlatformConfig, 
  PublishOptions, 
  PublishResult, 
  Post,
  PlatformAdapter 
} from "@siyuan-publisher/common"

// 导出基础接口
export type { PlatformAdapter }

// 平台适配器注册器接口
export interface PlatformAdapterRegistry {
  register(adapter: PlatformAdapter): void
  unregister(type: string): void
  getAdapter(type: string): PlatformAdapter | undefined
  getAllAdapters(): PlatformAdapter[]
}

// GitHub 平台特定类型
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

// WordPress 平台特定类型
export interface WordPressConfig extends PlatformConfig {
  apiUrl: string
  username: string
  password: string
}

export interface WordPressPublishOptions extends PublishOptions {
  status?: "draft" | "publish" | "private"
  categories?: number[]
  tags?: number[]
}
