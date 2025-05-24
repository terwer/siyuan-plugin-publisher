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
    this.registerBuiltInAdapters()
  }

  private registerBuiltInAdapters() {
    // 注册 WordPress 适配器
    const wordpressAdapter = new WordPressAdapter()
    this.register(wordpressAdapter)

    // 注册 GitHub 适配器
    const githubAdapter = new GithubAdapter()
    this.register(githubAdapter)
  }

  static getInstance(): DefaultPlatformAdapterRegistry {
    if (!DefaultPlatformAdapterRegistry.instance) {
      DefaultPlatformAdapterRegistry.instance = new DefaultPlatformAdapterRegistry()
    }
    return DefaultPlatformAdapterRegistry.instance
  }

  register(adapter: PlatformAdapter): void {
    if (!adapter.id || !adapter.type) {
      throw new Error("Invalid adapter: missing id or type")
    }
    this.adapters.set(adapter.id, adapter)
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