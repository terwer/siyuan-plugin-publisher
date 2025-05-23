import { Plugin } from '@siyuan-publisher/core'

export interface PluginManagerOptions {
  autoLoad?: boolean
  plugins?: Plugin[]
}

export interface PluginLoadResult {
  success: boolean
  error?: Error
  plugin?: Plugin
}

export interface PluginUnloadResult {
  success: boolean
  error?: Error
} 