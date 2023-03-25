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

import { getFileHash } from "~/utils/hashUtil"

/**
 * 图片信息
 */
export class ImageItem {
  /**
   * 文件，
   */
  name: string
  /**
   * 文件名称的Hash，构造函数指定
   */
  hash: string
  /**
   * 原始资源地址
   */
  originUrl: string
  /**
   * 资源地址
   */
  url: string
  /**
   * 资源备注
   */
  alt?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 是否本地
   */
  isLocal: boolean

  constructor(originUrl: string, url: string, isLocal: boolean, alt?: string, title?: string) {
    this.originUrl = originUrl
    this.name = originUrl.substring(originUrl.lastIndexOf("/") + 1)
    this.hash = getFileHash(this.name)
    this.url = url
    this.isLocal = isLocal
    this.alt = alt ?? ""
    this.title = title ?? ""
  }
}
