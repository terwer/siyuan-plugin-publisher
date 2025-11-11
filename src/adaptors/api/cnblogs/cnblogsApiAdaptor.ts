/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryInfo, Post, UserBlog } from "zhi-blog-api"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CnblogsConstants } from "~/src/adaptors/api/cnblogs/cnblogsConstants.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"

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
  private assignMdCategory(post: Post) {
    const cates = post.categories ?? []
    if (!cates.some((cate) => cate.toLowerCase() === this.MD_CATEGORY.toLowerCase())) {
      cates.push(this.MD_CATEGORY)
    }

    return post
  }
}
export { CnblogsApiAdaptor }
