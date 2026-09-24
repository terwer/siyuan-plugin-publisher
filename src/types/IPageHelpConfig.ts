/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 字段级帮助信息
 */
export interface FieldHelp {
  /** 字段显示名（可选，覆盖表单 label） */
  label?: string
  /** placeholder 文本 */
  placeholder?: string
  /** 提示文本（显示在 ? 图标的 Popover 中） */
  tip?: string
  /** 详细文档链接 */
  link?: string
  /** 链接显示文本 */
  linkText?: string
}

/**
 * 可视化引导步骤
 */
export interface TourStep {
  /** CSS 选择器，标识要高亮的 DOM 元素 */
  target: string
  /** 步骤标题 */
  title: string
  /** 步骤内容 */
  content: string
  /** Popover 位置 */
  placement?: "top" | "bottom" | "left" | "right" | "auto"
}

/**
 * FAQ 条目
 */
export interface FAQItem {
  /** 问题 */
  q: string
  /** 答案 */
  a: string
}

/**
 * 单个页面的帮助配置（核心类型）
 *
 * @see HelpRegistry — 统一注册与查询
 */
export interface PageHelpConfig {
  /** 页面唯一标识，支持 / 分隔命名空间（如 "platform-config/metaweblog_Cnblogs"） */
  pageId: string
  /** 完整帮助文档 URL（兜底链接） */
  helpUrl?: string
  /** 页面简介（HelpPanel 顶部展示） */
  summary?: string
  /** 字段级帮助，key 为表单字段名 */
  fields?: Record<string, FieldHelp>
  /** 可视化引导步骤 */
  tour?: TourStep[]
  /** 常见问题 */
  faq?: FAQItem[]
}