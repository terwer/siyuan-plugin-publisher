import { Plugin } from "siyuan"

/**
 * 发布工具插件入口
 *
 * @author terwer
 * @since 0.1.0
 */
export default class PublisherPlugin extends Plugin {
  async onload() {
    // 注册命令
    this.addCommand({
      langKey: "publisher",
      hotkey: "⌘⇧P",
      callback: () => {
        console.log("publisher opened")
      },
    })

    // 注册顶部图标
    this.addTopBar({
      icon: "iconPublish",
      title: this.i18n.publisher,
      callback: () => {
        console.log("publisher added to topbar")
      },
    })
  }

  async onunload() {}
}
