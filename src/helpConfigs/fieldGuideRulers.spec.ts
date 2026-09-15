/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 字段指引回归尺（平台配置页的 「ⓘ 提示」契约）。
 *
 * 尺子①键尺：每站 `fields` 的每个键都必须是「合并后的配置实例」上的真实属性。
 *   历史缺陷：`cookie` / `knowledgeSpace` / `token` 这类键在实例上根本不存在，且没有任何组件挂
 *   `field="cookie"`，于是这些 tip 成了**永不可达的死文案**（行上有 ⓘ 也取不到内容）。
 *
 * 尺子②覆盖尺：每站必须覆盖 `VERIFIED_PLATFORM_ROWS` 里按**真实渲染行**冻结的键集。
 *   历史缺陷：平台配置页渲染了「预览规则 / 发布格式 / 图床服务」等行，`fields` 却没这些键 → 该行没有 ⓘ。
 *
 * 尺子③守卫尺：任何带 `fields` 的 platform-config 页面都必须出现在冻结表里。
 *   作用：将来拆分/新增平台时，若不补表，本尺立刻点名该页面，避免「新平台悄悄绕过两把尺」。
 *
 * 尺子④分工尺：引导步骤（`tour.content`）只讲操作顺序，字段含义归 `fields.tip`，同一句话不得两处都写。
 *   历史缺陷：GitHub 族 6 站的 `home`/`apiUrl`/`pageType` 三个步骤与 `fields.tip` 一字不差，
 *   `username` 步骤是 tip 的子串；Halo/Telegraph 亦同 —— 全量 34 站审计出 52 处重复，
 *   同一个说法在「引导」和「ⓘ」里各讲一遍，用户看两次、维护时改一处漏一处。
 *
 * 「鉴权行的键恒为 `password`，而引导锚点按 passwordType 三选一」这一两套命名空间的规则，
 * 由 `tourAnchors.spec.ts` 的引导锚点契约负责，不在这里重复。
 */
import { describe, expect, it } from "vitest"
import "~/src/helpConfigs/pages/index"
import { helpRegistry } from "~/src/helpConfigs/registry"
import { VERIFIED_PLATFORM_ROWS, mergedPlatformConfig } from "~/src/helpConfigs/verifiedPlatformRows"

const REQUIRED_ROWS_TABLE = VERIFIED_PLATFORM_ROWS

describe("field guide rulers", () => {
  it("尺子①：每站 fields 的键都是配置实例上的真实属性", () => {
    const offenders: string[] = []
    for (const entry of REQUIRED_ROWS_TABLE) {
      const merged = mergedPlatformConfig(entry)
      for (const key of Object.keys(entry.config.fields ?? {})) {
        if (!(key in merged)) offenders.push(`${entry.platformKey}.${key}`)
      }
    }
    expect(offenders, "fields 键必须是配置实例真实属性").toEqual([])
  })

  it("尺子②：每站必须覆盖按真实渲染行冻结的键集", () => {
    const gaps: string[] = []
    for (const entry of REQUIRED_ROWS_TABLE) {
      const actual = Object.keys(entry.config.fields ?? {})
      const missing = entry.required.filter((key) => !actual.includes(key))
      if (missing.length > 0) gaps.push(`${entry.platformKey} missing=[${missing.join(",")}]`)
    }
    expect(gaps, "每站必须覆盖全部渲染行").toEqual([])
  })

  it("尺子③：带 fields 的 platform-config 页面都必须在冻结表里", () => {
    const covered = new Set(REQUIRED_ROWS_TABLE.map((entry) => `platform-config/${entry.platformKey}`))
    const uncovered = helpRegistry
      .getAllPageIds()
      .filter((pageId) => pageId.startsWith("platform-config/"))
      .filter((pageId) => !pageId.endsWith("/_default"))
      .filter((pageId) => Object.keys(helpRegistry.get(pageId).fields ?? {}).length > 0)
      .filter((pageId) => !covered.has(pageId))

    expect(uncovered, "新增字段指引后必须在 verifiedPlatformRows.ts 补一行").toEqual([])
  })

  it("尺子④：引导步骤不得重写字段说明（同一句话只讲一遍）", () => {
    /** 归一化：去空白与标点差异，用于判定「同一句话」 */
    const norm = (s: string): string =>
      (s ?? "")
        .replace(/\s+/g, "")
        .replace(/[。，、；：""''（）()《》【】]/g, "")
        .toLowerCase()

    const offenders: string[] = []
    for (const entry of REQUIRED_ROWS_TABLE) {
      const fields = Object.entries(entry.config.fields ?? {}) as [string, { tip?: string }][]
      for (const step of entry.config.tour ?? []) {
        const tourText = norm(step.content ?? "")
        if (tourText.length === 0) continue
        for (const [key, help] of fields) {
          const tipText = norm(help?.tip ?? "")
          if (tipText.length === 0) continue
          const duplicated =
            tourText === tipText ||
            (tourText.length >= 12 && tipText.length >= 12 && (tourText.includes(tipText) || tipText.includes(tourText)))
          if (duplicated) offenders.push(`${entry.platformKey} tour「${step.title}」重复了 fields.${key}`)
        }
      }
    }

    expect(offenders, "引导只讲操作顺序，字段含义归 fields").toEqual([])
  })
})