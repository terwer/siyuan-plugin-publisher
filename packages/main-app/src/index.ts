import { App, IObject, Plugin } from "siyuan"
import { Topbar } from "@/topbar.ts"

/**
 * 发布工具插件入口
 *
 * @author terwer
 * @since 0.1.0
 */
export default class PublisherPlugin extends Plugin {
  private vueApp: any = null
  private topbar: Topbar = {} as Topbar

  constructor(options: { app: App; name: string; i18n: IObject }) {
    super(options)
    // topbar
    this.topbar = new Topbar(this)
  }

  async onload() {
    // 初始化工具栏
    this.topbar.initTopbar()
  }

  async onunload() {
    // 卸载应用
    if (this.vueApp) {
      this.vueApp.unmount()
      this.vueApp = null
    }
  }

  // ==================
  // private methods
  // ==================
}
