import { Post } from "zhi-blog-api"
import {
  IPlugin,
  PlatformCapabilities,
  PlatformStatus,
  PluginLogger,
  PublishOptions,
  PublishResult,
} from "./types/plugin"
import { AuthMode, PlatformType, SubPlatformType } from "./types/platform"
import { HookStage, PluginHook } from "./types/hooks"
import {ModuleLogger} from "./logger";
import {mountPtAttr} from "./util";
import {PluginApi, SiyuanApi} from "./types/global";

export abstract class BasePlugin implements IPlugin {
  readonly id: string =  this.constructor.name
  readonly name: string = this.constructor.name
  readonly group: string = "unknown"
  readonly version: string = "unknown"
  readonly description: string = "unknown"
  readonly author: string = "unknown"
  readonly platformType: PlatformType  =  PlatformType.Common
  readonly subPlatformType: SubPlatformType = SubPlatformType.NONE
  readonly authMode: AuthMode =  AuthMode.NONE

  protected config: Record<string, any> = {}
  public readonly capabilities: PlatformCapabilities = {
    supportsCategories: false,
    supportsTags: false,
    supportsCustomFields: false,
    supportsMediaUpload: false,
    supportsDraft: false,
    supportsScheduledPublish: false,
    supportsCustomTemplates: false,
    supportsCustomDomain: false,
    supportsCustomCSS: false,
    supportsCustomJS: false
  }
  public readonly configSchema: Record<string, any> = {}
  public readonly defaultConfig: Record<string, any> = {}

  readonly logger: PluginLogger
  readonly hooks: Partial<Record<HookStage, PluginHook>> = {}
  readonly api: PluginApi

  constructor(id?: string) {
    const pluginId = id ?? this.id
    if (!pluginId) {
      throw new Error("Plugin id is required.")
    }
    // 自动注册插件
    mountPtAttr(`plugins.${pluginId}`, this);
    // 初始化日志
    this.logger = new ModuleLogger(pluginId)
    this.api = {
      siyuan: window.pt.api.siyuan,
      util: {
        fetch: window.pt.api.util.fetch,
        Lodash: window.pt.api.util.Lodash,
      }
    }
  }

  getStatus?(): Promise<PlatformStatus> {
    throw new Error("getStatus is not implemented.")
  }
  checkConnection?(): Promise<boolean> {
    throw new Error("checkConnection is not implemented.")
  }
  update?(postId: string, post: Post, options?: PublishOptions): Promise<boolean> {
    throw new Error("update is not implemented.")
  }
  delete?(postId: string, options?: PublishOptions): Promise<boolean> {
    throw new Error("delete is not implemented.")
  }
  getPreviewUrl?(postId: string, options?: PublishOptions): Promise<string> {
    throw new Error("getPreviewUrl is not implemented.")
  }
  uploadMedia?(
      file: File,
      options?: { alt?: string; title?: string; description?: string; customFields?: Record<string, any> },
      publishOptions?: PublishOptions,
  ): Promise<{ url: string; id?: string; metadata?: Record<string, any> }> {
    throw new Error("uploadMedia is not implemented.")
  }
  getPlatformType(): PlatformType {
    throw new Error("getPlatformType is not implemented.")
  }
  getSubPlatformType(): SubPlatformType {
    throw new Error("getSubPlatformType is not implemented.")
  }
  getAuthMode(): AuthMode {
    throw new Error("getAuthMode is not implemented.")
  }

  async init(config: Record<string, any>): Promise<void> {
    this.config = { ...this.defaultConfig, ...config }
  }

  async destroy(): Promise<void> {
    this.config = {}
  }

  abstract publish(post: Post, options?: PublishOptions): Promise<PublishResult>

  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    try {
      const required = this.configSchema.required || []

      for (const field of required) {
        if (!config[field]) {
          return {
            valid: false,
            error: `Missing required field: ${field}`,
          }
        }
      }

      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid configuration",
      }
    }
  }
}
