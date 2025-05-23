import type { Publisher, PublishResult } from "../types"
import type { Post } from "../types"

export class PublisherService implements Publisher {
  name: string
  version: string
  private platformAdapters: Map<string, any> = new Map()

  constructor(name: string, version: string) {
    this.name = name
    this.version = version
  }

  async publish(post: Post): Promise<PublishResult> {
    try {
      // 获取默认平台适配器
      const defaultAdapter = this.getDefaultAdapter()
      if (!defaultAdapter) {
        throw new Error("No platform adapter available")
      }

      // 执行发布
      return await defaultAdapter.publish(post)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  private getDefaultAdapter() {
    // 返回第一个可用的适配器
    return this.platformAdapters.values().next().value
  }

  registerAdapter(name: string, adapter: any) {
    this.platformAdapters.set(name, adapter)
  }

  unregisterAdapter(name: string) {
    this.platformAdapters.delete(name)
  }
}
