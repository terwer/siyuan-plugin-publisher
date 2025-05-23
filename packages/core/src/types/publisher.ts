import type { PlatformConfig } from "./platform"

export type Post = {
  title: string
  content: string
  metadata?: Record<string, any>
}

export type PublishResult = {
  success: boolean
  url?: string
  error?: string
}

export interface Publisher {
  name: string
  version: string
  publish: (post: Post) => Promise<PublishResult>
}

export interface PublishOptions {
  platform: {
    type: string
    config: Record<string, any>
  }
  post: Post
}
