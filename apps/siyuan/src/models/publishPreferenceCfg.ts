/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PreferenceConfig } from "zhi-blog-api"

/**
 * 发布偏好设置
 *
 * @author terwer
 * @since 1.9.1
 * @version 2.0.0
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
  public experimentalAICode?: string

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
