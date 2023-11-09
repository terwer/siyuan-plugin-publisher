/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { App, confirm, getFrontend, IMenuItemOption, IModel, IObject, Menu, Plugin, showMessage } from "siyuan"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { createSiyuanAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { Topbar } from "./topbar"
import { ILogger } from "zhi-lib-base"

import "./index.styl"
import { ConfigManager } from "~/siyuan/store/config.ts"
import MenuUtils from "~/siyuan/utils/menuUtils.ts"
import { PluginInvoke } from "~/siyuan/invoke/pluginInvoke.ts"
import { icons } from "~/siyuan/utils/svg.ts"
import { PreferenceConfigManager } from "~/siyuan/store/preferenceConfigManager.ts"

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
  private widgetInvoke: WidgetInvoke
  private pluginInvoke: PluginInvoke

  customTabObject: () => IModel
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
    this.pluginInvoke = new PluginInvoke(this)
  }

  openSetting(): void {
    this.widgetInvoke.showPublisherPublishSettingDialog()
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
    this.logger.info("当前上下文 =>", context)

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
  }
}
