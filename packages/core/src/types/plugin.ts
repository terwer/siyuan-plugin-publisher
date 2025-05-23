export interface Plugin {
  id: string
  name: string
  version: string
  initialize: () => Promise<void>
  destroy: () => Promise<void>
  getConfig: () => Record<string, any>
  updateConfig: (config: Record<string, any>) => Promise<void>
}

export interface PluginConfig {
  enabled: boolean
  settings?: Record<string, any>
}

export interface PluginMetadata {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  homepage?: string
  license?: string
  dependencies?: Record<string, string>
}
