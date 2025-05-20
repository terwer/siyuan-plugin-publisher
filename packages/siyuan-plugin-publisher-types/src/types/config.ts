/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig } from "zhi-blog-api"
import {IDynamicConfig} from "./dynamic"

/**
 * 发布配置接口
 *
 * @interface IPublishConfig
 */
export interface IPublishConfig {
  /**
   * 平台配置
   */
  readonly platformConfig: IDynamicConfig

  /**
   * 博客配置
   */
  readonly blogConfig: BlogConfig
}

/**
 * 插件配置接口
 */
export interface IPluginConfig {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  configSchema?: Record<string, any>
  defaultConfig?: Record<string, any>
} 