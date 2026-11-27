/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 思源代码块形式的文本图类型。
 *
 * 与思源前端 `Constants.SIYUAN_RENDER_CODE_LANGUAGES` 对齐；`math` 属于公式，
 * 列表脑图是 `NodeMindmap`/`NodeList` 结构，二者都不在本模块处理范围内。
 */
export const DIAGRAM_LANGUAGES = ["mermaid", "flowchart", "graphviz", "plantuml", "echarts", "abc"] as const

export type DiagramLanguage = (typeof DIAGRAM_LANGUAGES)[number]

/** 文本图渲染主题：浅色固定、深色固定，或跟随思源当前外观 */
export type DiagramThemeMode = "light" | "dark" | "follow"
export type DiagramRenderTheme = "light" | "dark"

/** 单篇文档跳过文本图转换的文档属性 */
export const DIAGRAM_RENDER_POLICY_ATTR = "custom-syp-diagram-render"

/** 默认图片清晰度（2x） */
export const DEFAULT_DIAGRAM_RENDER_SCALE = 2

/** 支持 1x / 2x / 3x */
export const DIAGRAM_RENDER_SCALES = [1, 2, 3] as const

export interface DiagramRenderOptions {
  language: DiagramLanguage
  code: string
  theme: DiagramRenderTheme
  scale: number
  /** PlantUML 服务地址（思源设置里的 editor.plantUMLServePath） */
  plantUmlServePath?: string
}

export interface DiagramRenderer {
  render(options: DiagramRenderOptions): Promise<Uint8Array>
  dispose(): void
}

export interface DiagramAssetWriter {
  write(name: string, bytes: Uint8Array): Promise<void>
  remove(name: string): Promise<void>
}

export interface DiagramPreparedAsset {
  /** 资产文件名（不含 `assets/` 前缀） */
  name: string
  /** 发布正文中的临时图片标记，用于上传失败时回退 */
  token: string
  /** 原始代码块文本，用于回退 */
  fenceText: string
  language: DiagramLanguage
}

export interface DiagramPrepareOptions {
  enabled: boolean
  skip: boolean
  theme: DiagramRenderTheme
  scale: number
  plantUmlServePath?: string
}

export interface DiagramPrepareResult {
  markdown: string
  assets: DiagramPreparedAsset[]
  errors: string[]
  converted: number
  skipped: number
}

export interface DiagramFinalizeResult {
  markdown: string
  errors: string[]
  converted: number
  reverted: number
}

/**
 * 规范化文档级策略值。缺省/其他值都表示跟随全局设置。
 */
export const normalizeDiagramRenderPolicy = (raw?: string | null): "skip" | "follow" => {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase()
  return value === "skip" || value === "false" || value === "off" ? "skip" : "follow"
}

/**
 * 规范化清晰度，限制在 1x - 3x。
 */
export const normalizeDiagramRenderScale = (raw?: number | string | null): number => {
  const value = Number(raw)
  if (!Number.isFinite(value)) {
    return DEFAULT_DIAGRAM_RENDER_SCALE
  }
  return Math.min(3, Math.max(1, Math.round(value)))
}

/**
 * 解析信息字符串中的语言标记，兼容 `{.mermaid}` 写法和常见别名。
 */
export const normalizeDiagramLanguage = (info?: string): DiagramLanguage | undefined => {
  const first = String(info ?? "")
    .trim()
    .split(/\s+/)[0]
    ?.replace(/^\{\.?/, "")
    .replace(/\}$/, "")
    .toLowerCase()
  if (!first) {
    return undefined
  }
  switch (first) {
    case "mermaid":
      return "mermaid"
    case "flowchart":
    case "flow":
      return "flowchart"
    case "graphviz":
    case "dot":
      return "graphviz"
    case "plantuml":
    case "puml":
      return "plantuml"
    case "echarts":
      return "echarts"
    case "abc":
      return "abc"
    default:
      return undefined
  }
}
