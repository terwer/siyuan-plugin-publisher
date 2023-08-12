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

import {MediaObject, Post, UserBlog} from "zhi-blog-api"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CnblogsConstants } from "~/src/adaptors/api/cnblogs/cnblogsConstants.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import {usePicgoBridge} from "~/src/composables/usePicgoBridge.ts";

/**
 * 博客园 API 适配器
 *
 * @see [博客园 API 文档](https://rpc.cnblogs.com/metaweblog/tangyouwei)
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CnblogsApiAdaptor extends MetaweblogBlogApiAdaptor {
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

  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // const pubCfg = publishCfg as IPublishCfg
    // 找到所有的图片
    const { getImageItemsFromMd } = usePicgoBridge()
    const images = await getImageItemsFromMd(id, post.markdown)
    if (images.length === 0) {
      this.logger.info("未找到图片，不处理")
      return post
    }
    // 批量处理图片上传
    this.logger.info(`找到${images.length}张图片，开始上传`)

    for (const image of images) {
      const imageBlob = await this.readFileToBlob(image.url)
      this.logger.debug("read blob from image", { imageBlob })
      const file = new File([imageBlob], image.name, { type: imageBlob.type, lastModified: Date.now() })
      this.logger.debug("convert blob to file", { imageBlob })

      const mediaObject = new MediaObject(image.name, imageBlob.type, file as any)
      const attachResult = await this.newMediaObject(mediaObject)
      this.logger.debug("attachResult =>", attachResult)
      throw new Error("开发中")
    }

    this.logger.info("图片全部上传完成")
    return post
  }


  public async newPost(post: Post, publish?: boolean): Promise<string> {
    // 设置markdown分类
    post = this.assignMdCategory(post)
    return super.newPost(post, publish)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    // 设置markdown分类
    post = this.assignMdCategory(post)
    return super.editPost(postid, post, publish)
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

  private assignMdCategory(post: Post) {
    const MD_CATEGORY = "[Markdown]"
    const cats = post.categories ?? []

    if (cats.length === 0 || cats.some((cat) => cat.toLowerCase() === MD_CATEGORY.toLowerCase())) {
      cats.push(MD_CATEGORY)
    }

    return post
  }
}
export { CnblogsApiAdaptor }
