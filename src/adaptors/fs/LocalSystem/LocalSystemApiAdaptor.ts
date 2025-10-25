/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { UserBlog } from "zhi-blog-api"

/**
 * 本地系统适配器
 *
 * @author terwer
 * @since 1.38.0
 */
class LocalSystemApiAdaptor extends BaseBlogApi {
  getUsersBlogs(keyword?: string): Promise<Array<UserBlog>> {
    return Promise.resolve([])
  }
}

export { LocalSystemApiAdaptor }
