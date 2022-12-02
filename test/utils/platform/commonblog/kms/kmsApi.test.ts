import { describe, it } from "vitest"
import logUtil from "../../../../../src/utils/logUtil"

describe("kmsApi test", () => {
  it("kmsFetch", () => {
    logUtil.logInfo("kmsFetch")
  })

  // it('kms addDoc', () => {
  //     const baseUrl = ""
  //     const basicToken = ""
  //     const kmsApi = new KmsApi(baseUrl, basicToken)
  //     const result = kmsApi.addDoc("测试标题", "测试内容")
  //     logUtil.logInfo(result)
  // })
})
