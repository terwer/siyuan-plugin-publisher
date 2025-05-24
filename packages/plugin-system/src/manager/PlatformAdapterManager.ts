import { PlatformAdapterRegistry } from "@siyuan-publisher/common"
import { DefaultPlatformAdapterRegistry, PlatformAdapter } from "@siyuan-publisher/platform-adapters"

export class PlatformAdapterManager {
  private static instance: PlatformAdapterManager
  private registry: PlatformAdapterRegistry

  private constructor() {
    this.registry = DefaultPlatformAdapterRegistry.getInstance()
  }

  static getInstance(): PlatformAdapterManager {
    if (!PlatformAdapterManager.instance) {
      PlatformAdapterManager.instance = new PlatformAdapterManager()
    }
    return PlatformAdapterManager.instance
  }

  getAdapter(id: string): PlatformAdapter | undefined {
    return this.registry.getAdapter(id)
  }

  getAllAdapters(): PlatformAdapter[] {
    return this.registry.getAllAdapters()
  }

  async connectAdapter(id: string, config: any): Promise<void> {
    const adapter = this.getAdapter(id)
    if (!adapter) {
      throw new Error(`Platform adapter ${id} not found`)
    }
    await adapter.connect()
  }

  async disconnectAdapter(id: string): Promise<void> {
    const adapter = this.getAdapter(id)
    if (!adapter) {
      console.warn(`Platform adapter ${id} not found, ignore disconnect`)
      return
    }
    await adapter.disconnect()
  }

  async publishWithAdapter(id: string, post: any, options: any): Promise<any> {
    const adapter = this.getAdapter(id)
    if (!adapter) {
      throw new Error(`Platform adapter ${id} not found`)
    }
    return await adapter.publish(post, options)
  }

  async unloadAll(): Promise<void> {
    const adapters = this.getAllAdapters()
    for (const adapter of adapters) {
      try {
        await this.disconnectAdapter(adapter.id)
      } catch (error) {
        console.error(`Failed to disconnect adapter ${adapter.id}:`, error)
      }
    }
  }
}
