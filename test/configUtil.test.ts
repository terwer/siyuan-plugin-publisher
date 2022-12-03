import { getBooleanConf, getConf, setConf } from "~/utils/configUtil"
import logUtil from "~/utils/logUtil"

describe("config test", () => {
  it("getBooleanConf test", () => {
    const key = "testBoolean"
    const result = getBooleanConf(key)
    logUtil.logInfo("getBooleanConf test=>", result)
  })

  it("setConf test", () => {
    const key = "test"
    const value = "testValue"
    logUtil.logInfo("setConf value=>", value)

    setConf(key, value)

    const newValue = localStorage.getItem(key)
    logUtil.logInfo("setConf newValue=>", newValue)
    assert(newValue, value)
  })

  it("getConf test", () => {
    const key = "test"
    const result = getConf(key)
    logUtil.logInfo("getConf test=>", result)
  })
})
