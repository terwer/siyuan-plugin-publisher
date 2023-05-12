import { describe, expect, it } from "vitest"
import init from "./index"

describe("publisher-main", () => {
  it("index", () => {
    expect(init()).toBe("ok")
  })
})
