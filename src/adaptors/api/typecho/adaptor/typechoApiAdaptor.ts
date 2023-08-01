/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { BlogApi, UserBlog } from "zhi-blog-api"
import { CommonXmlrpcClient } from "zhi-xmlrpc-middleware"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/config/typechoConfig.ts"
import { TypechoConstants } from "~/src/adaptors/api/typecho/typechoConstants.ts"

/**
 * WordPress API 适配器
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class TypechoApiAdaptor extends BlogApi {
  private readonly logger
  private readonly cfg: TypechoConfig
  private readonly commonXmlrpcClient

  /**
   * 初始化 WordPress API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: AppInstance, cfg: TypechoConfig) {
    super()

    this.cfg = cfg
    this.logger = createAppLogger("typecho-api-adaptor")
    this.commonXmlrpcClient = new CommonXmlrpcClient(appInstance, cfg.apiUrl)
  }

  public override async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []
    result = await this.typechoCall(TypechoConstants.METHOD_GET_USERS_BLOGS, [])
    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  private async typechoCall(method: string, params: string[]) {
    const parameters = ["typecho", this.cfg.username, this.cfg.password]
    params.forEach((param) => parameters.push(param))
    return await this.commonXmlrpcClient.methodCall(method, parameters, this.cfg.middlewareUrl)
  }
}
export { TypechoApiAdaptor }
