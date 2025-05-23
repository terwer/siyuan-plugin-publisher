import type { BaseConfig, BaseMetadata, Lifecycle, Configurable } from "./base"

/**
 * 插件类型
 */
export type PluginType = "adapter" | "plugin"

/**
 * 插件接口
 */
export interface Plugin extends BaseMetadata, Lifecycle, Configurable {}

/**
 * 插件配置
 */
export interface PluginConfig extends BaseConfig {}

/**
 * 插件元数据
 */
export interface PluginMetadata extends BaseMetadata {}

/**
 * 插件清单
 */
export interface PluginManifest extends BaseMetadata {
  main: string
  type: PluginType
  dependencies?: Record<string, string>
}

/**
 * 插件加载器接口
 */
export interface PluginLoader {
  loadPlugin: (plugin: Plugin, manifest: PluginManifest) => Promise<PluginLoadResult>
  unloadPlugin: (pluginId: string) => Promise<PluginUnloadResult>
}

/**
 * 插件加载结果
 */
export interface PluginLoadResult {
  success: boolean
  plugin?: Plugin
  error?: string
}

/**
 * 插件卸载结果
 */
export interface PluginUnloadResult {
  success: boolean
  error?: Error
}

/**
 * 插件状态
 */
export interface PluginState {
  status: "loading" | "loaded" | "error" | "unloaded"
  error?: Error
  dependencies?: Record<string, string>
}
