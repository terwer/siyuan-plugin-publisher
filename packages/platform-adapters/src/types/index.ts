import { PlatformConfig, PublishOptions, PublishResult } from "@siyuan-publisher/core"

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
