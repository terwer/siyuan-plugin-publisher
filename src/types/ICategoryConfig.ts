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

import { BlogConfig } from "zhi-blog-api"

/**
 * 类别接口配置
 *
 * @author terwer
 * @since 1.9.0
 */
interface ICategoryConfig {
  /**
   * 是否启用类别
   */
  cateEnabled: boolean

  /**
   * 是否只读模式
   */
  readonlyMode: boolean

  /**
   * 只读模式提示
   */
  readonlyModeTip?: string

  /**
   * 思源笔记的文档ID
   */
  pageId?: string

  /**
   * API类型
   */
  apiType?: string

  /**
   * 平台配置
   */
  cfg?: BlogConfig
}

/**
 * 类别配置接口
 *
 * @author terwer
 * @since 1.9.0
 */
interface ISingleCategoryConfig extends ICategoryConfig {}

/**
 * 多个类别的配置
 * @author terwer
 * @since 1.9.0
 */
interface IMultiCategoriesConfig extends ICategoryConfig {}

/**
 * 树状结构中单个类别的配置
 *
 * @author terwer
 * @since 1.9.0
 */
interface ITreeSingleCategoryConfig extends ICategoryConfig {}

/**
 * 树状结构中多个类别的配置
 *
 * @author terwer
 * @since 1.9.0
 */
interface ITreeMultiCategoriesConfig extends ICategoryConfig {}

export {
  type ICategoryConfig,
  type ISingleCategoryConfig,
  type IMultiCategoriesConfig,
  type ITreeSingleCategoryConfig,
  type ITreeMultiCategoriesConfig,
}
