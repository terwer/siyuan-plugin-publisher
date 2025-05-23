/**
 * 基础配置接口
 */
export interface BaseConfig {
  enabled: boolean
  settings?: Record<string, any>
}

/**
 * 基础元数据接口
 */
export interface BaseMetadata {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  homepage?: string
  license?: string
  dependencies?: Record<string, string>
}

/**
 * 基础生命周期接口
 */
export interface Lifecycle {
  initialize: () => Promise<void>
  destroy: () => Promise<void>
}

/**
 * 基础配置管理接口
 */
export interface Configurable {
  getConfig: () => Record<string, any>
  updateConfig: (config: Record<string, any>) => Promise<void>
}
