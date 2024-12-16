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

import { PreferenceConfig } from "zhi-blog-api"

/**
 * 发布偏好设置
 *
 * @author terwer
 * @since 1.9.1
 * @version 1.9.1
 */
class PublishPreferenceCfg extends PreferenceConfig {
  /**
   * AI 体验码
   */
  public experimentalUseSiyuanNoteAIConfig: boolean

  /**
   * AI 体验码
   */
  public experimentalAIEnabled: boolean

  /**
   * AI 体验码
   */
  public experimentalAICode: string

  /**
   * AI 基础地址
   */
  public experimentalAIBaseUrl?: string

  /**
   * AI 代理地址
   */
  public experimentalAIProxyUrl?: string

  /**
   * AI 模型
   */
  public experimentalAIApiModel?: string

  /**
   * AI token 数目
   */
  public experimentalAIApiMaxTokens?: number

  /**
   * AI 温度
   */
  public experimentalAIApiTemperature?: number

  // 文档菜单
  /**
   * 是否展示文档快捷菜单
   */
  public showDocQuickMenu?: boolean

  // 顶栏菜单
  public showQuickMenu?: boolean
  public showSingleMenu?: boolean
  public showBatchMenu?: boolean
  public showAIMenu?: boolean
  public showExtendMenu?: boolean

  // 文章管理
  public showArticleManageMenu?: boolean

  // 是否忽略块引用
  public ignoreBlockRef?: boolean
  // 是否允许修改别名
  public allowChangeSlug?: boolean

  constructor() {
    super()
    this.experimentalUseSiyuanNoteAIConfig = true
    this.experimentalAIEnabled = false

    this.showDocQuickMenu = true

    this.showQuickMenu = true
    this.showSingleMenu = true
    this.showBatchMenu = true
    this.showAIMenu = true
    this.showExtendMenu = true

    this.showArticleManageMenu = true
    this.ignoreBlockRef = false
    this.allowChangeSlug = false
  }
}

export { PublishPreferenceCfg }
