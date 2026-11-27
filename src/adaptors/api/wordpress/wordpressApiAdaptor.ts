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
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"
import { WordpressConstants } from "~/src/adaptors/api/wordpress/wordpressConstants.ts"
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
 * WordPress XML-RPC 的自定义字段结构。
 *
 * 新建文章时不带 `id`；更新时带已有 meta 的 `id`，WordPress 才会原地更新，
 * 否则 `set_custom_fields` 会走 `add_post_meta` 并产生重复行。
 */
interface WordpressCustomField {
  id?: number | string
  key: string
  value: string
}

/**
 * 发布过程中携带的 WordPress 文章扩展字段。
 *
 * `custom_fields` 来自 `metaWeblog.getPost`；`customFieldsLoaded` 标记是否已经
 * 读取过现有字段，避免在读取失败时盲目新增 `siyuanid` 造成重复。
 */
type WordpressPost = Post & {
  custom_fields?: WordpressCustomField[]
  customFieldsLoaded?: boolean
}

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
    // 更新时先拿到已有 custom_fields，才能按 meta id 原地更新 siyuanid；
    // 正常单发/编辑流程已通过 metaWeblog.getPost 合并过平台文章，这里兼容快速发布等未合并的场景。
    await this.ensureCustomFields(post, postid)
    return await super.editPost(postid, post, publish)
  }

  /**
   * 追加 WordPress 平台私有字段：特色图片 + 来源思源文档 ID。
   *
   * @param post - 文章
   * @param postStruct - 已生成的公共字段
   * @param isEdit - 是否为更新已有文章
   */
  protected override extendPostStruct(post: Post, postStruct: Record<string, any>, isEdit: boolean): void {
    const featuredPost = post as FeaturedImagePost
    if (!StrUtil.isEmptyString(featuredPost.featuredImageAttachmentId)) {
      postStruct[WP_POST_THUMBNAIL_FIELD] = featuredPost.featuredImageAttachmentId
    } else if (isEdit && featuredPost.featuredImageCleared === true) {
      // 用户把已保存的特色图片清空后重新发布：更新时传空值删除特写图。
      // 新建文章不接受空附件 ID，因此只在更新时下发。
      postStruct[WP_POST_THUMBNAIL_FIELD] = ""
    }

    this.extendSourceIdMeta(post, postStruct, isEdit)
  }

  /**
   * 把思源文档 ID 作为 `siyuanid` 自定义字段写入文章结构。
   *
   * - 新建文章：直接追加，由 WordPress 创建 post meta。
   * - 更新文章：只有拿到已有 custom_fields 后才写入；已有 `siyuanid` 时带 meta id
   *   原地更新，避免每次发布都 add_post_meta 产生重复行。读取失败时跳过，不盲目新增。
   * - 没有来源文档 ID 时什么都不写，不伪造空值。
   *
   * @param post - 文章
   * @param postStruct - 已生成的公共字段
   * @param isEdit - 是否为更新已有文章
   */
  private extendSourceIdMeta(post: Post, postStruct: Record<string, any>, isEdit: boolean): void {
    const sourceDocId = this.getSourceDocId(post)
    if (StrUtil.isEmptyString(sourceDocId)) {
      return
    }

    const wordpressPost = post as WordpressPost
    const customFields = wordpressPost.custom_fields
    const fieldsLoaded = wordpressPost.customFieldsLoaded === true || Array.isArray(customFields)
    if (isEdit && !fieldsLoaded) {
      this.logger.warn("未获取到 WordPress 现有自定义字段，跳过 siyuanid 写入以避免重复")
      return
    }

    const existing = (customFields ?? []).filter((field) => field?.key === WordpressConstants.SIYUAN_ID_META_KEY)
    if (existing.length > 0) {
      const updatable = existing.filter((field) => field.id !== undefined && field.id !== null)
      if (updatable.length === 0) {
        this.logger.warn("现有 siyuanid 自定义字段缺少 meta id，跳过写入以避免重复")
        return
      }
      postStruct.custom_fields = updatable.map((field) => ({
        id: field.id,
        key: WordpressConstants.SIYUAN_ID_META_KEY,
        value: sourceDocId,
      }))
      return
    }

    postStruct.custom_fields = [{ key: WordpressConstants.SIYUAN_ID_META_KEY, value: sourceDocId }]
  }

  /**
   * 更新文章前补齐已有 custom_fields。
   *
   * `metaWeblog.getPost` 会返回 `custom_fields`（含 meta id），但快速发布等路径
   * 可能没有先合并平台文章；这里按需读取一次。读取失败时保留未加载标记，
   * `extendSourceIdMeta` 会跳过写入，避免产生重复的 siyuanid 行。
   *
   * @param post - 文章
   * @param postid - 平台文章 ID
   */
  private async ensureCustomFields(post: Post, postid: string): Promise<void> {
    if (StrUtil.isEmptyString(this.getSourceDocId(post))) {
      return
    }

    const wordpressPost = post as WordpressPost
    if (Array.isArray(wordpressPost.custom_fields)) {
      wordpressPost.customFieldsLoaded = true
      return
    }

    try {
      const platformPost = (await this.metaweblogCall(MetaweblogConstants.METHOD_GET_POST, [
        postid,
        this.cfg.username,
        this.cfg.password,
      ])) as { custom_fields?: WordpressCustomField[] } | null
      if (Array.isArray(platformPost?.custom_fields)) {
        wordpressPost.custom_fields = platformPost.custom_fields
        wordpressPost.customFieldsLoaded = true
      }
    } catch (e: any) {
      this.logger.warn(`读取 WordPress 自定义字段失败，跳过 siyuanid 写入：${e?.message ?? e}`)
    }
  }

  /**
   * 读取来源思源文档 ID。
   *
   * 发布链路中 `post.originalId` 由 SiYuanApiAdaptor 设置为源文档 root_id，
   * 并在单发、批量、快速发布中保留；`post.postid` 会被平台文章 ID 覆盖，不能用于此目的。
   *
   * @param post - 文章
   */
  private getSourceDocId(post: Post): string {
    const sourceDocId = post.originalId
    return StrUtil.isEmptyString(sourceDocId) ? "" : String(sourceDocId).trim()
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

    // 图片自动上传策略命中跳过时（issue #2040），特色图片同样不自动上传
    if ((post as any).imageUploadSkipped === true) {
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
        // 此处失败不阻断主流程
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
