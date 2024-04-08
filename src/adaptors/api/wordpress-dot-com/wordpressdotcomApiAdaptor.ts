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

import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import { UserBlog } from "zhi-blog-api"
import { WordpressdotcomConstants } from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomConstants.ts"

/**
 * WordPress API 适配器
 *
 * @author terwer
 * @version 1.20.0
 * @since 1.20.0
 */
class WordpressdotcomApiAdaptor extends MetaweblogBlogApiAdaptor {
  /**
   * 初始化 WordPress API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: WordpressConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("wordpress-dot-com-api-adaptor")
    this.cfg.blogid = "wordpress-dot-com"
  }

  public override async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []
    result = await this.metaweblogCall(WordpressdotcomConstants.METHOD_GET_USERS_BLOGS, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
    ])
    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  public override async deletePost(postid: string): Promise<boolean> {
    const ret = await this.metaweblogCall(WordpressdotcomConstants.METHOD_DELETE_POST, [
      this.cfg.blogid,
      postid,
      this.cfg.username,
      this.cfg.password,
      false,
    ])
    this.logger.debug("ret=>", ret)

    return ret
  }

  /**
   * WordPress API 调用
   *
   * @param method 方法名
   * @param params 参数
   * @returns 返回值
   */
  protected override async metaweblogCall(method: string, params: any[]) {
    return await this.proxyXmlrpc(this.cfg.apiUrl, method, params, true)
  }
}

export { WordpressdotcomApiAdaptor }
