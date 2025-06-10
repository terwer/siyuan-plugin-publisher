import { PlatformAdaptorRegistry } from "@siyuan-publisher/common"
import { DefaultPlatformAdaptorRegistry, PlatformAdaptor } from "@siyuan-publisher/platform-adaptors"

export class PlatformAdaptorManager {
  private static instance: PlatformAdaptorManager
  private registry: PlatformAdaptorRegistry

  private constructor() {
    this.registry = DefaultPlatformAdaptorRegistry.getInstance()
  }

  static getInstance(): PlatformAdaptorManager {
    if (!PlatformAdaptorManager.instance) {
      PlatformAdaptorManager.instance = new PlatformAdaptorManager()
    }
    return PlatformAdaptorManager.instance
  }

  getAdaptor(id: string): PlatformAdaptor | undefined {
    return this.registry.getAdaptor(id)
  }

  getAllAdaptors(): PlatformAdaptor[] {
    return this.registry.getAllAdaptors()
  }

  registerAdaptor(adaptor: PlatformAdaptor): void {
    this.registry.register(adaptor)
  }

  async connectAdaptor(id: string, config: any): Promise<void> {
    const adaptor = this.getAdaptor(id)
    if (!adaptor) {
      throw new Error(`Platform adaptor ${id} not found`)
    }
    await adaptor.connect()
  }

  async disconnectAdaptor(id: string): Promise<void> {
    const adaptor = this.getAdaptor(id)
    if (!adaptor) {
      console.warn(`Platform adaptor ${id} not found, ignore disconnect`)
      return
    }
    await adaptor.disconnect()
  }

  async publishWithAdaptor(id: string, post: any, options: any): Promise<any> {
    const adaptor = this.getAdaptor(id)
    if (!adaptor) {
      throw new Error(`Platform adaptor ${id} not found`)
    }
    return await adaptor.publish(post, options)
  }

  async unloadAll(): Promise<void> {
    const adaptors = this.getAllAdaptors()
    for (const adaptor of adaptors) {
      try {
        await this.disconnectAdaptor(adaptor.id)
      } catch (error) {
        console.error(`Failed to disconnect adaptor ${adaptor.id}:`, error)
      }
    }
  }
}
