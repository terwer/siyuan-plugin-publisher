import type { Post } from "@/types/publish"
import type { BaseConfig, BaseMetadata, Configurable, Lifecycle } from "./base"
import type { PlatformAdapter, PlatformType } from "./platform"

/**
 * 插件类型
 */
export type PluginType = PlatformType | "plugin"

/**
 * 插件接口
 */
export interface Plugin extends BaseMetadata, Lifecycle, Configurable {
  /**
   * 插件类型
   */
  readonly type: PluginType
}

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

/**
 * 插件事件类型
 */
export type PluginEventType =
  | "loading"
  | "loaded"
  | "unloading"
  | "unloaded"
  | "error"
  | "dependency_resolved"
  | "dependency_failed"

/**
 * 插件事件
 */
export interface PluginEvent {
  type: PluginEventType
  pluginId: string
  data?: any
  timestamp: Date
}

/**
 * 插件依赖解析结果
 */
export interface PluginDependencyResolution {
  success: boolean
  resolved: Record<string, string>
  missing: string[]
  conflicts: Array<{
    package: string
    required: string
    provided: string
  }>
}

/**
 * 插件验证结果
 */
export interface PluginValidationResult {
  valid: boolean
  errors: Array<{
    field: string
    message: string
  }>
  warnings: Array<{
    field: string
    message: string
  }>
}

/**
 * 插件注册表
 */
export interface PluginRegistry {
  register(plugin: Plugin): Promise<void>
  unregister(pluginId: string): Promise<void>
  getPlugin(pluginId: string): Plugin | undefined
  getAllPlugins(): Plugin[]
  getPluginsByType(type: PluginType): Plugin[]
}

/**
 * 插件管理器接口
 */
export interface PluginManager {
  /**
   * 注册插件
   */
  registerPlugin(plugin: Plugin): Promise<void>

  /**
   * 注销插件
   */
  unregisterPlugin(id: string): Promise<void>

  /**
   * 获取插件
   */
  getPlugin(id: string): Plugin | undefined

  /**
   * 获取平台适配器
   */
  getPlatformAdapter(type: string): PlatformAdapter | undefined

  /**
   * 获取所有插件
   */
  getAllPlugins(): Plugin[]

  /**
   * 获取所有平台适配器
   */
  getAllPlatformAdapters(): PlatformAdapter[]

  /**
   * 获取插件状态
   */
  getPluginState(id: string): PluginState | undefined

  /**
   * 卸载所有插件
   */
  unloadAll(): Promise<void>
}

/**
 * 文章处理器插件
 */
export interface PostProcessorPlugin extends Plugin {
  /**
   * 处理文章
   */
  processPost(post: Post): Promise<Post>
}

/**
 * 平台插件
 */
export interface PlatformPlugin extends Plugin {
  /**
   * 获取平台适配器
   */
  getPlatformAdapter(): Promise<PlatformAdapter>
}

/**
 * 插件管理器选项
 */
export interface PluginManagerOptions {
  /**
   * 是否自动加载插件
   */
  autoLoad?: boolean
  /**
   * 预加载的插件列表
   */
  plugins?: Plugin[]
  /**
   * 插件目录
   */
  pluginDir?: string
}
