import { describe } from "vitest"
import { getEnv } from "~/utils/envUtil"

describe("envUtil test", () => {
  it("getEnv test", () => {
    const siyuanApiUrl = getEnv("VITE_SIYUAN_API_URL")
    expect(siyuanApiUrl).toBeDefined()
    console.log("siyuanApiUrl=>", siyuanApiUrl)
  })
})
