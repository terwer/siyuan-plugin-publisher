/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SypConfig } from "~/syp.config.ts"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { BlogConfig } from "zhi-blog-api"

/**
 * 表示发布配置的接口
 *
 * @interface IPublishCfg
 * @author terwer
 * @since 1.3.2
 */
interface IPublishCfg {
  /**
   * SypConfig 类型的设置值
   *
   * @type {typeof SypConfig}
   */
  setting: typeof SypConfig

  /**
   * 平台配置集合
   */
  dynamicConfigArray: DynamicConfig[]

  /**
   * BlogConfig 类型的配置对象
   *
   * @type {BlogConfig}
   */
  cfg: BlogConfig

  /**
   * DynamicConfig 类型的动态配置对象
   *
   * @type {DynamicConfig}
   */
  dynCfg: DynamicConfig
}

export type { IPublishCfg }
