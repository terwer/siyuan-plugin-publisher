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

import PublisherPlugin from "./index"
import { icons } from "./utils/svg"
import { IMenuItemOption, Menu, showMessage } from "siyuan"
import PageUtil from "./utils/pageUtil"
import HtmlUtils from "./utils/htmlUtils"
import { createSiyuanAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { PluginInvoke } from "./invoke/pluginInvoke"
import { ObjectUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "./Constants"
import { ConfigManager } from "~/siyuan/store/config.ts"

/**
 * 顶部按钮
 */
export class Topbar {
  private logger
  private pluginInstance
  private widgetInvoke
  private pluginInvoke

  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createSiyuanAppLogger("topbar")
    this.pluginInstance = pluginInstance
    this.pluginInvoke = new PluginInvoke(pluginInstance)
    this.widgetInvoke = new WidgetInvoke(pluginInstance)
  }

  public initTopbar() {
    const self = this
    const topBarElement = this.pluginInstance.addTopBar({
      icon: icons.iconPlane,
      title: this.pluginInstance.i18n.publishTool,
      position: "left",
      callback: () => {},
    })
    topBarElement.addEventListener("click", async () => {
      // 预加载数据
      const setting = await ConfigManager.loadConfig(self.pluginInstance)
      // 快速发布
      const quickMenus = self.getQuickMenus(setting)
      // 扩展菜单
      const extendMenus = await self.getExtendMenus()
      // 初始化菜单
      this.addMenu(topBarElement.getBoundingClientRect(), quickMenus, extendMenus)
      self.logger.info("publisher menu loaded")
    })
  }

  private getQuickMenus(setting: any) {
    const submenus = <IMenuItemOption[]>[]
    // 读取配置
    if (ObjectUtil.isEmptyObject(setting)) {
      // 配置错误，直接返回空
      return submenus
    }
    const dynJsonCfg = setting[DYNAMIC_CONFIG_KEY] as any
    this.logger.info("dynJsonCfg =>", dynJsonCfg.totalCfg)
    // 构造发布菜单
    dynJsonCfg.totalCfg?.forEach((config: any) => {
      let icon = `<span class="iconfont-icon">${config.platformIcon}</span>`
      // 修复图片不展示问题
      if (/^\<img/.test(config.platformIcon) && config.platformIcon.indexOf("./images") > -1) {
        icon = config.platformIcon.replace(
          /\.\/images/g,
          `${window.location.origin}/plugins/siyuan-plugin-publisher/images`
        )
        icon = `<span class="img-icon">${icon}</span>`
      }
      if (config.isEnabled === true) {
        // http://127.0.0.1:6806/plugins/siyuan-plugin-publisher/i

        const submenu = {
          iconHTML: `${icon}`,
          label: config.platformName,
          disabled: !config.isAuth,
          click: async () => {
            const key = config.platformKey
            await this.widgetInvoke.showPublisherQuickPublishDialog(key)
          },
        }
        submenus.push(submenu)
      }
    })

    if (submenus.length == 0) {
      return undefined
    }
    return submenus
  }

  private async getExtendMenus() {
    const isBlogInstalled = await this.pluginInvoke.preCheckBlogPlugin()
    const isPicgoInstalled = await this.pluginInvoke.preCheckPicgoPlugin()
    this.logger.info(`isBlogInstalled=>${isBlogInstalled}`)
    this.logger.info(`isPicgoInstalled=>${isPicgoInstalled}`)

    const extmenus = <IMenuItemOption[]>[]
    if (isBlogInstalled) {
      // 发布预览
      const extPreviewMenu = {
        iconHTML: icons.iconEye,
        label: this.pluginInstance.i18n.preview,
        click: () => {
          this.pluginInvoke.showBlogDialog()
        },
      }
      extmenus.push(extPreviewMenu)
    }
    if (isPicgoInstalled) {
      // 图床
      const extPicBedMenu = {
        iconHTML: icons.iconPicture,
        label: this.pluginInstance.i18n.picbed,
        click: async () => {
          await this.pluginInvoke.showPicbedDialog()
        },
      }
      extmenus.push(extPicBedMenu)

      const extPicBedSettingMenu = {
        iconHTML: icons.iconPicbed,
        label: this.pluginInstance.i18n.settingPicbed,
        click: async () => {
          await this.pluginInvoke.showPicbedSettingDialog()
        },
      }
      extmenus.push(extPicBedSettingMenu)
    }
    if (extmenus.length == 0) {
      return undefined
    }
    return extmenus
  }

  private addMenu(rect: DOMRect, quickMenus: IMenuItemOption[], extendMenus: IMenuItemOption[]) {
    const menu = new Menu("publisherMenu")

    // 一键发布
    menu.addItem({
      icon: `iconRiffCard`,
      label: this.pluginInstance.i18n.publishTo,
      submenu: quickMenus,
      click: () => {
        if (!quickMenus) {
          showMessage("请先在 设置->发布设置配置平台并启用", 7000, "error")
        }
      },
    })

    // 常规发布
    menu.addSeparator()
    menu.addItem({
      iconHTML: icons.iconPen,
      label: this.pluginInstance.i18n.publishNormal,
      click: () => {
        this.widgetInvoke.showPublisherSinglePublishDialog()
      },
    })

    // 批量分发
    menu.addSeparator()
    menu.addItem({
      iconHTML: `<svg class="b3-menu__icon" style=""><use xlink:href="#iconMove"></use></svg>`,
      label: this.pluginInstance.i18n.batchSync,
      click: () => {
        this.widgetInvoke.showPublisherBatchPublishDialog()
      },
    })

    // AI聊天
    menu.addSeparator()
    menu.addItem({
      iconHTML: `<svg class="b3-menu__icon" style=""><use xlink:href="#iconUsers"></use></svg>`,
      label: this.pluginInstance.i18n.aiChat,
      click: () => {
        this.widgetInvoke.showPublisherAiChatDialog()
      },
    })

    // AI聊天Tab版
    menu.addSeparator()
    menu.addItem({
      iconHTML: `<svg class="b3-menu__icon" style=""><use xlink:href="#iconAccount"></use></svg>`,
      label: this.pluginInstance.i18n.aiChatTab,
      click: () => {
        this.widgetInvoke.showPublisherAiChatTab()
      },
    })

    // 扩展功能
    menu.addSeparator()
    menu.addItem({
      icon: `iconBazaar`,
      label: this.pluginInstance.i18n.extendFunction,
      submenu: extendMenus,
      click: () => {
        if (!extendMenus) {
          showMessage(
            "扩展功能需配合其他插件使用，目前支持在线分享、PicGo插件。请先下载在并启用扩展插件。",
            7000,
            "error"
          )
        }
      },
    })

    // 设置
    menu.addSeparator()
    menu.addItem({
      icon: "iconSettings",
      label: this.pluginInstance.i18n.setting,
      click: () => {},
      submenu: [
        {
          iconHTML: icons.iconPublish,
          label: this.pluginInstance.i18n.settingPublish,
          click: () => {
            this.widgetInvoke.showPublisherPublishSettingDialog()
          },
        },
        {
          iconHTML: icons.iconPreference,
          label: this.pluginInstance.i18n.settingGeneral,
          click: () => {
            this.widgetInvoke.showPublisherGeneralSettingDialog()
          },
        },
      ],
    })

    // 当前文档ID
    const pageId = PageUtil.getPageId()
    menu.addSeparator()
    menu.addItem({
      iconHTML: icons.iconOl,
      label: this.pluginInstance.i18n.copyPageId,
      click: async () => {
        await HtmlUtils.copyToClipboard(pageId)
        this.pluginInstance.kernelApi.pushMsg({
          msg: `当前文档ID已复制=>${pageId}`,
          timeout: 3000,
        })
        this.logger.info("当前文档ID已复制", pageId)
      },
    })

    // slogan
    menu.addSeparator()
    menu.addItem({
      icon: "iconSparkles",
      label: this.pluginInstance.i18n.settingAbout,
      click: () => {
        this.widgetInvoke.showPublisherAboutDialog()
      },
    })

    if (this.pluginInstance.isMobile) {
      menu.fullscreen()
    } else {
      menu.open({
        x: rect.right,
        y: rect.bottom,
        isLeft: true,
      })
    }
  }
}
