import { describe, expect } from "vitest"
import pageUtil from "~/utils/pageUtil"
import index from "~/pages/index/App.vue"
import { shallowMount } from "@vue/test-utils"
import logUtil from "~/utils/logUtil"

describe("pageUtil test", () => {
  it("createPage test", async () => {
    // 创建统一的Vue实例
    const app = pageUtil.createPage(index)
    expect(app).toBeTruthy()

    // 挂载Vue
    // const wrapper = await mount(index, {})
    const wrapper = await shallowMount(index, {})
    const result = wrapper.html()
    logUtil.logInfo("首页HTML=>", result)
    expect(result).toContain("app-layout")
  })
})
