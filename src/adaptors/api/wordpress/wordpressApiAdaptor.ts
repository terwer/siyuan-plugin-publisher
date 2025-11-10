/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"

/**
 * WordPress API 适配器
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class WordpressApiAdaptor extends MetaweblogBlogApiAdaptor {
  /**
   * 初始化 WordPress API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: WordpressConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("wordpress-api-adaptor")
    this.cfg.blogid = "wordpress"
  }
}

export { WordpressApiAdaptor }
