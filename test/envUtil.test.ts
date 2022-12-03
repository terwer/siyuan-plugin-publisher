import { describe } from "vitest"
import { getBooleanEnv, getEnv } from "~/utils/envUtil"

describe("envUtil test", () => {
  it("getEnv test", () => {
    const siyuanApiUrl = getEnv("VITE_SIYUAN_API_URL")
    expect(siyuanApiUrl).toBeDefined()
    console.log("siyuanApiUrl=>", siyuanApiUrl)
  })

  it("getBooleanEnv test", () => {
    const logInfoEnabled = getBooleanEnv("VITE_LOG_INFO_ENABLED")
    expect(logInfoEnabled).toBeDefined()
    console.log("logInfoEnabled=>", logInfoEnabled)
  })
})
