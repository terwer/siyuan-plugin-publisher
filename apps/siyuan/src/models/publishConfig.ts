/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig } from "zhi-blog-api"
import { DynamicConfig, PlatformType, SubPlatformType } from "@/models/dynamicConfig.ts"

/**
 * 发布配置
 *
 * @author terwer
 * @since 2.0.0
 * @version 2.0.0
 */
class PublishConfig {
  public readonly platformConfig: DynamicConfig
  public readonly blogConfig: BlogConfig

  constructor(platformConfig?: DynamicConfig, blogConfig?: BlogConfig) {
    this.platformConfig =
      platformConfig ??
      new DynamicConfig(
        PlatformType.Custom,
        SubPlatformType.NONE,
        SubPlatformType.NONE.toString(),
        SubPlatformType.NONE,
      )

    this.blogConfig = blogConfig ?? this.createDefaultBlogConfig()
  }

  private createDefaultBlogConfig(): BlogConfig {
    return {} as BlogConfig
  }
}

export { PublishConfig }
