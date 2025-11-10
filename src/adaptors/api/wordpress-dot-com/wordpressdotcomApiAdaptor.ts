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
