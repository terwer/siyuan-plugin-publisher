import { describe, expect, it } from "vitest"
import {
  applyDiagramReplacements,
  findDiagramFences,
} from "~/src/utils/diagram/diagramFenceParser.ts"
import {
  normalizeDiagramLanguage,
  normalizeDiagramRenderPolicy,
  normalizeDiagramRenderScale,
} from "~/src/utils/diagram/diagramTypes.ts"

describe("findDiagramFences", () => {
  it("finds mermaid and keeps offsets usable for replacement", () => {
    const md = "# Title\n\n```mermaid\ngraph TD\nA-->B\n```\n\nAfter"
    const fences = findDiagramFences(md)
    expect(fences).toHaveLength(1)
    expect(fences[0].language).toBe("mermaid")
    expect(fences[0].code).toBe("graph TD\nA-->B")
    const replaced = applyDiagramReplacements(md, [
      { start: fences[0].start, end: fences[0].end, text: "![mermaid diagram](assets/a.png)" },
    ])
    expect(replaced).toContain("![mermaid diagram](assets/a.png)")
    expect(replaced).not.toContain("```mermaid")
    expect(replaced).toContain("After")
  })

  it("supports tildes, aliases and brace info strings", () => {
    const md = "~~~{.flowchart}\nst=>start: Start\n~~~\n\n```dot\ndigraph G {A->B}\n```"
    const fences = findDiagramFences(md)
    expect(fences.map((item) => item.language)).toEqual(["flowchart", "graphviz"])
    expect(fences[0].code).toBe("st=>start: Start")
  })

  it("ignores unsupported languages and unclosed fences", () => {
    const md = "```javascript\nconsole.log(1)\n```\n\n```mermaid\ngraph TD\nA-->B"
    expect(findDiagramFences(md)).toHaveLength(0)
  })

  it("keeps a longer fence closing a shorter inner marker", () => {
    const md = "````mermaid\ngraph TD\n```\nA-->B\n````"
    const fences = findDiagramFences(md)
    expect(fences).toHaveLength(1)
    expect(fences[0].code).toContain("```")
  })

  it("removes the fence indentation from content and keeps it for replacement", () => {
    const md = "- item\n\n  ```mermaid\n  graph TD\n  A-->B\n  ```\n"
    const fences = findDiagramFences(md)
    expect(fences[0].code).toBe("graph TD\nA-->B")
    expect(fences[0].indent).toBe("  ")
    const replaced = applyDiagramReplacements(md, [
      { start: fences[0].start, end: fences[0].end, text: `${fences[0].indent}![mermaid](assets/a.png)` },
    ])
    expect(replaced).toContain("  ![mermaid](assets/a.png)")
  })

  it("returns no fences for empty content", () => {
    expect(findDiagramFences("")).toEqual([])
    expect(findDiagramFences("plain text")).toEqual([])
  })
})

describe("diagram settings normalisation", () => {
  it("normalises languages", () => {
    expect(normalizeDiagramLanguage("mermaid")).toBe("mermaid")
    expect(normalizeDiagramLanguage("{.plantuml}")).toBe("plantuml")
    expect(normalizeDiagramLanguage("puml")).toBe("plantuml")
    expect(normalizeDiagramLanguage("math")).toBeUndefined()
  })

  it("normalises scale and policy", () => {
    expect(normalizeDiagramRenderScale(undefined)).toBe(2)
    expect(normalizeDiagramRenderScale("3")).toBe(3)
    expect(normalizeDiagramRenderScale(9)).toBe(3)
    expect(normalizeDiagramRenderScale(0)).toBe(1)
    expect(normalizeDiagramRenderPolicy("skip")).toBe("skip")
    expect(normalizeDiagramRenderPolicy("false")).toBe("skip")
    expect(normalizeDiagramRenderPolicy("upload")).toBe("follow")
  })
})
