/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
