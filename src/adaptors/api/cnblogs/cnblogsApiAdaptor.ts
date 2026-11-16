/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CnblogsConstants } from "~/src/adaptors/api/cnblogs/cnblogsConstants.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

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
  private readonly MD_CATEGORY = "[Markdown]"

  /**
   * 博客园的内容类型标记。
   *
   * 博客园没有独立的内容类型字段，`随笔 / 文章 / 日记 / 新闻` 都由分类数组决定：
   * 数组最后一项是这些标记时，按标记的类型创建；最后一项是普通分类或 `[Markdown]` 时按随笔创建。
   * 因此提交前统一由插件排序——`[Markdown]` 最前、普通分类居中、内容类型标记最后。
   */
  private static readonly CONTENT_TYPE_MARKERS = ["[发布为文章]", "[发布为日记]", "[发布为新闻]"]

  /**
   * 博客园的「发布至博客园首页」标记。
   *
   * 它只对随笔有效，且与内容类型标记互斥；排序时放在内容类型标记之前，
   * 保证用户显式选择的内容类型仍是数组最后一项。
   */
  private static readonly HOMEPAGE_MARKER = "[发布至博客园首页]"

  /**
   * 初始化博客园 API 适配器
   *
   * @param appInstance 应用实例
   * @param cfg 配置项
   */
  constructor(appInstance: PublisherAppInstance, cfg: CnblogsConfig) {
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

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    // 归一化分类顺序，保证 Markdown 与内容类型标记都能生效
    post = this.normalizeCategories(post)
    return super.newPost(post, publish)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    // 归一化分类顺序，保证 Markdown 与内容类型标记都能生效
    post = this.normalizeCategories(post)
    return super.editPost(postid, post, publish)
  }

  public override async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
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

  public override async getCategories(): Promise<CategoryInfo[]> {
    const result = [] as CategoryInfo[]

    try {
      const ret = await this.metaweblogCall(MetaweblogConstants.METHOD_GET_CATEGORIES, [
        this.cfg.blogid,
        this.cfg.username,
        this.cfg.password,
      ])
      const dataArr = ret
      this.logger.debug("博客园获取的分类信息，dataArr=>", dataArr)

      dataArr.forEach((item: any) => {
        const cate = new CategoryInfo()
        // MD 分类默认不展示
        if (item.title !== this.MD_CATEGORY) {
          cate.categoryId = item.categoryid
          cate.categoryName = item.title
          cate.description = item.description
          cate.categoryDescription = item.categoryDescription
          cate.htmlUrl = item.htmlUrl
          cate.parentId = item.parentId
          cate.rssUrl = item.rssUrl
          result.push(cate)
        }
      })
    } catch (e) {
      this.logger.error("博客园分类获取失败", e)
    }

    return result
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const userid = this.cfg.apiUrl ? this.cfg.apiUrl.match(/[^/]+$/)?.[0] ?? "" : ""
    const previewUrl = this.cfg.previewUrl.replace(/\[userid]/g, userid).replace(/\[postid]/g, postid)
    // return StrUtil.pathJoin(this.cfg.home ?? "", previewUrl)
    return previewUrl
  }

  // ================
  // private methods
  // ================
  /**
   * 生成博客园可识别的分类数组。
   *
   * 输出顺序固定为：`[Markdown]` → 用户选择的分类 → 「发布至博客园首页」→ 内容类型标记。
   * 分类标签是用户随手添加的，插件不能依赖其排列次序；而博客园按数组最后一项决定内容类型，
   * 所以必须由插件把用户选择的内容类型标记统一放到末尾。
   *
   * @param post - 待提交的文章
   * @private
   */
  private normalizeCategories(post: Post) {
    const mdCategory = this.MD_CATEGORY.toLowerCase()
    const seen = new Set<string>()
    const userCategories: string[] = []
    const homepageMarkers: string[] = []
    const contentTypeMarkers: string[] = []

    for (const raw of post.categories ?? []) {
      if (StrUtil.isEmptyString(raw)) {
        continue
      }
      const cate = raw.trim()
      const key = cate.toLowerCase()
      if (seen.has(key)) {
        continue
      }
      seen.add(key)

      if (key === mdCategory) {
        continue
      }
      if (cate === CnblogsApiAdaptor.HOMEPAGE_MARKER) {
        homepageMarkers.push(cate)
      } else if (CnblogsApiAdaptor.CONTENT_TYPE_MARKERS.includes(cate)) {
        contentTypeMarkers.push(cate)
      } else {
        userCategories.push(cate)
      }
    }

    post.categories = [this.MD_CATEGORY, ...userCategories, ...homepageMarkers, ...contentTypeMarkers]

    return post
  }
}
export { CnblogsApiAdaptor }
