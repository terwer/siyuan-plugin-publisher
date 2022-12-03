/**
 * 通用文章模型定义
 */
import { POST_STATUS_CONSTANTS } from "~/utils/constants/postStatusConstants"

export class Post {
  postid: string
  title: string
  /**
   * 逗号分隔的标签
   */
  mt_keywords: string
  link?: string
  permalink: string
  shortDesc?: string
  description: string
  mt_excerpt?: string
  wp_slug: string
  dateCreated: Date
  categories: string[]
  /**
   * 分类别名，大部分平台不需要
   */
  cate_slugs?: string[]
  mt_text_more?: string
  post_status?: string
  wp_password: string

  constructor() {
    this.postid = ""
    this.title = ""
    this.mt_keywords = ""
    this.permalink = ""
    this.description = ""
    this.wp_slug = ""
    this.dateCreated = new Date()
    this.categories = []
    this.cate_slugs = []
    this.post_status = POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH
    this.wp_password = ""
  }
}
