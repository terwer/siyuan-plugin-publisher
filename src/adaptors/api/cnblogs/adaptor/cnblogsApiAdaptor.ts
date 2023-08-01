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

import { UserBlog } from "zhi-blog-api"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/config/cnblogsConfig.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CnblogsConstants } from "~/src/adaptors/api/cnblogs/cnblogsConstants.ts"
import { MetaweblogBlogApi } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApi.ts"
import { StrUtil } from "zhi-common"

/**
 * 博客园 API 适配器
 *
 * @see [博客园 API 文档](https://rpc.cnblogs.com/metaweblog/tangyouwei)
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CnblogsApiAdaptor extends MetaweblogBlogApi {
  /**
   * 初始化博客园 API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: AppInstance, cfg: CnblogsConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("cnblogs-api-adaptor")
    this.cfg.blogid = "cnblogs"
  }

  public override async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []
    result = await this.metaweblogCall(CnblogsConstants.METHOD_GET_USERS_BLOGS, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
    ])
    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  public override async getPreviewUrl(postid: string): Promise<string> {
    const previewUrl = this.cfg.previewUrl.replace(/\[postid\]/g, postid)
    return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
  }

  public override async deletePost(postid: string): Promise<boolean> {
    const ret = await this.metaweblogCall(CnblogsConstants.METHOD_DELETE_POST, [
      this.cfg.blogid,
      postid,
      this.cfg.username,
      this.cfg.password,
      false,
    ])
    this.logger.debug("ret=>", ret)

    return ret
  }
}
export { CnblogsApiAdaptor }
