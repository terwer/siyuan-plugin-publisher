import { describe, expect, it } from "vitest"
import init from "./index"

describe("siyuan-plugin-publisher", () => {
  it("index", () => {
    expect(init()).toBe("ok")
  })
})
