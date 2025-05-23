import type { Post, PublishOptions, PublishResult } from "./publisher"

// 平台配置类型
export type PlatformConfig = {
  type: string
  config: Record<string, any>
}

// 平台适配器接口
export interface PlatformAdapter {
  name: string
  version: string
  connect: (config: PlatformConfig) => Promise<void>
  disconnect: () => Promise<void>
  publish: (post: Post, options: PublishOptions) => Promise<PublishResult>
}

// 平台元数据类型
export interface PlatformMetadata {
  name: string
  version: string
  description?: string
  supportedFeatures?: string[]
  requiredConfig?: string[]
}
