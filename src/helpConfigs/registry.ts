/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { type PageHelpConfig, type FieldHelp, type TourStep } from "~/src/types/IPageHelpConfig"
import { DEFAULT_PAGE_HELP_CONFIG } from "~/src/helpConfigs/pages/_default"

/**
 * 通用帮助注册中心
 *
 * 按 pageId 命名空间查询，支持层级 fallback：
 *   pageId 专属配置 → 目录级 _default → 全局 _default
 *
 * @author terwer
 * @since 1.42.0
 */
class HelpRegistry {
  private pageConfigs: Map<string, PageHelpConfig> = new Map()

  /**
   * 注册一个页面帮助配置
   */
  register(config: PageHelpConfig): void {
    this.pageConfigs.set(config.pageId, config)
  }

  /**
   * 按 pageId 查询完整配置
   *
   * Fallback 链：
   * 1. 精确匹配 pageId
   * 2. 目录级 _default（如 "platform-config/_default" 匹配 "platform-config/xxx"）
   * 3. 全局 _default
   */
  get(pageId: string): PageHelpConfig {
    // 1. 精确匹配
    const exact = this.pageConfigs.get(pageId)
    if (exact) return exact

    // 2. 目录级 _default（取 pageId 最后 / 前的部分 + "/_default"）
    const lastSlash = pageId.lastIndexOf("/")
    if (lastSlash > 0) {
      const dirDefault = pageId.substring(0, lastSlash) + "/_default"
      const dirConfig = this.pageConfigs.get(dirDefault)
      if (dirConfig) return dirConfig
    }

    // 3. 全局兜底
    return DEFAULT_PAGE_HELP_CONFIG
  }

  /**
   * 按 pageId + field 查询字段帮助
   */
  getField(pageId: string, fieldName: string): FieldHelp | undefined {
    const config = this.pageConfigs.get(pageId)
    return config?.fields?.[fieldName]
  }

  /**
   * 按 pageId 获取可视化引导步骤
   */
  getTour(pageId: string): TourStep[] | undefined {
    const config = this.pageConfigs.get(pageId)
    return config?.tour
  }

  /**
   * 按 pageId 获取帮助文档 URL
   *
   * Fallback 链与 get() 一致
   */
  getHelpUrl(pageId: string): string {
    const config = this.get(pageId)
    return config.helpUrl ?? DEFAULT_PAGE_HELP_CONFIG.helpUrl ?? ""
  }

  /**
   * 检查是否有页面专属配置（非兜底）
   */
  hasConfig(pageId: string): boolean {
    return this.pageConfigs.has(pageId)
  }

  /**
   * 获取所有已注册的 pageId
   */
  getAllPageIds(): string[] {
    return Array.from(this.pageConfigs.keys())
  }
}

/** 全局单例 */
export const helpRegistry = new HelpRegistry()