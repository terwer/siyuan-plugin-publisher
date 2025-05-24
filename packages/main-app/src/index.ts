import { Plugin } from "siyuan"
import { createBootStrap } from "./bootstrap"

/**
 * 发布工具插件入口
 *
 * @author terwer
 * @since 0.1.0
 */
export default class PublisherPlugin extends Plugin {
  private vueApp: any = null

  async onload() {
    // 注册命令
    this.addCommand({
      langKey: "publisher",
      hotkey: "⌘⇧P",
      callback: () => {
        this.openPublisher()
      },
    })

    // 注册顶部图标
    this.addTopBar({
      icon: "iconPublish",
      title: this.i18n.publisher,
      callback: () => {
        this.openPublisher()
      },
    })

    console.log("publisher loaded")
  }

  private openPublisher() {
    // 创建或获取挂载点
    let mountEl = document.getElementById("publisher-app")
    if (!mountEl) {
      mountEl = document.createElement("div")
      mountEl.id = "publisher-app"
      document.body.appendChild(mountEl)
    }

    // 创建并挂载应用，传入真实的思源实例
    if (!this.vueApp) {
      this.vueApp = createBootStrap({ appInstance: this }, mountEl)
    }
  }

  async onunload() {
    // 卸载应用
    if (this.vueApp) {
      this.vueApp.unmount()
      this.vueApp = null
    }
  }
}
