/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Attachment, MediaObject, PicbedServiceTypeEnum, Post, UserBlog, YamlConvertAdaptor } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import { AstroApiAdaptor } from "~/src/adaptors/api/astro/astroApiAdaptor.ts"
import { AstroYamlConverterAdaptor } from "~/src/adaptors/api/astro/astroYamlConverterAdaptor.ts"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { HexoApiAdaptor } from "~/src/adaptors/api/hexo/hexoApiAdaptor.ts"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"
import { HugoApiAdaptor } from "~/src/adaptors/api/hugo/hugoApiAdaptor.ts"
import { HugoYamlConverterAdaptor } from "~/src/adaptors/api/hugo/hugoYamlConverterAdaptor.ts"
import { JekyllApiAdaptor } from "~/src/adaptors/api/jekyll/jekyllApiAdaptor.ts"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"
import { QuartzApiAdaptor } from "~/src/adaptors/api/quartz/quartzApiAdaptor.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"
import { VitepressApiAdaptor } from "~/src/adaptors/api/vitepress/vitepressApiAdaptor.ts"
import { VitepressYamlConverterAdaptor } from "~/src/adaptors/api/vitepress/vitepressYamlConverterAdaptor.ts"
import { VuepressApiAdaptor } from "~/src/adaptors/api/vuepress/vuepressApiAdaptor.ts"
import { VuepressYamlConverterAdaptor } from "~/src/adaptors/api/vuepress/vuepressYamlConverterAdaptor.ts"
import { Vuepress2ApiAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2ApiAdaptor.ts"
import { Vuepress2YamlConverterAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2YamlConverterAdaptor.ts"
import { FsYamlType } from "~/src/adaptors/fs/LocalSystem/FsYamlType.ts"
import { isLeafBundlePostPath, stripMarkdownExtension, usesLeafBundleForPost } from "~/src/adaptors/api/base/contentLayout.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { LocalSystemYamlConvertAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemYamlConvertAdaptor.ts"
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CATE_AUTO_NAME } from "~/src/utils/constants.ts"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

/**
 * 本地系统适配器
 *
 * @author terwer
 * @since 1.38.0
 */
class LocalSystemApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: LocalSystemConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("local-system-adaptor")
  }

  /**
   * 通用校验逻辑调用
   *
   * @param _keyword
   */
  public async getUsersBlogs(_keyword?: string): Promise<Array<UserBlog>> {
    const localFsCfg = this.cfg as LocalSystemConfig
    // 确保保存路径存在
    const absStorePath = localFsCfg.storePath
    const absImageStorePath = StrUtil.pathJoin(absStorePath, localFsCfg.imageStorePath)
    const isPathOk = EnvUtil.ensurePath(absStorePath, CATE_AUTO_NAME)
    const isImagePathOk = EnvUtil.ensurePath(absImageStorePath, CATE_AUTO_NAME)
    if (!isPathOk || !isImagePathOk) {
      throw new Error("文件存储路径或媒体存储路径初始化失败！")
    }
    return Promise.resolve([])
  }

  /**
   * 获取YAML适配器
   */
  public getYamlAdaptor(): YamlConvertAdaptor {
    const localFsCfg = this.cfg as LocalSystemConfig

    // 根据fsYamlType动态选择YAML适配器
    switch (localFsCfg.fsYamlType) {
      case FsYamlType.Hexo:
        return new HexoYamlConverterAdaptor()
      case FsYamlType.Hugo:
        return new HugoYamlConverterAdaptor()
      case FsYamlType.Jekyll:
        return new JekyllYamlConverterAdaptor()
      case FsYamlType.Vuepress:
        return new VuepressYamlConverterAdaptor()
      case FsYamlType.Vuepress2:
        return new Vuepress2YamlConverterAdaptor()
      case FsYamlType.Vitepress:
        return new VitepressYamlConverterAdaptor()
      case FsYamlType.Quartz:
        return new QuartzYamlConverterAdaptor()
      case FsYamlType.Astro:
        return new AstroYamlConverterAdaptor()
      case FsYamlType.Default:
      default:
        return new LocalSystemYamlConvertAdaptor(localFsCfg)
    }
  }

  /**
   * 创建委派 adaptor 并将媒体上传重定向到本地文件系统
   *
   * 子 adaptor 的完整 preEditPost() 链路照常运行（包括统一图片处理、YAML 格式化、平台收尾逻辑），
   * 但 handlePictures() 中调用的 newMediaObject() 会被重定向到 LocalSystemApiAdaptor 自身的方法，
   * 使图片最终落盘到本地文件系统而非 GitHub。
   */
  private createDelegateAdaptor(fsYamlType: FsYamlType): BaseBlogApi {
    const localFsCfg = this.cfg as LocalSystemConfig
    let delegate: BaseBlogApi

    switch (fsYamlType) {
      case FsYamlType.Hexo:
        delegate = new HexoApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Hugo:
        delegate = new HugoApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Jekyll:
        delegate = new JekyllApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Vuepress:
        delegate = new VuepressApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Vuepress2:
        delegate = new Vuepress2ApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Vitepress:
        delegate = new VitepressApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Quartz:
        delegate = new QuartzApiAdaptor(this.appInstance, localFsCfg as any)
        break
      case FsYamlType.Astro:
        delegate = new AstroApiAdaptor(this.appInstance, localFsCfg as any)
        break
      default:
        throw new Error(`不支持的 fsYamlType: ${fsYamlType}`)
    }

    // 核心修复：将子 adaptor 的媒体上传重定向到本地文件系统
    // handlePictures() 中 this.api.newMediaObject() 将命中此替换方法
    delegate.newMediaObject = this.newMediaObject.bind(this)

    return delegate
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    const localFsCfg = this.cfg as LocalSystemConfig

    // 清空上一次发布的 realStorePath 残留，防止跨文档污染
    localFsCfg.realStorePath = ""

    if (localFsCfg.storePath.includes(CATE_AUTO_NAME)) {
      // 自动分类
      post.cate_slugs = [CATE_AUTO_NAME]
    }

    let updatedPost: Post

    // 判断是否需要委派给子 adaptor
    const knownFsYamlTypes = [
      FsYamlType.Hexo, FsYamlType.Hugo, FsYamlType.Jekyll,
      FsYamlType.Vuepress, FsYamlType.Vuepress2, FsYamlType.Vitepress,
      FsYamlType.Quartz, FsYamlType.Astro,
    ]

    if (knownFsYamlTypes.includes(localFsCfg.fsYamlType)) {
      // 委派给子 adaptor（完整链路），但图片上传重定向到本地文件系统
      const delegate = this.createDelegateAdaptor(localFsCfg.fsYamlType)
      updatedPost = await delegate.preEditPost(post, id, publishCfg)
    } else {
      // 默认走 LocalSystem 自身的 base 链路
      updatedPost = await super.preEditPost(post, id, publishCfg)
    }

    if (updatedPost?.cate_slugs.length > 0) {
      localFsCfg.realStorePath = localFsCfg.storePath.replace(CATE_AUTO_NAME, updatedPost.cate_slugs[0])
    }

    return updatedPost
  }

  public async newPost(post: Post, _publish?: boolean): Promise<string> {
    const originTitle = post.originalTitle
    const content = post.description
    const storePath = this.resolveStorePath(post)

    if (this.isHugoBundlePost(post)) {
      const bundleDir = EnvUtil.joinPath(storePath, this.resolveBundleDirName(post))
      const filePath = EnvUtil.joinPath(bundleDir, "index.md")
      if (!EnvUtil.ensurePath(bundleDir)) {
        this.logger.error(`Failed to create directory: ${bundleDir}`)
        throw new Error(`文档发布到文件系统失败: ${filePath}，请打开开发者工具查看错误日志`)
      }
      if (!EnvUtil.writeFile(filePath, content)) {
        throw new Error(`文档发布到文件系统失败: ${filePath}，请打开开发者工具查看错误日志`)
      }
      return filePath
    }

    // 单文件：storePath/<originTitle>.md
    const fileName = `${EnvUtil.sanitizeFilename(originTitle)}.md`
    const filePath = EnvUtil.joinPath(storePath, fileName)

    let flag = false
    // 确保存储目录存在
    if (EnvUtil.ensurePath(storePath)) {
      // 直接写入文件
      flag = EnvUtil.writeFile(filePath, content)
    } else {
      this.logger.error(`Failed to create directory: ${storePath}`)
    }

    if (!flag) {
      throw new Error(`文档发布到文件系统失败: ${filePath}，请打开开发者工具查看错误日志`)
    }
    return filePath
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    // 页面目录更新沿用原 index.md 所在目录，避免标题变化时写到新目录、旧文件残留
    if (this.isHugoBundlePost(post) && isLeafBundlePostPath(postid)) {
      const filePath = EnvUtil.joinPath(EnvUtil.dirname(postid), "index.md")
      const dirReady = EnvUtil.ensurePath(EnvUtil.dirname(filePath))
      if (!dirReady || !EnvUtil.writeFile(filePath, post.description)) {
        throw new Error(`文档更新到文件系统失败: ${filePath}，请打开开发者工具查看错误日志`)
      }
      return true
    }

    await this.newPost(post, publish)
    return true
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    const localFsCfg = this.cfg as LocalSystemConfig

    // 页面目录：删除 index.md，并清理同目录根级资源（子目录中的自定义资源保留）
    if (this.isHugoBundlePost() && isLeafBundlePostPath(postid)) {
      const bundleDir = EnvUtil.dirname(postid)
      const indexDeleted = EnvUtil.deleteFile(postid)
      for (const entry of EnvUtil.readDir(bundleDir)) {
        if (entry === "index.md") continue
        const filePath = EnvUtil.joinPath(bundleDir, entry)
        if (!EnvUtil.isDirectory(filePath)) {
          EnvUtil.deleteFile(filePath)
        }
      }
      return indexDeleted
    }

    // 仅在 Bundled 图床模式且拿到思源文档 ID 时，通过正式识别管线清理本地资源
    if (localFsCfg.picbedService === PicbedServiceTypeEnum.Bundled && id) {
      const { blogApi } = useSiyuanApi()
      const { getImageItemsFromMd } = usePicgoBridge()

      try {
        const siyuanPost = await blogApi.getPost(id)
        if (siyuanPost?.markdown) {
          // 复用与发布链路 handlePictures 完全一致的图片识别管线
          const imageItems = await getImageItemsFromMd(id, siyuanPost.markdown)
          const imageStorePath = localFsCfg.imageStorePath ?? "assets"

          for (const item of imageItems) {
            if (!item.name) continue
            const absImgPath = StrUtil.pathJoin(StrUtil.pathJoin(localFsCfg.storePath, imageStorePath), item.name)
            EnvUtil.deleteFile(absImgPath)
          }
        }
      } catch (e) {
        // 此处失败不阻断主流程
      }
    }

    // 最后删除 .md 文件
    return EnvUtil.deleteFile(postid)
  }

  public async newMediaObject(mediaObject: MediaObject): Promise<Attachment> {
    const bits = mediaObject.bits
    const localFsCfg = this.cfg as LocalSystemConfig
    const mediaPost = mediaObject.post
    const storePath = this.resolveStorePath(mediaPost)
    const isBundle = this.isHugoBundlePost(mediaPost)

    let absMediaFilePath: string
    let url: string
    let link: string

    if (isBundle) {
      // 页面目录：图片与 index.md 同目录，正文使用相对文件名
      const bundleDir =
        mediaPost?.postid && isLeafBundlePostPath(mediaPost.postid)
          ? EnvUtil.dirname(mediaPost.postid)
          : EnvUtil.joinPath(storePath, this.resolveBundleDirName(mediaPost))
      absMediaFilePath = EnvUtil.joinPath(bundleDir, mediaObject.name)
      url = mediaObject.name
      link = bundleDir
    } else {
      const absImagePath = EnvUtil.joinPath(storePath, localFsCfg.imageStorePath ?? "assets")
      absMediaFilePath = EnvUtil.joinPath(absImagePath, mediaObject.name)
      url = absMediaFilePath.replace(storePath, ".")
      link = storePath
    }

    let flag = false
    if (EnvUtil.ensurePath(EnvUtil.dirname(absMediaFilePath))) {
      // 写入媒体文件
      if (EnvUtil.writeBinaryFile(absMediaFilePath, bits)) {
        flag = true
      }
    }
    if (!flag) {
      throw new Error(`媒体发布到文件系统失败: ${absMediaFilePath}，请打开开发者工具查看错误日志`)
    }
    const id = sypIdUtil.newUuid()
    return {
      attachment_id: id,
      date_created_gmt: new Date(),
      parent: 0,
      link: link,
      title: mediaObject.name,
      caption: "",
      description: "",
      metadata: {
        width: 0,
        height: 0,
        file: url,
        filesize: bits.length,
        sizes: [],
      },
      type: mediaObject.type,
      thumbnail: "",
      id: id,
      file: mediaObject.name,
      url: url,
    }
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    return "file://" + postid
  }

  // ================
  // private methods
  // ================
  /**
   * 当前文章是否按 Hugo 页面目录（Leaf Bundle）导出。
   *
   * 仅 Hugo YAML 类型支持；已发布文章按实际 postid 形态判断，
   * 旧的单文件文章即便平台切到 bundle，更新时仍走单文件。
   */
  private isHugoBundlePost(post?: Post): boolean {
    const localFsCfg = this.cfg as LocalSystemConfig
    return localFsCfg.fsYamlType === FsYamlType.Hugo && usesLeafBundleForPost(localFsCfg as any, post)
  }

  /**
   * 解析本次导出的基础目录（处理 [auto] 与 realStorePath）
   */
  private resolveStorePath(post?: Post): string {
    const localFsCfg = this.cfg as LocalSystemConfig
    let storePath = localFsCfg.storePath
    if (storePath.includes(CATE_AUTO_NAME) && (post?.cate_slugs?.length ?? 0) > 0) {
      // 自动分类场景：优先使用当前文档的分类路径，不信任历史缓存
      storePath = storePath.replace(CATE_AUTO_NAME, post.cate_slugs[0])
    } else if (!StrUtil.isEmptyString(localFsCfg.realStorePath)) {
      // 非自动分类场景，或 post.cate_slugs 不可用时，使用 realStorePath
      storePath = localFsCfg.realStorePath
    }
    return storePath
  }

  /**
   * 页面目录名：沿用本地系统原有的标题命名（LocalSystemConfig 没有文件名规则）
   */
  private resolveBundleDirName(post?: Post): string {
    // LocalSystemConfig 没有文件名规则，Post 的 mdFilename 默认值是 "test"，不能拿来当目录名；
    // 沿用本地系统原有的标题命名，保持与单文件导出一致。
    const raw = post?.originalTitle || post?.title || post?.mdFilename || "untitled"
    const base = raw.split(/[\\/]/).pop() || raw
    return EnvUtil.sanitizeFilename(stripMarkdownExtension(base)) || "untitled"
  }
}

export { LocalSystemApiAdaptor }
