/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 表示与平台相关的元数据
 *
 * @author terwer
 * @since 1.18.0
 * @version 2.0.0
 */
class PlatformMetadata {
  metadata: Record<string, MetadataItem>

  constructor() {
    this.metadata = {}
  }
}

/**
 * 表示元数据项
 *
 * @author terwer
 * @since 1.18.0
 */
class MetadataItem {
  /**
   * 标签列表
   */
  public tags: string[]

  /**
   * 分类列表
   */
  public categories: string[]

  /**
   * 模板列表
   */
  public templates: string[]

  constructor() {
    this.tags = []
    this.categories = []
    this.templates = []
  }
}

export { PlatformMetadata, MetadataItem }
