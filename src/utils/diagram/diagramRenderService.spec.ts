import { describe, expect, it, vi } from "vitest"
import { DiagramRenderService } from "~/src/utils/diagram/diagramRenderService.ts"
import type {
  DiagramAssetWriter,
  DiagramRenderOptions,
  DiagramRenderer,
} from "~/src/utils/diagram/diagramTypes.ts"

class FakeRenderer implements DiagramRenderer {
  public calls: DiagramRenderOptions[] = []
  public failLanguages = new Set<string>()

  async render(options: DiagramRenderOptions): Promise<Uint8Array> {
    this.calls.push(options)
    if (this.failLanguages.has(options.language)) {
      throw new Error("boom")
    }
    return new Uint8Array([1, 2, 3])
  }

  dispose(): void {}
}

class FakeWriter implements DiagramAssetWriter {
  public files = new Map<string, Uint8Array>()
  public removed: string[] = []

  async write(name: string, bytes: Uint8Array): Promise<void> {
    this.files.set(name, bytes)
  }

  async remove(name: string): Promise<void> {
    this.removed.push(name)
    this.files.delete(name)
  }
}

const prepareOptions = {
  enabled: true,
  skip: false,
  theme: "light" as const,
  scale: 2,
  plantUmlServePath: "https://www.plantuml.com/plantuml/svg/~1",
}

describe("DiagramRenderService", () => {
  it("renders fences, writes temp assets and replaces them with image markdown", async () => {
    const renderer = new FakeRenderer()
    const writer = new FakeWriter()
    const service = new DiagramRenderService(renderer, writer)
    const md = "before\n\n```mermaid\ngraph TD\nA-->B\n```\n\n```echarts\n{\"series\":[]}\n```\n\nafter"

    const result = await service.prepare(md, prepareOptions)

    expect(result.converted).toBe(2)
    expect(result.errors).toEqual([])
    expect(result.assets).toHaveLength(2)
    expect(result.markdown).not.toContain("```mermaid")
    expect(result.markdown).not.toContain("```echarts")
    expect(result.markdown).toContain("![mermaid diagram](assets/syp-diagram-")
    expect(result.markdown).toContain("![echarts diagram](assets/syp-diagram-")
    expect(writer.files.size).toBe(2)
    expect(renderer.calls.map((item) => item.theme)).toEqual(["light", "light"])
    expect(renderer.calls.map((item) => item.scale)).toEqual([2, 2])
  })

  it("keeps the original fence when a renderer fails", async () => {
    const renderer = new FakeRenderer()
    renderer.failLanguages.add("mermaid")
    const writer = new FakeWriter()
    const service = new DiagramRenderService(renderer, writer)
    const md = "```mermaid\ngraph TD\nA-->B\n```"

    const result = await service.prepare(md, prepareOptions)

    expect(result.converted).toBe(0)
    expect(result.skipped).toBe(1)
    expect(result.markdown).toBe(md)
    expect(result.errors[0]).toContain("mermaid 文本图渲染失败")
    expect(writer.files.size).toBe(0)
  })

  it("does nothing when disabled or skipped", async () => {
    const renderer = new FakeRenderer()
    const writer = new FakeWriter()
    const service = new DiagramRenderService(renderer, writer)
    const md = "```mermaid\ngraph TD\nA-->B\n```"

    expect((await service.prepare(md, { ...prepareOptions, enabled: false })).markdown).toBe(md)
    expect((await service.prepare(md, { ...prepareOptions, skip: true })).markdown).toBe(md)
    expect(renderer.calls).toHaveLength(0)
  })

  it("reverts to the fence when the image pipeline did not replace the temp asset", async () => {
    const renderer = new FakeRenderer()
    const writer = new FakeWriter()
    const service = new DiagramRenderService(renderer, writer)
    const md = "```mermaid\ngraph TD\nA-->B\n```"

    const prepared = await service.prepare(md, prepareOptions)
    const finalized = await service.finalize(prepared.markdown, prepared.assets)

    expect(finalized.reverted).toBe(1)
    expect(finalized.converted).toBe(0)
    expect(finalized.markdown).toBe(md)
    expect(finalized.errors[0]).toContain("上传失败")
  })

  it("keeps the uploaded image when the pipeline replaced the temp asset", async () => {
    const renderer = new FakeRenderer()
    const writer = new FakeWriter()
    const service = new DiagramRenderService(renderer, writer)
    const md = "```mermaid\ngraph TD\nA-->B\n```"
    const prepared = await service.prepare(md, prepareOptions)
    const uploaded = prepared.markdown.replace(/assets\/syp-diagram-[^)]+/, "https://cdn.example.com/a.png")

    const finalized = await service.finalize(uploaded, prepared.assets)

    expect(finalized.reverted).toBe(0)
    expect(finalized.converted).toBe(1)
    expect(finalized.markdown).toContain("https://cdn.example.com/a.png")
  })

  it("cleans all temp assets even if one removal fails", async () => {
    const renderer = new FakeRenderer()
    const writer = new FakeWriter()
    const removeSpy = vi.spyOn(writer, "remove").mockRejectedValueOnce(new Error("fs busy"))
    const service = new DiagramRenderService(renderer, writer)
    const md = "```mermaid\ngraph TD\nA-->B\n```"
    const prepared = await service.prepare(md, prepareOptions)

    await expect(service.cleanup(prepared.assets)).resolves.toBeUndefined()
    expect(removeSpy).toHaveBeenCalled()
  })
})
