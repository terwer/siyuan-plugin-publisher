/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Attachment, CategoryInfo, MediaObject, Post, PostStatusEnum, UserBlog } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"
import { StrUtil } from "zhi-common"
import { BrowserUtil } from "zhi-device"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { useProxy } from "~/src/composables/useProxy.ts"
import HostSessionFetchUtil from "~/src/utils/HostSessionFetchUtil.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

/**
 * MetaweblogBlogApi 类继承自 BaseBlogApi 类，并为 Metaweblog API 提供了额外的功能
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class MetaweblogBlogApiAdaptor extends BaseBlogApi {
  protected readonly proxyXmlrpc: any

  /** 宿主会话就绪的幂等 Promise（仅平台声明走宿主会话直传时使用） */
  private hostSessionReadyPromise?: Promise<boolean>

  /** 本平台是否声明走宿主会话直传（基类持有的 cfg 为通用类型，故在构造时固化一次） */
  private readonly isHostSessionFetch: boolean

  /**
   * 初始化 metaweblog API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: any, cfg: MetaweblogConfig) {
    super(appInstance, cfg)

    this.cfg.blogid = "metaweblog"
    this.logger = createAppLogger("metaweblog-api-adaptor")
    this.isHostSessionFetch = cfg.isHostSessionFetch
    const { proxyXmlrpc } = useProxy(
      cfg.middlewareUrl,
      cfg.corsAnywhereUrl,
      cfg.isCorsProxy,
      cfg.isHostSessionFetch,
    )
    this.proxyXmlrpc = proxyXmlrpc
  }

  public async checkAuth(): Promise<boolean> {
    return true
  }

  public override async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []
    result = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_USERS_BLOGS, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
    ])
    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  /**
   * Not supported
   *
   * @param keyword
   */
  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return 0
  }

  public async getRecentPosts(numOfPosts: number): Promise<Post[]> {
    const result: Post[] = []
    const blogPosts = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_RECENT_POSTS, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
      numOfPosts,
    ])

    for (let i = 0; i < blogPosts.length; i++) {
      const blogPost = blogPosts[i]

      // 适配公共属性
      const commonPost = new Post()
      commonPost.postid = blogPost.postid
      commonPost.title = blogPost.title
      commonPost.mt_keywords = blogPost.mt_keywords
      commonPost.permalink = blogPost.permalink
      commonPost.description = blogPost.description
      commonPost.wp_slug = blogPost.wp_slug
      commonPost.dateCreated = blogPost.dateCreated
      commonPost.categories = blogPost.categories
      result.push(commonPost)
    }

    return result
  }

  public async getPost(postid: string): Promise<Post> {
    const data = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_POST, [
      postid,
      this.cfg.username,
      this.cfg.password,
    ])
    return data
  }

  /**
   * 新建文章
   *
   * @param post - 文章
   * @param publish - 可选，不传递时按文章自身状态推导：草稿存为草稿，其余直接发布
   */
  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const shouldPublish = this.resolvePublishFlag(post, publish)
    this.applyPostStatus(post, shouldPublish)

    const postStruct = this.createPostStruct(post, false)
    this.logger.debug("postStruct=>", postStruct)
    let ret = await this.metaweblogCall(MetaweblogConstants.METHOD_NEW_POST, [
      this.cfg.blogid,
      this.cfg.username,
      this.cfg.password,
      postStruct,
      shouldPublish,
    ])
    ret = ret + ""
    ret = ret.replace(/"/g, "")
    this.logger.debug("ret=>", ret)

    return ret
  }

  /**
   * 编辑文章
   *
   * @param postid - 文章ID
   * @param post - 文章
   * @param publish - 可选，不传递时按文章自身状态推导：草稿存为草稿，其余直接发布
   */
  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const shouldPublish = this.resolvePublishFlag(post, publish)
    this.applyPostStatus(post, shouldPublish)

    const postStruct = this.createPostStruct(post, true)
    this.logger.debug("postStruct=>", postStruct)
    const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_EDIT_POST, [
      postid,
      this.cfg.username,
      this.cfg.password,
      postStruct,
      shouldPublish,
    ])
    this.logger.debug("ret=>", ret)
    return ret
  }

  /**
   * 解析 MetaWeblog 的 `publish` 参数。
   *
   * `metaWeblog.newPost` / `metaWeblog.editPost` 用这个布尔参数区分「直接发布」与「存草稿」，
   * 而文章结构里的 `post_status` 并非所有站点都会读取（博客园等站点只认这个布尔参数）。
   * 调用方没有显式指定时，必须由界面上选择的状态推导出来，否则「草稿」会被当成「发布」。
   *
   * @param post - 文章
   * @param publish - 调用方显式指定的发布标记
   * @private
   */
  private resolvePublishFlag(post: Post, publish?: boolean): boolean {
    if (publish !== undefined) {
      return publish
    }
    return (
      post.post_status !== PostStatusEnum.PostStatusEnum_Draft &&
      post.post_status !== PostStatusEnum.PostStatusEnum_AutoDraft
    )
  }

  /**
   * 让文章结构里的状态与 `publish` 参数保持一致。
   *
   * 存草稿时结构里必须是草稿状态；发布时保留用户选择的「发布 / 私密」，
   * 未选择或原本是草稿时补成发布。
   *
   * @param post - 文章
   * @param shouldPublish - 是否按发布处理
   * @private
   */
  private applyPostStatus(post: Post, shouldPublish: boolean): void {
    if (!shouldPublish) {
      post.post_status = PostStatusEnum.PostStatusEnum_Draft
      return
    }
    if (
      StrUtil.isEmptyString(post.post_status as unknown as string) ||
      post.post_status === PostStatusEnum.PostStatusEnum_Draft ||
      post.post_status === PostStatusEnum.PostStatusEnum_AutoDraft
    ) {
      post.post_status = PostStatusEnum.PostStatusEnum_Publish
    }
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_DELETE_POST, [
      this.cfg.blogid,
      postid,
      this.cfg.username,
      this.cfg.password,
      false,
    ])
    this.logger.debug("ret=>", ret)

    return ret
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const previewUrl = this.cfg.previewUrl.replace(/\[postid\]/g, postid)
    // return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
    return previewUrl
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const result = [] as CategoryInfo[]

    try {
      const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_CATEGORIES, [
        this.cfg.blogid,
        this.cfg.username,
        this.cfg.password,
      ])
      const dataArr = ret
      this.logger.debug("获取的分类信息，dataArr=>", dataArr)

      dataArr.forEach((item: any) => {
        const cate = new CategoryInfo()
        cate.categoryId = item.categoryId
        cate.categoryName = item.categoryName
        cate.description = item.description
        cate.categoryDescription = item.categoryDescription
        cate.htmlUrl = item.htmlUrl
        cate.parentId = item.parentId
        cate.rssUrl = item.rssUrl
        result.push(cate)
      })
    } catch (e) {
      this.logger.error("分类获取失败", e)
    }

    return result
  }

  public async newMediaObject(mediaObject: MediaObject, customHandler?: any): Promise<Attachment> {
    let ret: Attachment
    try {
      ret = await this.metaweblogCall(MetaweblogConstants.METHOD_NEW_MEDIA_OBJECT, [
        this.cfg.blogid,
        this.cfg.username,
        this.cfg.password,
        {
          name: mediaObject.name,
          type: mediaObject.type,
          bits: mediaObject.bits
        },
      ])
      this.logger.debug("上传媒体完成, ret =>", ret)
    } catch (e) {
      this.logger.error("媒体上传失败", e)
    }

    return ret
  }

  protected async metaweblogCall(method: string, params: any[]) {
    await this.ensureHostSessionReady()
    return await this.proxyXmlrpc(this.cfg.apiUrl, method, params)
  }

  /**
   * 确保宿主会话已对该站点可用（仅在平台声明走宿主会话直传、且未配置跨域代理时执行）。
   *
   * 幂等：同一适配器实例内只执行一次，失败也不阻塞后续调用（由传输层决定回退）。
   */
  private async ensureHostSessionReady(): Promise<void> {
    if (!this.isHostSessionFetch) {
      return
    }
    // 用户配置了跨域代理时走代理通路，无需宿主会话预热
    if (this.cfg.isCorsProxy && !StrUtil.isEmptyString(this.cfg.corsAnywhereUrl)) {
      return
    }
    if (!this.hostSessionReadyPromise) {
      this.hostSessionReadyPromise = HostSessionFetchUtil.ensureSiteReady(
        this.appInstance,
        this.cfg.home,
        this.cfg.apiUrl,
        this.logger
      ).catch((e) => {
        this.logger.warn("ensureSiteReady failed, transport will fall back", e)
        return false
      })
    }
    await this.hostSessionReadyPromise
  }

  /**
   * 适配文章字段
   * @param post 原始文章
   * @param isEdit 是否为更新已有文章
   * @private
   */
  private createPostStruct(post: Post, isEdit = false): object {
    const postObj = {}

    if (!StrUtil.isEmptyString(post.title)) {
      Object.assign(postObj, {
        title: post.title,
      })
    }

    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      Object.assign(postObj, {
        mt_keywords: post.mt_keywords,
      })
    }

    if (!StrUtil.isEmptyString(post.mt_excerpt)) {
      Object.assign(postObj, {
        mt_excerpt: post.mt_excerpt,
      })
    }

    if (!StrUtil.isEmptyString(post.mt_text_more)) {
      Object.assign(postObj, {
        mt_text_more: post.mt_text_more,
      })
    }

    if (!StrUtil.isEmptyString(post.description)) {
      Object.assign(postObj, {
        description: post.description,
      })
    }

    if (!StrUtil.isEmptyString(post.wp_slug)) {
      Object.assign(postObj, {
        wp_slug: post.wp_slug,
      })
    }

    // // 浏览器端的date转换有问题，先关闭这个功能
    // Object.assign(postObj, {
    //   // 这里要注意时间格式
    //   // http://www.ab-weblog.com/en/create-new-posts-with-publishing-date-in-wordpress-using-xml-rpc-and-php/
    //   // dateCreated: post.dateCreated.toISOString() || new Date().toISOString()
    //   dateCreated: post.dateCreated || new Date(),
    // })
    //
    // Object.assign(postObj, {
    //   // 这里要注意时间格式
    //   // http://www.ab-weblog.com/en/create-new-posts-with-publishing-date-in-wordpress-using-xml-rpc-and-php/
    //   // dateCreated: post.dateCreated.toISOString() || new Date().toISOString()
    //   dateUpdated: post.dateUpdated || new Date(),
    // })

    Object.assign(postObj, {
      categories: post.categories || [],
    })

    Object.assign(postObj, {
      post_status: post.post_status ?? PostStatusEnum.PostStatusEnum_Publish,
    })

    if (!StrUtil.isEmptyString(post.wp_password)) {
      Object.assign(postObj, {
        wp_password: post.wp_password,
      })
    }

    this.extendPostStruct(post, postObj, isEdit)

    return postObj
  }

  /**
   * 平台私有字段扩展点。
   *
   * 默认不追加任何字段，保持既有 MetaWeblog 平台的文章结构不变；
   * 只有需要平台私有字段（例如 WordPress 的特写图附件 ID）的适配器才覆盖本方法。
   *
   * @param post - 文章
   * @param postStruct - 已生成的公共字段
   * @param isEdit - 是否为更新已有文章
   */
  protected extendPostStruct(post: Post, postStruct: Record<string, any>, isEdit: boolean): void {
    // 默认无扩展，子类按平台协议自行追加
  }
}

export { MetaweblogBlogApiAdaptor }
