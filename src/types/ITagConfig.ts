/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig } from "zhi-blog-api"

/**
 * 标签接口配置
 *
 * @author terwer
 * @since 1.9.0
 */
interface ITagConfig {
  /**
   * API类型
   */
  apiType?: string

  /**
   * 平台配置
   */
  cfg?: BlogConfig
}

export { type ITagConfig }
