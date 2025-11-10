/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { JvueConfig } from "~/src/adaptors/api/jvue/jvueConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * Typecho API 适配器
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class JvueApiAdaptor extends MetaweblogBlogApiAdaptor {
  /**
   * 初始化 Typecho API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: JvueConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("typecho-api-adaptor")
    this.cfg.blogid = "jvue"
  }
}

export { JvueApiAdaptor }
