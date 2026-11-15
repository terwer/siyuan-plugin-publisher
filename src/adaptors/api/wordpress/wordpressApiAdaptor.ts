/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { MediaObject, Post } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import { base64ToBuffer } from "~/src/utils/polyfillUtils.ts"
import { getFeaturedImage, type FeaturedImagePost } from "~/src/utils/featuredImage.ts"

/**
 * WordPress 特色图片（特写图）在 XML-RPC 文章结构里使用的字段名。
 *
 * `metaWeblog.newPost` / `metaWeblog.editPost` 都从 content struct 读取该字段，
 * 值是媒体库里图片附件的 ID；更新时传空值表示清除已设置的特写图。
 */
const WP_POST_THUMBNAIL_FIELD = "wp_post_thumbnail"

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

  public override async newPost(post: Post, publish?: boolean): Promise<string> {
    // 特色图片需要先上传到媒体库拿到附件 ID，再随文章结构一起提交
    await this.prepareFeaturedImage(post)
    return await super.newPost(post, publish)
  }

  public override async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    await this.prepareFeaturedImage(post)
    return await super.editPost(postid, post, publish)
  }

  /**
   * 把特色图片的附件 ID 写进文章结构。
   *
   * @param post - 文章
   * @param postStruct - 已生成的公共字段
   * @param isEdit - 是否为更新已有文章
   */
  protected override extendPostStruct(post: Post, postStruct: Record<string, any>, isEdit: boolean): void {
    const featuredPost = post as FeaturedImagePost
    if (!StrUtil.isEmptyString(featuredPost.featuredImageAttachmentId)) {
      postStruct[WP_POST_THUMBNAIL_FIELD] = featuredPost.featuredImageAttachmentId
      return
    }
    // 用户把已保存的特色图片清空后重新发布：更新时传空值删除特写图。
    // 新建文章不接受空附件 ID，因此只在更新时下发。
    if (isEdit && featuredPost.featuredImageCleared === true) {
      postStruct[WP_POST_THUMBNAIL_FIELD] = ""
    }
  }

  /**
   * 上传特色图片并记录附件 ID。
   *
   * 特色图片是正文之外的附加能力，失败不阻断正文发布：
   * 原因记到文章上并提示用户，正文照常提交。
   *
   * @param post - 文章
   */
  private async prepareFeaturedImage(post: Post): Promise<void> {
    const featuredPost = post as FeaturedImagePost
    featuredPost.featuredImageAttachmentId = undefined
    featuredPost.featuredImageError = undefined

    const featuredImage = getFeaturedImage(post)
    if (StrUtil.isEmptyString(featuredImage)) {
      return
    }

    try {
      featuredPost.featuredImageAttachmentId = await this.uploadFeaturedImage(featuredImage, post)
    } catch (e: any) {
      const message = e?.message || String(e)
      featuredPost.featuredImageError = `特色图片设置失败：${message}`
      this.logger.error("特色图片上传失败", e)
      try {
        await this.baseExtendApi.pushMsg({ msg: featuredPost.featuredImageError, timeout: 7000 })
      } catch (pushError) {
        this.logger.warn("特色图片失败提示推送失败", pushError)
      }
    }
  }

  /**
   * 上传图片到 WordPress 媒体库，返回附件 ID。
   *
   * @param imageUrl - 特色图片地址（http(s) 链接或思源资源相对路径）
   * @param post - 文章
   */
  private async uploadFeaturedImage(imageUrl: string, post: Post): Promise<string> {
    const absoluteUrl = this.resolveImageUrl(imageUrl)
    const base64Info = await this.baseExtendApi.readFileToBase64(absoluteUrl)
    const bits = base64ToBuffer(base64Info.imageBase64)

    const mediaObject = new MediaObject(
      this.toMediaName(base64Info.imageName, base64Info.mimeType),
      base64Info.mimeType,
      bits
    )
    mediaObject.post = post

    const attachment = await this.newMediaObject(mediaObject)
    const attachmentId = attachment?.attachment_id ?? attachment?.id
    if (StrUtil.isEmptyString(attachmentId)) {
      throw new Error("媒体库未返回附件 ID")
    }

    this.logger.info(`特色图片已上传到媒体库，附件 ID => ${attachmentId}`)
    return attachmentId
  }

  /**
   * 把思源资源相对路径补成完整地址，外部链接保持原样。
   *
   * @param url - 特色图片地址
   */
  private resolveImageUrl(url: string): string {
    const trimmed = (url ?? "").trim()
    if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) {
      return trimmed
    }
    return StrUtil.pathJoin(window.location.origin, trimmed.replace(/^\.?\//, ""))
  }

  /**
   * 生成媒体库里的文件名：去掉查询串与锚点，缺省名按图片类型补扩展名。
   *
   * @param name - 原始文件名
   * @param mimeType - 图片类型
   */
  private toMediaName(name: string, mimeType: string): string {
    const rawName = (name ?? "").split("?")[0].split("#")[0].trim()
    let fileName = rawName
    try {
      fileName = decodeURIComponent(rawName)
    } catch {
      // 文件名不是合法的 URI 编码时保持原样
    }

    if (StrUtil.isEmptyString(fileName) || fileName === "unknown-image") {
      const extension = mimeType?.split("/")?.[1] ?? "png"
      fileName = `featured-image-${Date.now()}.${extension.replace(/[^a-z\d]/gi, "") || "png"}`
    }

    return fileName
  }
}

export { WordpressApiAdaptor }
