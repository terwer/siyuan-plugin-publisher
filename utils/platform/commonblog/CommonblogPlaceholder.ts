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

/**
 * 通用平台设置的操作提示
 * @author terwer
 * @since 0.6.1
 */
export class CommonblogPlaceholder {
  /**
   * 首页操作提示
   */
  homePlaceholder: string
  /**
   * API 地址操作提示
   */
  apiUrlPlaceholder: string
  /**
   * 用户名操作提示
   */
  usernamePlaceholder: string
  /**
   * 密码
   */
  passwordPlaceholder: string

  /**
   * 鉴权token
   */
  tokenPlaceholder: string

  /**
   * 是否发布
   */
  apiStatusPlaceholder: boolean
  /**
   * 博客名（API获取）
   */
  blogNamePlaceholder: string
  /**
   * 博客标识（API获取，部分平台需要）
   */
  blogidPlaceholder: string
  /**
   * 文章别名key
   */
  posidKeyPlaceholder: string
  /**
   * 文章预览链接
   */
  previewUrlPlaceholder: string
  /**
   * 文章类型
   */
  pageTypePlaceholder: string
  /**
   * token设置地址
   */
  tokenSettingUrl: string
}
