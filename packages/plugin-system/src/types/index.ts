import type { 
  Plugin,
  PluginType,
  PluginManifest,
  PluginLoadResult,
  PluginUnloadResult,
  PluginState,
  Post,
  PublishResult,
  PlatformAdapter
} from "@siyuan-publisher/common"

export type { 
  Plugin,
  PluginType,
  PluginManifest,
  PluginLoadResult,
  PluginUnloadResult,
  PluginState,
  PlatformAdapter
}

export interface PostProcessorPlugin extends Plugin {
  processPost: (post: Post) => Promise<Post>
}

export interface PlatformPlugin extends Plugin {
  getPlatformAdapter: () => Promise<PlatformAdapter>
}

export interface PluginManagerOptions {
  autoLoad?: boolean
  plugins?: Plugin[]
  pluginDir?: string
}
