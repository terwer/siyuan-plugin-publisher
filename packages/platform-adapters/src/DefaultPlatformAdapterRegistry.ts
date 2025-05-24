import type { PlatformAdapterRegistry as IPlatformAdapterRegistry, PlatformAdapter } from "@siyuan-publisher/common"
import { GithubAdapter } from "./github"
import { WordPressAdapter } from "./wordpress"

/**
 * 默认平台适配器注册表实现
 */
export class DefaultPlatformAdapterRegistry implements IPlatformAdapterRegistry {
  private static instance: DefaultPlatformAdapterRegistry
  private adapters: Map<string, PlatformAdapter>

  private constructor() {
    this.adapters = new Map()
    // 注册内置适配器
    this.register(new WordPressAdapter())
    this.register(new GithubAdapter())
  }

  static getInstance(): DefaultPlatformAdapterRegistry {
    if (!DefaultPlatformAdapterRegistry.instance) {
      DefaultPlatformAdapterRegistry.instance = new DefaultPlatformAdapterRegistry()
    }
    return DefaultPlatformAdapterRegistry.instance
  }

  register(adapter: PlatformAdapter): void {
    this.adapters.set(adapter.type, adapter)
  }

  unregister(type: string): void {
    this.adapters.delete(type)
  }

  getAdapter(type: string): PlatformAdapter | undefined {
    return this.adapters.get(type)
  }

  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.adapters.values())
  }
} 