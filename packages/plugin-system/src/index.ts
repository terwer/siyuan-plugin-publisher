// 导出平台特定类型
export type { PostProcessorPlugin, PlatformPlugin, PluginManagerOptions } from "./types"

// 导出加载器
export { BrowserPluginLoader } from "./loader"
export { PluginLoader } from "./loader/PluginLoader"

// 导出插件系统
export { PluginManager as PluginSystem } from "./manager/PluginManager"

// 导出平台适配器管理器
export { PlatformAdapterManager } from "./manager/PlatformAdapterManager"

// 导出工具函数
export * from "./utils"
