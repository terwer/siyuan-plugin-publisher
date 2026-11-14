/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"

// 由 vitest.config.ts 在 Node 侧读盘注入（测试环境里 node:fs 被打桩、.styl 的 ?raw 为空串）
declare const __SYP_UI_SOURCES__: Record<string, string>

const UI_SOURCES = __SYP_UI_SOURCES__

/**
 * 允许保留的固定色：两种主题下都成立，且属于「刻意」，不是漏改。
 * 新增条目必须在 reason 里写清为什么不能跟随主题。
 */
const ALLOWED_FIXED_COLORS: Array<{ file: string; color: string; reason: string }> = [
  { file: "components/settings/About.vue", color: "#e03e2f", reason: "关于页品牌渐变起点" },
  { file: "components/settings/About.vue", color: "#f1c0b6", reason: "关于页品牌渐变终点" },
  { file: "components/layout/AppHeaderNav.vue", color: "#fff", reason: "蓝色高亮底上的白字" },
  { file: "components/settings/PlatformConfigBridge.vue", color: "#fff", reason: "强调底上的白字" },
  { file: "components/common/SypConfirmBar.vue", color: "#fff", reason: "危险色底上的白字" },
  { file: "components/publish/PlatformCard.vue", color: "#fff", reason: "强调底上的白字" },
  {
    file: "components/bridge/common/ArticleManageList.vue",
    color: "#303133",
    reason: "深色 tooltip 底（两模式一致）",
  },
  { file: "components/bridge/common/ArticleManageList.vue", color: "#fff", reason: "深色 tooltip 上的白字" },
  {
    file: "components/bridge/publish/form/SourceMode.vue",
    color: "#0084ff",
    reason: "当前 YAML 源码模式的链接强调蓝",
  },
]

/** 语义色令牌：必须主题优先（值里出现 var(--b3-…）），否则暗黑模式不跟随 */
const THEMED_TOKEN_PREFIXES = [
  "$syp-bg-",
  "$syp-text-",
  "$syp-border-",
  "$syp-status-",
  "$syp-success",
  "$syp-warning",
  "$syp-error",
]

/** 去掉注释，避免把注释里的示例色当成真实声明 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
}

/** 该 hex 是否处在 var(--x, …) 的回退位置（回退值随主题变量生效，属安全写法） */
function isVarFallback(line: string, at: number): boolean {
  return /var\(\s*--[a-z0-9-]+\s*,[^()]*$/.test(line.slice(0, at))
}

function findFixedColors(source: string): string[] {
  const found: string[] = []
  for (const line of stripComments(source).split("\n")) {
    for (const match of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      if (!isVarFallback(line, match.index)) {
        found.push(match[0].toLowerCase())
      }
    }
  }
  return found
}

const entries = Object.entries(UI_SOURCES).map(([file, source]) => ({ file, source }))

describe("主题一致性守卫", () => {
  it("语义色令牌一律主题优先，浅色只作为回退", () => {
    const variables = entries.find((entry) => entry.file === "assets/variables.styl")
    expect(variables, "未找到 assets/variables.styl").toBeTruthy()

    const offenders: string[] = []
    for (const line of variables!.source.split("\n")) {
      const declaration = line.match(/^\s*(\$[a-z0-9-]+)\s*=\s*(.+)$/i)
      if (!declaration) {
        continue
      }
      const [, token, value] = declaration
      if (!THEMED_TOKEN_PREFIXES.some((prefix) => token.startsWith(prefix))) {
        continue
      }
      if (!value.includes("var(--b3-")) {
        offenders.push(line.trim())
      }
    }

    expect(offenders).toEqual([])
  })

  it("UI 中不再出现脱离主题的硬编码颜色（允许清单之外）", () => {
    const allowed = new Set(ALLOWED_FIXED_COLORS.map((item) => `${item.file}|${item.color}`))
    const offenders: string[] = []

    for (const entry of entries) {
      if (entry.file === "assets/variables.styl") {
        // 令牌自身的浅色回退由上一用例按「主题优先」约束
        continue
      }
      for (const color of new Set(findFixedColors(entry.source))) {
        if (!allowed.has(`${entry.file}|${color}`)) {
          offenders.push(`${entry.file}: ${color}`)
        }
      }
    }

    expect(offenders).toEqual([])
  })

  it("允许清单里的固定色仍确实存在（防止清单腐化）", () => {
    const stale = ALLOWED_FIXED_COLORS.filter((item) => {
      const entry = entries.find((candidate) => candidate.file === item.file)
      return !entry || !findFixedColors(entry.source).includes(item.color)
    }).map((item) => `${item.file}: ${item.color}`)

    expect(stale).toEqual([])
  })
})
