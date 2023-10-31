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
 * 表示与平台相关的元数据
 *
 * @author terwer
 * @since 1.18.0
 */
class PlatformMetadata {
  metadata: Record<string, MetadataItem>
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
