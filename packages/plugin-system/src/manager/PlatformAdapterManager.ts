import { PlatformAdapterRegistry } from "@siyuan-publisher/common"
import {DefaultPlatformAdapterRegistry, PlatformAdapter} from "@siyuan-publisher/platform-adapters"

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

  getAdapter(name: string): PlatformAdapter | undefined {
    return this.registry.getAdapter(name)
  }

  getAllAdapters(): PlatformAdapter[] {
    return this.registry.getAllAdapters()
  }

  async connectAdapter(name: string, config: any): Promise<void> {
    const adapter = this.getAdapter(name)
    if (!adapter) {
      throw new Error(`Platform adapter ${name} not found`)
    }
    await adapter.connect()
  }

  async disconnectAdapter(name: string): Promise<void> {
    const adapter = this.getAdapter(name)
    if (!adapter) {
      throw new Error(`Platform adapter ${name} not found`)
    }
    await adapter.disconnect()
  }

  async publishWithAdapter(name: string, post: any, options: any): Promise<any> {
    const adapter = this.getAdapter(name)
    if (!adapter) {
      throw new Error(`Platform adapter ${name} not found`)
    }
    return await adapter.publish(post, options)
  }
}
