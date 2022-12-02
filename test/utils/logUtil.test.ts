import { describe, it } from "vitest"
import logUtil from "../../src/utils/logUtil"

describe("logUtil test", () => {
  it("logInfo", () => {
    logUtil.logInfo("This is info logUtil")
  })

  it("logWarn", () => {
    logUtil.logWarn("This is warn logUtil")
  })

  it("logError", () => {
    logUtil.logError("This is error logUtil")
  })
})
