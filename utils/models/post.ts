/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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
