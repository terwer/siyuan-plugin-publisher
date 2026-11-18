import { describe, expect, it, vi } from "vitest"
import {
  IMAGE_UPLOAD_POLICY_ATTR,
  countLocalMarkdownImages,
  matchImageUploadExcludeDir,
  normalizeImageUploadPolicyValue,
  normalizeImageUploadRulePath,
  resolveImageUploadPolicy,
  resolveImageUploadPolicyFromInputs,
  type ImageUploadExcludeDirRule,
} from "~/src/utils/imageUploadPolicy.ts"

const rules: ImageUploadExcludeDirRule[] = [
  { notebookId: "box-1", path: "/private" },
  { notebookId: "box-1", path: "/private/deep" },
  { notebookId: "box-2", path: "" },
]

describe("imageUploadPolicy", () => {
  it("normalizes only the two standard document values", () => {
    expect(normalizeImageUploadPolicyValue("skip")).toBe("skip")
    expect(normalizeImageUploadPolicyValue(" SKIP ")).toBe("skip")
    expect(normalizeImageUploadPolicyValue("upload")).toBe("upload")
    expect(normalizeImageUploadPolicyValue("")).toBe("follow")
    expect(normalizeImageUploadPolicyValue("none")).toBe("follow")
    expect(normalizeImageUploadPolicyValue(undefined)).toBe("follow")
  })

  it("normalizes rule paths and keeps the whole-notebook sentinel empty", () => {
    expect(normalizeImageUploadRulePath("")).toBe("")
    expect(normalizeImageUploadRulePath("private/")).toBe("/private")
    expect(normalizeImageUploadRulePath("/private/")).toBe("/private")
    expect(normalizeImageUploadRulePath(undefined)).toBe("")
  })

  it("matches the directory itself and its descendants only", () => {
    expect(matchImageUploadExcludeDir({ box: "box-1", path: "/private" }, rules)?.path).toBe("/private")
    expect(matchImageUploadExcludeDir({ box: "box-1", path: "/private/deep/doc" }, rules)?.path).toBe("/private")
    expect(matchImageUploadExcludeDir({ box: "box-1", path: "/private2/doc" }, rules)).toBeUndefined()
    expect(matchImageUploadExcludeDir({ box: "box-9", path: "/private/doc" }, rules)).toBeUndefined()
  })

  it("matches SiYuan document paths with the .sy suffix", () => {
    const syRules: ImageUploadExcludeDirRule[] = [{ notebookId: "box-1", path: "/parent.sy" }]
    expect(matchImageUploadExcludeDir({ box: "box-1", path: "/parent.sy" }, syRules)).toBeDefined()
    expect(matchImageUploadExcludeDir({ box: "box-1", path: "/parent/child.sy" }, syRules)).toBeDefined()
    expect(matchImageUploadExcludeDir({ box: "box-1", path: "/parent2/child.sy" }, syRules)).toBeUndefined()
  })

  it("matches every document of a whole-notebook rule", () => {
    expect(matchImageUploadExcludeDir({ box: "box-2", path: "/any/doc" }, rules)?.notebookId).toBe("box-2")
  })

  it("prefers document skip over a directory rule", () => {
    expect(
      resolveImageUploadPolicyFromInputs({
        docAttrValue: "skip",
        doc: { box: "box-1", path: "/private/doc" },
        rules,
      })
    ).toMatchObject({ skip: true, source: "document", docPolicy: "skip" })
  })

  it("lets a document upload override a matched directory rule", () => {
    expect(
      resolveImageUploadPolicyFromInputs({
        docAttrValue: "upload",
        doc: { box: "box-1", path: "/private/doc" },
        rules,
      })
    ).toMatchObject({ skip: false, source: "document", docPolicy: "upload" })
  })

  it("falls back to the directory rule, then the platform setting", () => {
    expect(
      resolveImageUploadPolicyFromInputs({
        doc: { box: "box-1", path: "/private/doc" },
        rules,
      })
    ).toMatchObject({ skip: true, source: "directory", matchedRule: { path: "/private" } })

    expect(
      resolveImageUploadPolicyFromInputs({
        doc: { box: "box-1", path: "/public/doc" },
        rules,
      })
    ).toMatchObject({ skip: false, source: "platform", docPolicy: "follow" })
  })

  it("reads the document attribute and block info from the kernel", async () => {
    const kernelApi = {
      getBlockAttrs: vi.fn().mockResolvedValue({ [IMAGE_UPLOAD_POLICY_ATTR]: "skip" }),
      getBlockByID: vi.fn().mockResolvedValue({ box: "box-1", path: "/public/doc" }),
    }

    await expect(resolveImageUploadPolicy({ kernelApi, docId: "doc-1", rules })).resolves.toMatchObject({
      skip: true,
      source: "document",
    })
    expect(kernelApi.getBlockAttrs).toHaveBeenCalledWith("doc-1")
    expect(kernelApi.getBlockByID).toHaveBeenCalledWith("doc-1")
  })

  it("matches a directory rule from kernel block info", async () => {
    const kernelApi = {
      getBlockAttrs: vi.fn().mockResolvedValue({}),
      getBlockByID: vi.fn().mockResolvedValue({ box: "box-1", path: "/private/doc" }),
    }

    await expect(resolveImageUploadPolicy({ kernelApi, docId: "doc-1", rules })).resolves.toMatchObject({
      skip: true,
      source: "directory",
    })
  })

  it("degrades to follow when the kernel reads fail", async () => {
    const kernelApi = {
      getBlockAttrs: vi.fn().mockRejectedValue(new Error("attrs failed")),
      getBlockByID: vi.fn().mockRejectedValue(new Error("block failed")),
    }

    await expect(resolveImageUploadPolicy({ kernelApi, docId: "doc-1", rules })).resolves.toMatchObject({
      skip: false,
      source: "platform",
      docPolicy: "follow",
    })
  })

  it("counts only unique local markdown images", () => {
    const markdown = [
      "![a](assets/a.png)",
      "![b](assets/a.png)",
      "![c](https://example.com/c.png)",
      "![d](data:image/png;base64,xxx)",
      "![e](<assets/e.png>)",
      "![f](/assets/f.png \"title\")",
    ].join("\n")

    expect(countLocalMarkdownImages(markdown)).toBe(3)
    expect(countLocalMarkdownImages("")).toBe(0)
    expect(countLocalMarkdownImages(undefined)).toBe(0)
  })
})
