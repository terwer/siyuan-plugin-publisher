import { describe, expect, it } from "vitest"
import { isSystemOrUserGuideNotebook, shouldExcludeNotebook } from "~/src/composables/useNotebookOptions.ts"

describe("useNotebookOptions filtering", () => {
  it("excludes system/user-guide notebook names", () => {
    expect(isSystemOrUserGuideNotebook("用户指南")).toBe(true)
    expect(isSystemOrUserGuideNotebook("User Guide")).toBe(true)
    expect(isSystemOrUserGuideNotebook("siyuan user guide")).toBe(true)
  })

  it("keeps normal notebook names", () => {
    expect(isSystemOrUserGuideNotebook("我的博客")).toBe(false)
    expect(isSystemOrUserGuideNotebook("")).toBe(false)
  })

  it("excludes closed notebooks", () => {
    expect(shouldExcludeNotebook({ id: "n1", name: "我的博客", closed: true })).toBe(true)
  })

  it("keeps an open normal notebook", () => {
    expect(shouldExcludeNotebook({ id: "n1", name: "我的博客", closed: false })).toBe(false)
  })

  it("excludes undefined entries", () => {
    expect(shouldExcludeNotebook(undefined)).toBe(true)
  })
})
