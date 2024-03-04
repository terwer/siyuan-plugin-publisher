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
import { createSiyuanAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { PluginInvoke } from "./invoke/pluginInvoke"
import { ConfigManager } from "~/siyuan/store/config.ts"
import MenuUtils from "~/siyuan/utils/menuUtils.ts"
import { PreferenceConfigManager } from "~/siyuan/store/preferenceConfigManager.ts"

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
      const prefSetting = await PreferenceConfigManager.loadConfig(self.pluginInstance)

      // 快速发布
      const quickMenus =
        prefSetting.showQuickMenu === false
          ? []
          : MenuUtils.getQuickMenus(this.pluginInstance, this.widgetInvoke, setting)
      // 扩展菜单
      const extendMenus =
        prefSetting.showExtendMenu === false
          ? []
          : await MenuUtils.getExtendMenus(this.pluginInstance, this.pluginInvoke)
      // 初始化菜单
      await this.addMenu(topBarElement.getBoundingClientRect(), quickMenus, extendMenus, prefSetting)
      self.logger.info("publisher menu loaded")
    })
  }

  private async addMenu(
    rect: DOMRect,
    quickMenus: IMenuItemOption[],
    extendMenus: IMenuItemOption[],
    prefSetting: any
  ) {
    const menu = new Menu("publisherMenu")

    // 仪表盘
    if (prefSetting.showArticleManageMenu !== false) {
      menu.addItem({
        icon: `iconPaste`,
        label: this.pluginInstance.i18n.articleManage + "<sup class='red'>new</sup>",
        click: () => {
          // this.widgetInvoke.showPublisherArticleManegeDialog()
          this.widgetInvoke.showPublisherArticleManegeTab()
        },
      })
      menu.addSeparator()
    }

    // 一键发布
    if (prefSetting.showQuickMenu !== false) {
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

      menu.addSeparator()
    }

    // 常规发布
    if (prefSetting.showSingleMenu !== false) {
      menu.addItem({
        iconHTML: icons.iconPen,
        label: this.pluginInstance.i18n.publishNormal,
        click: () => {
          this.widgetInvoke.showPublisherSinglePublishDialog()
        },
      })
      menu.addSeparator()
    }

    // 批量分发
    if (prefSetting.showBatchMenu !== false) {
      menu.addItem({
        iconHTML: `<svg class="b3-menu__icon" style=""><use xlink:href="#iconMove"></use></svg>`,
        label: this.pluginInstance.i18n.batchSync,
        click: () => {
          this.widgetInvoke.showPublisherBatchPublishDialog()
        },
      })
      menu.addSeparator()
    }

    // 图床管理
    if (prefSetting.showExtendMenu !== false) {
      const isPicgoInstalled = await this.pluginInvoke.preCheckPicgoPlugin()
      this.logger.info(`isPicgoInstalled=>${isPicgoInstalled}`)
      if (isPicgoInstalled) {
        // 图床
        menu.addItem({
          iconHTML: icons.iconPicbed,
          label: this.pluginInstance.i18n.picmanage,
          submenu: [
            {
              iconHTML: icons.iconPicture,
              label: this.pluginInstance.i18n.picbed,
              click: async () => {
                await this.pluginInvoke.showPicbedDialog()
              },
            },
            {
              iconHTML: icons.iconPicbed,
              label: this.pluginInstance.i18n.settingPicbed,
              click: async () => {
                await this.pluginInvoke.showPicbedSettingDialog()
              },
            },
          ],
        })
        menu.addSeparator()
      }
    }

    // AI工具
    if (prefSetting.showAIMenu !== false) {
      menu.addItem({
        iconHTML: icons.iconPicbed,
        label: this.pluginInstance.i18n.aitool,
        submenu: [
          // {
          //   iconHTML: `<svg class="b3-menu__icon" style=""><use xlink:href="#iconUsers"></use></svg>`,
          //   label: this.pluginInstance.i18n.aiChat,
          //   click: () => {
          //     this.widgetInvoke.showPublisherAiChatDialog()
          //   },
          // },
          {
            iconHTML: `<svg class="b3-menu__icon" style=""><use xlink:href="#iconAccount"></use></svg>`,
            label: this.pluginInstance.i18n.aiChat,
            click: () => {
              this.widgetInvoke.showPublisherAiChatTab()
            },
          },
        ],
      })
      menu.addSeparator()
    }

    // 扩展功能
    if (prefSetting.showExtendMenu !== false) {
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
      menu.addSeparator()
    }

    // 通用设置
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

    // 关于作者
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
