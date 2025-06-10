import type { PlatformAdaptor } from "@siyuan-publisher/common"
import { GithubAdaptor } from "./github"
import { WordPressAdaptor } from "./wordpress"

/**
 * 默认平台适配器注册表
 * 负责管理内置的平台适配器
 */
export class DefaultPlatformAdaptorRegistry {
  private static instance: DefaultPlatformAdaptorRegistry
  private adaptors: Map<string, PlatformAdaptor> = new Map()

  private constructor() {
    // 注册内置适配器
    this.register(new GithubAdaptor())
    this.register(new WordPressAdaptor())
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): DefaultPlatformAdaptorRegistry {
    if (!DefaultPlatformAdaptorRegistry.instance) {
      DefaultPlatformAdaptorRegistry.instance = new DefaultPlatformAdaptorRegistry()
    }
    return DefaultPlatformAdaptorRegistry.instance
  }

  /**
   * 注册平台适配器
   * @param adaptor 平台适配器
   */
  public register(adaptor: PlatformAdaptor): void {
    this.adaptors.set(adaptor.id, adaptor)
  }

  /**
   * 注销平台适配器
   * @param adaptorId 平台适配器ID
   */
  public unregister(adaptorId: string): void {
    this.adaptors.delete(adaptorId)
  }

  /**
   * 获取平台适配器
   * @param adaptorId 平台适配器ID
   */
  public getAdaptor(adaptorId: string): PlatformAdaptor | undefined {
    return this.adaptors.get(adaptorId)
  }

  /**
   * 获取所有平台适配器
   */
  public getAllAdaptors(): PlatformAdaptor[] {
    return Array.from(this.adaptors.values())
  }

  /**
   * 启用平台适配器
   * @param adaptor 平台适配器
   */
  public async enableAdaptor(adaptor: PlatformAdaptor): Promise<void> {
    if (adaptor.initialize) {
      await adaptor.initialize()
    }
  }

  /**
   * 禁用平台适配器
   * @param adaptor 平台适配器
   */
  public async disableAdaptor(adaptor: PlatformAdaptor): Promise<void> {
    if (adaptor.destroy) {
      await adaptor.destroy()
    }
  }

  /**
   * 更新平台适配器配置
   * @param adaptor 平台适配器
   * @param config 配置
   */
  public async updateAdaptorConfig(adaptor: PlatformAdaptor, config: any): Promise<void> {
    if (adaptor.updateConfig) {
      await adaptor.updateConfig(config)
    }
  }
} 