import { describe, expect } from "vitest"
import { pingyinSlugify, zhSlugify } from "~/utils/util"
import { LogFactory } from "~/utils/logUtil"

describe("util test", () => {
  const logger = LogFactory.getConsoleLogger()

  it("zhSlugify test", async () => {
    const result = await zhSlugify("我爱中国")
    logger.info("zhSlugify result=>", result)
    expect(result).contains("china")
  })

  it("pingyinSlugify test", async () => {
    const result = await pingyinSlugify("我爱中国")
    logger.info("pingyinSlugify result=>", result)
    expect(result).contains("wo")
  })
})
