import type { Post, PublishResult, Plugin as CorePlugin } from "@siyuan-publisher/core"

export type Plugin = CorePlugin

export interface PostProcessorPlugin extends Plugin {
  processPost: (post: Post) => Promise<Post>
}

export interface PlatformAdapter {
  testConnection: (config: any) => Promise<boolean>
  publish: (post: Post) => Promise<PublishResult>
}

export interface PlatformPlugin extends Plugin {
  getPlatformAdapter: () => Promise<PlatformAdapter>
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  main: string
  type: "post-processor" | "platform"
  dependencies?: string[]
}

export interface PluginLoadResult {
  success: boolean
  plugin?: Plugin
  error?: string
}

export interface PluginManagerOptions {
  autoLoad?: boolean
  plugins?: Plugin[]
  pluginDir?: string
}

export interface PluginUnloadResult {
  success: boolean
  error?: Error
}

export interface PluginState {
  status: "loading" | "loaded" | "error" | "unloaded"
  error?: Error
  dependencies?: string[]
}
