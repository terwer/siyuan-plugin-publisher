import { Plugin } from "siyuan"
import "./index.styl"

export default class PublishToolPlugin extends Plugin {
  // lifecycle
  async onload() {
    await this._initIife()
    console.log(`Publisher loaded at ${new Date().getTime()}`)
  }

  async onunload() {
    console.log("Publisher unloaded")
  }

  // ======================
  // private functions
  // ======================
  private async _initIife() {
    const zhiDevice = await import("/plugins/siyuan-publisher/iife/zhi-device/index.iife.js" as any)
    console.log("zhiDevice=>", zhiDevice)
    console.log("Init iife")
  }
}
