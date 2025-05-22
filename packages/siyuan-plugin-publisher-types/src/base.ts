import { BlogConfig, Post } from "zhi-blog-api"
import { ModuleLogger } from "./logger"
import { PluginApi } from "./types/global"
import { HookStage, PluginHook } from "./types/hooks"
import { AuthMode, PlatformType, SubPlatformType } from "./types/platform"
import {
  IPlugin,
  PlatformCapabilities,
  PlatformStatus,
  PluginLogger,
  PublishOptions,
  PublishResult,
} from "./types/plugin"
import { mountPtAttr } from "./util"
import { IPublishConfig } from "./types/config"

const baseI18n = {
  zh_CN: {
    name: "插件",
    description: "描述",
    author: "作者",
    version: "版本",
    errors: {
      notImplemented: "未实现",
      missingRequiredField: "缺少必填字段: {field}",
      invalidConfig: "无效的配置",
      getStatus: "getStatus 未实现",
      checkConnection: "checkConnection 未实现",
      update: "update 未实现",
      delete: "delete 未实现",
      getPreviewUrl: "getPreviewUrl 未实现",
      uploadMedia: "uploadMedia 未实现",
      getPlatformType: "getPlatformType 未实现",
      getSubPlatformType: "getSubPlatformType 未实现",
      getAuthMode: "getAuthMode 未实现"
    },
    platform: {
      common: "通用",
      unknown: "未知"
    }
  },
  en_US: {
    name: "Plugin",
    description: "Description",
    author: "Author",
    version: "Version",
    errors: {
      notImplemented: "Not implemented",
      missingRequiredField: "Missing required field: {field}",
      invalidConfig: "Invalid configuration",
      getStatus: "getStatus is not implemented",
      checkConnection: "checkConnection is not implemented",
      update: "update is not implemented",
      delete: "delete is not implemented",
      getPreviewUrl: "getPreviewUrl is not implemented",
      uploadMedia: "uploadMedia is not implemented",
      getPlatformType: "getPlatformType is not implemented",
      getSubPlatformType: "getSubPlatformType is not implemented",
      getAuthMode: "getAuthMode is not implemented"
    },
    platform: {
      common: "Common",
      unknown: "Unknown"
    }
  }
}

export abstract class BasePlugin implements IPlugin {
  readonly id: string = this.constructor.name
  readonly name: string = this.constructor.name
  readonly group: string = "unknown"
  readonly version: string = "unknown"
  readonly description: string = "unknown"
  readonly author: string = "unknown"
  readonly platformType: PlatformType = PlatformType.Common
  readonly subPlatformType: SubPlatformType = SubPlatformType.NONE
  readonly authMode: AuthMode = AuthMode.NONE

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
    supportsCustomJS: false,
  }
  public readonly configSchema: Record<string, any> = {}
  public readonly defaultConfig: Record<string, any> = {}

  readonly logger: PluginLogger
  readonly hooks: Partial<Record<HookStage, PluginHook>> = {}
  readonly api: PluginApi

  private getI18n() {
    const lang = window.pt.api.siyuan.config.lang || "zh_CN"
    this.logger.info(`get i18n lang from base plugin: ${lang}`)
    // @ts-ignore
    return baseI18n[lang] || baseI18n.zh_CN
  }

  constructor(id: string) {
    const pluginId = id ?? this.id
    this.logger = new ModuleLogger(pluginId)
    this.api = {
      siyuan: window.pt.api.siyuan,
      util: {
        fetch: window.pt.api.util.fetch,
        Lodash: window.pt.api.util.Lodash,
        StrUtil: window.pt.api.util.StrUtil,
      },
    }
    mountPtAttr(`plugins.${pluginId}`, this)
  }

  getStatus?(): Promise<PlatformStatus> {
    const t = this.getI18n()
    throw new Error(t.errors.getStatus)
  }
  checkConnection?(): Promise<boolean> {
    const t = this.getI18n()
    throw new Error(t.errors.checkConnection)
  }
  update?(postId: string, post: Post, options?: PublishOptions): Promise<boolean> {
    const t = this.getI18n()
    throw new Error(t.errors.update)
  }
  delete?(postId: string, options?: PublishOptions): Promise<boolean> {
    const t = this.getI18n()
    throw new Error(t.errors.delete)
  }
  getPreviewUrl?(postId: string, options?: PublishOptions): Promise<string> {
    const t = this.getI18n()
    throw new Error(t.errors.getPreviewUrl)
  }
  uploadMedia?(
      file: File,
      options?: { alt?: string; title?: string; description?: string; customFields?: Record<string, any> },
      publishOptions?: PublishOptions,
  ): Promise<{ url: string; id?: string; metadata?: Record<string, any> }> {
    const t = this.getI18n()
    throw new Error(t.errors.uploadMedia)
  }
  getPlatformType(): PlatformType {
    const t = this.getI18n()
    throw new Error(t.errors.getPlatformType)
  }
  getSubPlatformType(): SubPlatformType {
    const t = this.getI18n()
    throw new Error(t.errors.getSubPlatformType)
  }
  getAuthMode(): AuthMode {
    const t = this.getI18n()
    throw new Error(t.errors.getAuthMode)
  }

  async init(config: Record<string, any>): Promise<void> {
    this.config = { ...this.defaultConfig, ...config }
  }

  async getMetaData(publishCfg: IPublishConfig): Promise<{ flag: boolean; data: any, error?: string }> {
    return { flag: true, data: {} }
  }

  async destroy(): Promise<void> {
    this.config = {}
  }

  abstract publish(post: Post, options?: PublishOptions): Promise<PublishResult>

  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    try {
      const util = this.api.util
      const required = this.configSchema.required || []
      const t = this.getI18n()

      for (const field of required) {
        const value = config[field]
        if(util.StrUtil.isEmptyString(value)) {
          const fieldDisplayName = this.configSchema?.properties?.[field]?.title ?? field
          return {
            valid: false,
            error: t.errors.missingRequiredField.replace("{field}", fieldDisplayName),
          }
        }
      }

      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : this.getI18n().errors.invalidConfig,
      }
    }
  }

  migrateConfig(legencyBlogConfig: BlogConfig, blogConfig: Record<string, any>): void {}

  protected migrateField<T extends keyof typeof BlogConfig>(
      blogConfig: any,
      legencyBlogConfig: BlogConfig,
      field: string,
      legacyFieldKey: keyof BlogConfig
  ): void {
    const util = this.api.util
    if (
        util.StrUtil.isEmptyString(blogConfig[field]) &&
        !util.StrUtil.isEmptyString(legencyBlogConfig[legacyFieldKey])
    ) {
      blogConfig[field] = legencyBlogConfig[legacyFieldKey] as any
    }
  }
}
