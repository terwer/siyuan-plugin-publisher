import index from "../../src/pages/index.vue"
import { describe, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import logUtil from "../../src/utils/logUtil"

describe("mounted", () => {
  it("mount component", async () => {
    expect(index).toBeTruthy()

    const wrapper = await shallowMount(index, {})

    const result = wrapper.html()
    logUtil.logInfo("首页HTML=>", result)
    expect(result).toContain("blog-index")

    // function test
    // // @ts-ignore
    // const initMethod = vi.spyOn(wrapper.vm, "init")
    // // @ts-ignore
    // wrapper.vm.init()
    // logUtil.logInfo(wrapper.vm)
    // expect(initMethod).toHaveBeenCalledOnce()
  })
})
