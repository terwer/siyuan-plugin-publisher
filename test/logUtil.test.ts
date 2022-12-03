import { describe, it } from "vitest"
import { LogFactory } from "~/utils/logUtil"

describe("logUtil test", () => {
  const logger = LogFactory.getLogger()

  it("logInfo", () => {
    logger.info("This is info log")
  })

  it("logWarn", () => {
    logger.warn("This is warn log")
  })

  it("logError", () => {
    logger.error("This is error log")
  })
})
