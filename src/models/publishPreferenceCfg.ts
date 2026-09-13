/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PreferenceConfig } from "zhi-blog-api"

/**
 * 思源笔记 AI 模型（对应 config.ai.providers[].models[]）
 */
export interface SiyuanAiModel {
  id: string
  name: string
}

/**
 * 思源笔记 AI Provider（对应 config.ai.providers[]，仅保留启用且含可用模型的项）
 */
export interface SiyuanAiProvider {
  id: string
  displayName: string
  baseURL: string
  protocol: string
  apiKey: string
  models: SiyuanAiModel[]
}

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

  /**
   * 当前选中的思源笔记 AI 模型 id（对应 config.ai.providers[].models[].id）
   * 用于 V1/V2 共用 AI 设置组件记住用户选择
   */
  public experimentalSisyuanAiActiveModelId?: string

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

  // V2 UI 开关
  public useV2UI?: boolean

  // 发布源笔记本（issue #2044）：按笔记本限定发布来源；空=不限制（向后兼容）
  public publishSourceNotebooks?: string[]

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

    this.useV2UI = false

    this.publishSourceNotebooks = []
  }
}

export { PublishPreferenceCfg }
