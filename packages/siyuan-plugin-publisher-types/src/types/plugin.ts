/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {BlogConfig, Post} from "zhi-blog-api"
import { HookStage, PluginHook } from "./hooks"
import { AuthMode, PlatformType, SubPlatformType} from "./platform";
import {IPublishConfig} from "./config";
import {BasePlugin} from "../base";

export interface PlatformCapabilities {
  supportsCategories: boolean
  supportsTags: boolean
  supportsCustomFields: boolean
  supportsMediaUpload: boolean
  supportsDraft: boolean
  supportsScheduledPublish: boolean
  supportsCustomTemplates: boolean
  supportsCustomDomain: boolean
  supportsCustomCSS: boolean
  supportsCustomJS: boolean
}

export interface PublishOptions {
  publishConfig: IPublishConfig
  publishAsDraft?: boolean
  scheduledPublishTime?: Date
  customDomain?: string
  customCSS?: string
  customJS?: string
  featuredImage?: string
}

export interface PublishResult {
  success: boolean
  data?: string
  error?: PluginError
}

export interface PluginError extends Error {
  code: string
  message: string
}

export interface PluginLogger {
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
  debug(message: string, ...args: any[]): void
}

export interface PlatformStatus {
  isConnected: boolean
  lastSyncTime?: Date
  quota?: {
    used: number
    total: number
    resetTime?: Date
  }
  limits?: {
    maxPostsPerDay?: number
    maxMediaSize?: number
    maxCustomFields?: number
  }
}

export interface IPlugin {
  // 插件基本信息
  readonly id: string
  readonly name?: string
  readonly group?: string
  readonly version?: string
  readonly description?: string
  readonly author?: string

  // 插件配置
  readonly configSchema?: Record<string, any>
  readonly defaultConfig?: Record<string, any>

  // 智能扩展
  readonly capabilities?: PlatformCapabilities
  readonly logger?: PluginLogger
  getStatus?(): Promise<PlatformStatus>
  checkConnection?(): Promise<boolean>

  // 插件方法
  init?(config: any): Promise<void>
  destroy?(): Promise<void>
  publish(post: Post, options?: PublishOptions): Promise<PublishResult>
  update?(postId: string, post: Post, options?: PublishOptions): Promise<boolean>
  delete?(postId: string, options?: PublishOptions): Promise<boolean>
  getPreviewUrl?(postId: string, options?: PublishOptions): Promise<string>
  uploadMedia?(
    file: File,
    options?: {
      alt?: string
      title?: string
      description?: string
      customFields?: Record<string, any>
    },
    publishOptions?: PublishOptions,
  ): Promise<{
    url: string
    id?: string
    metadata?: Record<string, any>
  }>
  validateConfig?(config: Record<string, any>): {
    valid: boolean
    error?: string
  }

  // Hook 支持
  hooks?: Partial<Record<HookStage, PluginHook>>

  // 通用方法
  getPlatformType(): PlatformType
  getSubPlatformType(): SubPlatformType
  getAuthMode(): AuthMode
  migrateConfig(legencyBlogConfig: BlogConfig, blogConfig: Record<string, any>): void;
}