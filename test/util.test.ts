import { describe, expect } from "vitest"
import { pingyinSlugify, zhSlugify } from "~/utils/util"
import logUtil from "~/utils/logUtil"

describe("util test", () => {
  it("zhSlugify test", async () => {
    const result = await zhSlugify("我爱中国")
    logUtil.logInfo("zhSlugify result=>", result)
    expect(result).contains("china")
  })

  it("pingyinSlugify test", async () => {
    const result = await pingyinSlugify("我爱中国")
    logUtil.logInfo("pingyinSlugify result=>", result)
    expect(result).contains("wo")
  })
})
