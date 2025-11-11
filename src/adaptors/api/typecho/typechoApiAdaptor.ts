/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/typechoConfig.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"

/**
 * Typecho API 适配器
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class TypechoApiAdaptor extends MetaweblogBlogApiAdaptor {
  /**
   * 初始化 Typecho API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: TypechoConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("typecho-api-adaptor")
    this.cfg.blogid = "typecho"
  }
}
export { TypechoApiAdaptor }
