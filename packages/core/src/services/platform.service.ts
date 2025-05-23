import type { PlatformAdapter, PlatformConfig, PublishOptions, PublishResult } from "../types"
import type { Post } from "../types"
import { PublisherError } from "../types"

export class PlatformService {
  private adapters: Map<string, PlatformAdapter> = new Map()
  private activeAdapter?: PlatformAdapter

  async registerAdapter(adapter: PlatformAdapter): Promise<void> {
    if (this.adapters.has(adapter.name)) {
      throw new PublisherError("PLATFORM_NOT_FOUND", `Platform adapter ${adapter.name} is already registered`)
    }
    this.adapters.set(adapter.name, adapter)
  }

  async unregisterAdapter(name: string): Promise<void> {
    const adapter = this.adapters.get(name)
    if (!adapter) {
      throw new PublisherError("PLATFORM_NOT_FOUND", `Platform adapter ${name} is not registered`)
    }

    if (this.activeAdapter === adapter) {
      await this.disconnect()
    }
    this.adapters.delete(name)
  }

  async connect(name: string, config: PlatformConfig): Promise<void> {
    const adapter = this.adapters.get(name)
    if (!adapter) {
      throw new PublisherError("PLATFORM_NOT_FOUND", `Platform adapter ${name} is not registered`)
    }

    if (this.activeAdapter) {
      await this.disconnect()
    }

    try {
      await adapter.connect(config)
      this.activeAdapter = adapter
    } catch (error) {
      throw new PublisherError("PLATFORM_CONNECT_FAILED", `Failed to connect to platform ${name}`, {
        originalError: error,
      })
    }
  }

  async disconnect(): Promise<void> {
    if (this.activeAdapter) {
      try {
        await this.activeAdapter.disconnect()
        this.activeAdapter = undefined
      } catch (error) {
        throw new PublisherError(
          "PLATFORM_DISCONNECT_FAILED",
          `Failed to disconnect from platform ${this.activeAdapter!.name}`,
          { originalError: error },
        )
      }
    }
  }

  async publish(post: Post, options: PublishOptions): Promise<PublishResult> {
    if (!this.activeAdapter) {
      throw new PublisherError("PLATFORM_NOT_CONNECTED", "No active platform adapter")
    }

    try {
      return await this.activeAdapter.publish(post, options)
    } catch (error) {
      throw new PublisherError("PUBLISH_FAILED", `Failed to publish to platform ${this.activeAdapter.name}`, {
        originalError: error,
      })
    }
  }

  getActiveAdapter(): PlatformAdapter | undefined {
    return this.activeAdapter
  }

  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.adapters.values())
  }
}
