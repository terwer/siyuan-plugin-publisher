import { Plugin } from "siyuan"

export default class PublishTool extends Plugin {
  onload() {
    console.log("Publish Tool loaded")
  }

  onunload() {
    console.log("Publish Tool unloaded")
  }
}
