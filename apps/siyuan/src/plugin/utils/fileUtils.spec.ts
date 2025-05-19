import { describe, it, expect } from "vitest"
import { normalizePath } from "./fileUtils"

describe("fileUtils", () => {
  describe("normalizePath", () => {
    it("should normalize single path correctly", () => {
      expect(normalizePath("test")).toBe("test")
      expect(normalizePath("/test")).toBe("test")
      expect(normalizePath("test/")).toBe("test")
      expect(normalizePath("/test/")).toBe("test")
    })

    it("should normalize multiple path segments correctly", () => {
      expect(normalizePath("a", "b", "c")).toBe("a/b/c")
      expect(normalizePath("/a", "/b", "/c")).toBe("a/b/c")
      expect(normalizePath("a/", "b/", "c/")).toBe("a/b/c")
      expect(normalizePath("/a/", "/b/", "/c/")).toBe("a/b/c")
    })

    it("should handle empty path segments correctly", () => {
      expect(normalizePath("", "test", "")).toBe("test")
      expect(normalizePath("test", "", "path")).toBe("test/path")
    })

    it("should handle paths with multiple slashes correctly", () => {
      expect(normalizePath("//test//path//")).toBe("test/path")
      expect(normalizePath("///a///b///c///")).toBe("a/b/c")
    })
  })
})
