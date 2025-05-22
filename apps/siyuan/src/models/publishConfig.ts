/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig } from "zhi-blog-api"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { PlatformType, SubPlatformType } from "siyuan-plugin-publisher-types"

/**
 * 发布配置
 *
 * @author terwer
 * @since 2.0.0
 * @version 2.0.0
 */
class PublishConfig {
  public readonly platformConfig: DynamicConfig
  public readonly blogConfig: Record<string, any>

  constructor(platformConfig?: DynamicConfig, blogConfig?: Record<string, any>) {
    this.platformConfig =
      platformConfig ??
      new DynamicConfig(
        PlatformType.Custom,
        SubPlatformType.NONE,
        SubPlatformType.NONE.toString(),
        SubPlatformType.NONE,
      )

    this.blogConfig = (blogConfig ?? {}) as Record<string, any>
  }
}

export { PublishConfig }
