import { Plugin } from "siyuan"
import "./index.styl"

export default class PublishToolPlugin extends Plugin {
  // lifecycle
  async onload() {
    await this._initZhiLibs()
    console.log(`Publisher loaded at ${new Date().getTime()}`)
  }

  async onunload() {
    console.log("Publisher unloaded")
  }

  // ======================
  // private functions
  // ======================
  private async _initZhiLibs() {
    // const zhiDevice = await import("~/public/libs/zhi-device/index.cjs" as any)
    // console.log("zhiDevice=>", zhiDevice)
  }
}
