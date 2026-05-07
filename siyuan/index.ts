/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { App, confirm, getFrontend, IObject, Model, Plugin } from "siyuan"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { createSiyuanAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { Topbar } from "./topbar"
import { ILogger } from "zhi-lib-base"
import { ConfigManager } from "~/siyuan/store/config.ts"
import MenuUtils from "~/siyuan/utils/menuUtils.ts"
import { PluginInvoke } from "~/siyuan/invoke/pluginInvoke.ts"
import { icons } from "~/siyuan/utils/svg.ts"
import { PreferenceConfigManager } from "~/siyuan/store/preferenceConfigManager.ts"

import "./index.styl"

/**
 * 发布工具插件入口
 *
 * @author terwer
 * @since 0.1.0
 */
export default class PublisherPlugin extends Plugin {
  private logger: ILogger
  private topbar: Topbar

  public isMobile: boolean
  public kernelApi: SiyuanKernelApi
  private readonly widgetInvoke: WidgetInvoke

  customTabObject: () => Model
  public tabInstance: any

  private publishSetting: any
  private prefSetting: any

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = createSiyuanAppLogger("index")

    const frontEnd = getFrontend()
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile"

    const siyuanConfig = new SiyuanConfig("", "")
    this.kernelApi = new SiyuanKernelApi(siyuanConfig)

    this.topbar = new Topbar(this)
    this.widgetInvoke = new WidgetInvoke(this)
  }

  openSetting(): void {
    void this.widgetInvoke.showPublisherPublishSettingDialog()
  }

  onload() {
    // 初始化菜单
    this.topbar.initTopbar()
    // 初始化自定义Tab
    this.initCustomTab()
    // mountFn
    this.mountFn()
  }

  onLayoutReady() {
    // onEvent
    this.onEvent()
  }

  onunload() {
    // unmountFn
    this.unmountFn()
    // offEvent
    this.offEvent()
  }

  // ================
  // private methods
  // ================
  private initCustomTab() {
    const that = this
    this.customTabObject = this.addTab({
      type: "publisher-plugin-custom-tab",
      async init() {
        this.element.innerHTML = `<p>加载中...</p>`
      },
      destroy() {
        delete that.tabInstance
        that.logger.info("publisher custopm tab destroyed")
      },
    })
  }

  private mountFn() {
    const elAlertBox = (msg: string) => {
      confirm("⚠️错误提示", msg, () => {})
    }

    const win = window as any
    win.syp = win.syp ?? {}
    win.syp.alert = elAlertBox
  }

  private unmountFn() {
    const win = window as any
    win.syp = undefined
  }

  private async onEvent() {
    // 预加载数据
    this.publishSetting = await ConfigManager.loadConfig(this)
    this.prefSetting = await PreferenceConfigManager.loadConfig(this)
    this.eventBus.on("click-editortitleicon", this.blockMenuEventListener)
  }

  private offEvent() {
    this.eventBus.off("click-editortitleicon", () => {})
  }

  /**
   * 添加文档菜单项
   */
  protected readonly blockMenuEventListener = async (e: CustomEvent) => {
    // 获取菜单信息
    const detail = e.detail
    this.logger.info("detail =>", detail)

    // 获取块菜单上下文
    const context: any = detail?.menu?.menus
    if (!context) {
      this.logger.error("获取发布菜单失败")
      return
    }
    this.logger.debug("当前上下文 =>", context)

    const pageId = detail?.protyle?.block.rootID
    if (!pageId) {
      this.logger.error("无法获取文档 ID")
      return
    }
    this.logger.info("当前文档 ID =>", detail)

    if (this.prefSetting.showDocQuickMenu === false) {
      this.logger.warn("文档发布菜单已关闭")
      return
    }

    // 快速发布
    const quickMenus = MenuUtils.getQuickMenus(this, this.widgetInvoke, this.publishSetting, pageId)
    context.push({
      iconHTML: `<span class="iconfont-icon">${icons.iconPlane}</span>`,
      label: this.i18n.publishToQuick,
      submenu: quickMenus,
    })
    // AI聊天
    context.push({
      iconHTML: `<span class="iconfont-icon">${icons.iconEye}</span>`,
      label: this.i18n.aiChat,
      click: async () => {
        await this.widgetInvoke.showPublisherAiChatDialog(pageId)
      },
    })
  }
}
