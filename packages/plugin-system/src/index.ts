import { PluginManager } from "./manager/PluginManager"
import type { PostProcessorPlugin, PlatformPlugin, PluginManagerOptions } from "@siyuan-publisher/common"

// 导出平台特定类型
export type { PostProcessorPlugin, PlatformPlugin, PluginManagerOptions }

// 导出加载器
export { BrowserPluginLoader } from "./loader"
export { PluginLoader } from "./loader/PluginLoader"

// 导出插件系统
export { PluginManager as PluginSystem }

// 导出平台适配器管理器
export { PlatformAdapterManager } from "./manager/PlatformAdapterManager"

// 导出工具函数
export * from "./utils"
