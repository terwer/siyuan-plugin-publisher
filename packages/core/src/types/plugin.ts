export interface Plugin {
  name: string;
  version: string;
  init: () => Promise<void>;
  destroy: () => Promise<void>;
}

export interface PluginConfig {
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  license?: string;
  dependencies?: Record<string, string>;
} 