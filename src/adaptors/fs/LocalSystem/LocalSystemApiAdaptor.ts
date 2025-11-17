/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { Attachment, MediaObject, Post, UserBlog, YamlConvertAdaptor } from "zhi-blog-api"
import { LocalSystemYamlConvertAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemYamlConvertAdaptor.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { FsYamlType } from "~/src/adaptors/fs/LocalSystem/FsYamlType.ts"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"
import { HugoYamlConverterAdaptor } from "~/src/adaptors/api/hugo/hugoYamlConverterAdaptor.ts"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"
import { VuepressYamlConverterAdaptor } from "~/src/adaptors/api/vuepress/vuepressYamlConverterAdaptor.ts"
import { Vuepress2YamlConverterAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2YamlConverterAdaptor.ts"
import { VitepressYamlConverterAdaptor } from "~/src/adaptors/api/vitepress/vitepressYamlConverterAdaptor.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"
import { StrUtil } from "zhi-common"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"
import { CATE_AUTO_NAME } from "~/src/utils/constants.ts"
import { VuepressApiAdaptor } from "~/src/adaptors/api/vuepress/vuepressApiAdaptor.ts"
import { Vuepress2ApiAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2ApiAdaptor.ts"
import { HexoApiAdaptor } from "~/src/adaptors/api/hexo/hexoApiAdaptor.ts"
import { HugoApiAdaptor } from "~/src/adaptors/api/hugo/hugoApiAdaptor.ts"
import { JekyllApiAdaptor } from "~/src/adaptors/api/jekyll/jekyllApiAdaptor.ts"
import { VitepressApiAdaptor } from "~/src/adaptors/api/vitepress/vitepressApiAdaptor.ts"
import { QuartzApiAdaptor } from "~/src/adaptors/api/quartz/quartzApiAdaptor.ts"

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
    this.logger.debug("Ensure that the save path exists1...", localFsCfg)
    const absStorePath = localFsCfg.storePath
    const absImageStorePath = StrUtil.pathJoin(absStorePath, localFsCfg.imageStorePath)
    const isPathOk = EnvUtil.ensurePath(absStorePath)
    const isImagePathOk = EnvUtil.ensurePath(absImageStorePath)
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
        this.logger.info("使用 Hexo YAML 适配器")
        return new HexoYamlConverterAdaptor()
      case FsYamlType.Hugo:
        this.logger.info("使用 Hugo YAML 适配器")
        return new HugoYamlConverterAdaptor()
      case FsYamlType.Jekyll:
        this.logger.info("使用 Jekyll YAML 适配器")
        return new JekyllYamlConverterAdaptor()
      case FsYamlType.Vuepress:
        this.logger.info("使用 VuePress YAML 适配器")
        return new VuepressYamlConverterAdaptor()
      case FsYamlType.Vuepress2:
        this.logger.info("使用 VuePress2 YAML 适配器")
        return new Vuepress2YamlConverterAdaptor()
      case FsYamlType.Vitepress:
        this.logger.info("使用 VitePress YAML 适配器")
        return new VitepressYamlConverterAdaptor()
      case FsYamlType.Quartz:
        this.logger.info("使用 Quartz YAML 适配器")
        return new QuartzYamlConverterAdaptor()
      case FsYamlType.Default:
      default:
        this.logger.info("使用默认 YAML 适配器")
        return new LocalSystemYamlConvertAdaptor(localFsCfg)
    }
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    const localFsCfg = this.cfg as LocalSystemConfig

    if (localFsCfg.storePath.includes(CATE_AUTO_NAME)) {
      // 自动分类
      post.cate_slugs = [CATE_AUTO_NAME]
    }

    let updatedPost: Post

    // 自定义预处理
    switch (localFsCfg.fsYamlType) {
      case FsYamlType.Hexo: {
        const hexoApiAdaptor = new HexoApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await hexoApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      case FsYamlType.Hugo: {
        const hugoApiAdaptor = new HugoApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await hugoApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      case FsYamlType.Jekyll: {
        const jekyllApiAdaptor = new JekyllApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await jekyllApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      case FsYamlType.Vuepress: {
        const vuepressApiAdaptor = new VuepressApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await vuepressApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      case FsYamlType.Vuepress2: {
        const vuepress2ApiAdaptor = new Vuepress2ApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await vuepress2ApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      case FsYamlType.Vitepress: {
        const vitepressApiAdaptor = new VitepressApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await vitepressApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      case FsYamlType.Quartz: {
        const quartzApiAdaptor = new QuartzApiAdaptor(this.appInstance, localFsCfg as any)
        updatedPost = await quartzApiAdaptor.preEditPost(post, id, publishCfg)
        break
      }
      default: {
        updatedPost = await super.preEditPost(post, id, publishCfg)
        break
      }
    }

    if (updatedPost?.cate_slugs.length > 0) {
      localFsCfg.storePath = localFsCfg.storePath.replace(CATE_AUTO_NAME, updatedPost.cate_slugs[0])
    }

    return updatedPost
  }

  public async newPost(post: Post, _publish?: boolean): Promise<string> {
    const localFsCfg = this.cfg as LocalSystemConfig

    const title = post.title
    // const slug = post.wp_slug
    const content = post.description
    // const yaml = post.yaml

    // 保存到文件
    // 文件路径是 localFsCfg.storePath
    // 文件名是 title.md
    // 文件内容是 content
    // 清理文件名并添加扩展名
    const fileName = `${EnvUtil.sanitizeFilename(title)}.md`
    const filePath = EnvUtil.joinPath(localFsCfg.storePath, fileName)

    let flag = false
    // 确保存储目录存在
    if (EnvUtil.ensurePath(localFsCfg.storePath)) {
      // 直接写入文件
      flag = EnvUtil.writeFile(filePath, content)
      this.logger.info(`Post saved locally: ${filePath}`)
    } else {
      this.logger.error(`Failed to create directory: ${localFsCfg.storePath}`)
    }

    if (!flag) {
      throw new Error(`文档发布到文件系统失败: ${filePath}，请打开开发者工具查看错误日志`)
    }
    return filePath
  }

  public async editPost(_postid: string, post: Post, publish?: boolean): Promise<boolean> {
    await this.newPost(post, publish)
    return true
  }

  public async deletePost(postid: string): Promise<boolean> {
    return EnvUtil.deleteFile(postid)
  }

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    const bits = mediaObject.bits
    const localFsCfg = this.cfg as LocalSystemConfig
    // 确保保存路径存在
    this.logger.debug("Ensure that the save path exists1...", localFsCfg)
    const absStorePath = localFsCfg.storePath
    const absImagePath = StrUtil.pathJoin(absStorePath, localFsCfg.imageStorePath ?? "assets")
    let absMediaFilePath = StrUtil.pathJoin(absImagePath, mediaObject.name)
    const fileDir = EnvUtil.dirname(absMediaFilePath)

    let flag = false
    if (EnvUtil.ensurePath(fileDir)) {
      // 写入媒体文件
      if (EnvUtil.writeBinaryFile(absMediaFilePath, bits)) {
        flag = true
        this.logger.info(`media saved: ${absMediaFilePath}`)
      }
    }
    if (!flag) {
      throw new Error(`媒体发布到文件系统失败: ${absMediaFilePath}，请打开开发者工具查看错误日志`)
    }
    const id = sypIdUtil.newUuid()
    const url = absMediaFilePath.replace(absStorePath, ".")
    return {
      attachment_id: id,
      date_created_gmt: new Date(),
      parent: 0,
      link: absStorePath,
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
}

export { LocalSystemApiAdaptor }
