import { describe } from "vitest"

describe("syCmd test", async () => {
  it("cmd test", async () => {
    const syCmd = require("public/lib/cmd/syCmd.js")
    // const syCmd = window.SyCmd

    const result = await (syCmd.customPyCmd("python", ["-V"]) as Promise<any>)
    console.log("-----------------------")
    console.log(result.data)
  })
})
