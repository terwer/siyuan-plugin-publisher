/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { App, confirm, getFrontend, IObject, Plugin } from "siyuan"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { createSiyuanAppLogger } from "./appLogger"
import { Topbar } from "./topbar"
import { ILogger } from "zhi-lib-base"
import { ConfigManager } from "~/siyuan/store/config.ts"
import { PreferenceConfigManager } from "~/siyuan/store/preferenceConfigManager.ts"
import { V2Host } from "~/siyuan/v2/v2Host.ts"
import { buildDocQuickPublishMenus, docMenuIcons } from "~/siyuan/v2/v2DocMenu.ts"

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
  /** 全插件唯一 V2 宿主，避免 Topbar / 文档菜单各建实例导致双 Menu 与卸载竞态 */
  public readonly v2Host: V2Host

  private publishSetting: any
  private prefSetting: any

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = createSiyuanAppLogger("index")

    const frontEnd = getFrontend()
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile"

    const siyuanConfig = new SiyuanConfig("", "")
    this.kernelApi = new SiyuanKernelApi(siyuanConfig)

    this.v2Host = new V2Host(this)
    this.topbar = new Topbar(this)
  }

  openSetting(): void {
    // 思源宿主「插件设置」入口：直接打开 V2 设置视图
    void this.v2Host.show({ initialView: "settings" })
  }

  onload() {
    // 初始化菜单
    this.topbar.initTopbar()
    // mountFn
    this.mountFn()
  }

  onLayoutReady() {
    // onEvent
    this.onEvent()
  }

  onunload() {
    void this.v2Host.close()
    // unmountFn
    this.unmountFn()
    // offEvent
    this.offEvent()
  }

  // ================
  // private methods
  // ================
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

    // 面板锚定到用户实际点击的文档标题图标，避免无锚点时铺满窗口
    const protyleElement = detail?.protyle?.element as HTMLElement | undefined
    const anchorElement = protyleElement?.querySelector<HTMLElement>(".protyle-title__icon") ?? protyleElement

    // 快速发布：每个已启用平台一项，点击即在 V2 面板内对该文档发布该平台
    const quickMenus = buildDocQuickPublishMenus(this.publishSetting, this.v2Host, pageId, anchorElement)
    context.push({
      iconHTML: `<span class="iconfont-icon">${docMenuIcons.quickPublish}</span>`,
      label: this.i18n.publishToQuick,
      submenu: quickMenus,
    })
    // AI聊天
    context.push({
      iconHTML: `<span class="iconfont-icon">${docMenuIcons.aiChat}</span>`,
      label: this.i18n.aiChat,
      click: async () => {
        await this.v2Host.show({ anchorElement, initialView: "ai_chat", docId: pageId })
      },
    })
  }
}
