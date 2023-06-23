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
import { Menu } from "siyuan"
import PageUtil from "./utils/pageUtil"
import HtmlUtils from "./utils/htmlUtils"
import { createAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { PluginInvoke } from "./invoke/pluginInvoke"

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

  public initTopbar() {
    const topBarElement = this.pluginInstance.addTopBar({
      icon: icons.iconPlane,
      title: this.pluginInstance.i18n.publishTool,
      position: "left",
      callback: async () => {
        await this.addMenu(topBarElement.getBoundingClientRect())
      },
    })
  }

  private async addMenu(rect: DOMRect) {
    const menu = new Menu("publisherMenu")

    // 一键发布
    menu.addItem({
      icon: `iconRiffCard`,
      label: this.pluginInstance.i18n.publishTo,
      submenu: [
        {
          iconHTML: icons.iconCnblogs,
          label: this.pluginInstance.i18n.platformCnblogs,
          click: async () => {
            this.logger.debug("发布到博客园")
          },
        },
        {
          iconHTML: icons.iconTypecho,
          label: this.pluginInstance.i18n.platformTypecho,
          disabled: true,
          click: () => {
            this.logger.debug("发布到Typecho")
          },
        },
        {
          iconHTML: icons.iconWordpress,
          label: this.pluginInstance.i18n.platformWordpress,
          click: () => {
            this.logger.debug("发布到WordPress")
          },
        },
        {
          iconHTML: icons.iconYuque,
          label: this.pluginInstance.i18n.platformYuque,
          click: () => {
            this.logger.debug("发布到语雀")
          },
        },
        {
          iconHTML: icons.iconGithub,
          label: this.pluginInstance.i18n.platformGithub,
          submenu: [
            {
              iconHTML: icons.iconHexo,
              label: this.pluginInstance.i18n.platformHexo,
              click: () => {
                this.logger.debug("发布到Hexo")
              },
            },
            {
              iconHTML: icons.iconHugo,
              label: this.pluginInstance.i18n.platformHugo,
              click: () => {
                this.logger.debug("发布到Hugo")
              },
            },
            {
              iconHTML: icons.iconVue,
              label: this.pluginInstance.i18n.platformVitepress,
              click: () => {
                this.logger.debug("发布到Vitepress")
              },
            },
          ],
        },
      ],
    })

    // 常规发布
    menu.addSeparator()
    menu.addItem({
      iconHTML: icons.iconPen,
      label: this.pluginInstance.i18n.publishNormal,
      click: () => {
        this.widgetInvoke.showPublisherWidget("blog")
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
    menu.addSeparator()
    menu.addItem({
      iconHTML: icons.iconPicture,
      label: this.pluginInstance.i18n.picbed,
      click: async () => {
        await this.pluginInvoke.showPicbedDialog()
      },
    })

    // 设置
    menu.addSeparator()
    menu.addItem({
      icon: "iconSettings",
      label: this.pluginInstance.i18n.setting,
      click: () => {
        // this.showSettingDialog()
      },
      submenu: [
        {
          iconHTML: icons.iconPreference,
          label: this.pluginInstance.i18n.settingGeneral,
          click: () => {},
        },
        {
          iconHTML: icons.iconPicbed,
          label: this.pluginInstance.i18n.settingPicbed,
          click: async () => {
            await this.pluginInvoke.showPicbedSettingDialog()
          },
        },
        {
          iconHTML: icons.iconPublish,
          label: this.pluginInstance.i18n.settingPublish,
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
