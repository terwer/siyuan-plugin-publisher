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

import { IBlogApi } from "zhi-blog-api/dist/lib/IBlogApi"
import { IWebApi } from "zhi-blog-api/dist/lib/IWebApi"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { MediaObject, Post, WebApi } from "zhi-blog-api"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { LuteUtil } from "~/src/utils/luteUtil.ts"
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { base64ToBuffer, remoteImageToBase64Info } from "~/src/utils/polyfillUtils.ts"

/**
 * 各种模式共享的扩展基类
 *
 * @author terwer
 * @since 1.8.0
 */
class BaseExtendApi extends WebApi implements IBlogApi, IWebApi {
  private readonly logger: ILogger
  private readonly api: BaseBlogApi | BaseWebApi
  protected readonly picgoBridge: any

  constructor(api: BaseBlogApi | BaseWebApi) {
    super()
    this.logger = createAppLogger("base-extend-api")
    this.api = api

    this.picgoBridge = usePicgoBridge()
  }

  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    const cfg: CommonBlogConfig = publishCfg.cfg

    // const unsupportedPicturePlatform = ["custom_Zhihu","common_notion"]，判断key包含zhihu、notion，custom_Zhihu 或者 /custom_Zhihu-\w+/
    // PictureStoreTypeEnum.Picgo 先检测是否安装了Picgo插件，如果设置了图片存储方式 PicGO图床 类型就使用 PicGO图床 上传
    // PictureStoreTypeEnum.Platform or key in unsupportedPicturePlatform 如果设置了图片存储方式为 平台存储 类型或者 知乎、Notion等不兼容链接方式的平台，就使用 平台特定的存储方式 上传
    // PictureStoreTypeEnum.Default 默认不处理，即使用 思源笔记图床 上传

    // ==========================
    // 使用 PicGO上传图片
    // ==========================
    // 图片替换
    this.logger.debug("开始图片处理, post =>", { post })
    post.markdown = await this.picgoBridge.handlePicgo(id, post.markdown)
    // 利用 lute 把 md 转换成 html
    post.html = LuteUtil.mdToHtml(post.markdown)
    this.logger.debug("图片处理完毕, post.markdown =>", { md: post.markdown })

    // ==========================
    // 使用平台上传图片
    // ==========================
    // 找到所有的图片
    const images = await this.picgoBridge.getImageItemsFromMd(id, post.markdown)
    if (images.length === 0) {
      this.logger.info("未找到图片，不处理")
      return post
    }
    // 批量处理图片上传
    this.logger.info(`找到${images.length}张图片，开始上传`)
    for (const image of images) {
      const imageUrl = image.url
      const base64Info = await remoteImageToBase64Info(imageUrl)
      const bits = base64ToBuffer(base64Info.imageBase64)
      const mediaObject = new MediaObject(image.name, base64Info.mimeType, bits)
      this.logger.debug("before upload, mediaObject =>", mediaObject)
      const attachResult = await this.newMediaObject(mediaObject)
      this.logger.debug("attachResult =>", attachResult)
      throw new Error("开发中")
    }

    this.logger.info("图片全部上传完成")
    return post
  }
}

export { BaseExtendApi }
