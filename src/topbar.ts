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
import { IMenuItemOption, Menu } from "siyuan"
import PageUtil from "./utils/pageUtil"
import HtmlUtils from "./utils/htmlUtils"
import { createAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { PluginInvoke } from "./invoke/pluginInvoke"
import { ObjectUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "./Constants"

/**
 * 顶部按钮
 */
export class Topbar {
  private logger
  private pluginInstance
  private widgetInvoke
  private pluginInvoke

  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createAppLogger("topbar")
    this.pluginInstance = pluginInstance
    this.pluginInvoke = new PluginInvoke(pluginInstance)
    this.widgetInvoke = new WidgetInvoke(pluginInstance)
  }

  public async initTopbar() {
    const quickMenus = await this.getQuickMenus()
    const topBarElement = this.pluginInstance.addTopBar({
      icon: icons.iconPlane,
      title: this.pluginInstance.i18n.publishTool,
      position: "left",
      callback: () => {
        this.addMenu(topBarElement.getBoundingClientRect(), quickMenus)
      },
    })
  }

  private async getQuickMenus() {
    const submenus = <IMenuItemOption[]>[]
    // 读取配置
    if (ObjectUtil.isEmptyObject(this.pluginInstance.cfg)) {
      // 配置错误，直接返回空
      return submenus
    }
    const setting = this.pluginInstance.cfg
    const dynJsonCfg = setting[DYNAMIC_CONFIG_KEY] as any
    this.logger.info("dynJsonCfg =>", dynJsonCfg.totalCfg)
    // 构造发布菜单
    dynJsonCfg.totalCfg.forEach((config: any) => {
      if (config.isEnabled === true) {
        const submenu = {
          iconHTML: `<span class="iconfont-icon">${config.platformIcon}</span>`,
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
    return submenus
  }

  private addMenu(rect: DOMRect, quickMenus: IMenuItemOption[]) {
    const menu = new Menu("publisherMenu")

    // 一键发布
    menu.addItem({
      icon: `iconRiffCard`,
      label: this.pluginInstance.i18n.publishTo,
      submenu: quickMenus,
    })

    // 常规发布
    menu.addSeparator()
    menu.addItem({
      iconHTML: icons.iconPen,
      label: this.pluginInstance.i18n.publishNormal,
      click: () => {
        this.widgetInvoke.showPublisherPublishDialog()
      },
    })

    // 发布预览
    menu.addSeparator()
    menu.addItem({
      iconHTML: icons.iconEye,
      label: this.pluginInstance.i18n.preview,
      click: () => {
        this.pluginInvoke.showBlogDialog()
      },
    })

    // 图床
    // menu.addSeparator()
    // menu.addItem({
    //   iconHTML: icons.iconPicture,
    //   label: this.pluginInstance.i18n.picbed,
    //   click: async () => {
    //     await this.pluginInvoke.showPicbedDialog()
    //   },
    // })

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
        // {
        //   iconHTML: icons.iconPicbed,
        //   label: this.pluginInstance.i18n.settingPicbed,
        //   click: async () => {
        //     await this.pluginInvoke.showPicbedSettingDialog()
        //   },
        // },
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
      label: this.pluginInstance.i18n.settingMenuTips,
      type: "readonly",
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
