import { describe } from "vitest"
import index from "~/pages/index/App.vue"
import { shallowMount } from "@vue/test-utils"
import logUtil from "~/utils/logUtil"

describe("index page test", () => {
  it("mount component test", async () => {
    expect(index).toBeTruthy()

    const wrapper = await shallowMount(index, {})

    const result = wrapper.html()
    logUtil.logInfo("首页HTML=>", result)
    expect(result).toContain("app-layout")
  })

  // it("component function test", async () => {
  //   const wrapper = await shallowMount(index, {})
  //
  //   const initMethod = vi.spyOn(wrapper.vm, "init")
  //   wrapper.vm.init()
  //   logUtil.logInfo(wrapper.vm)
  //   expect(initMethod).toHaveBeenCalledOnce()
  // })
})
