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
import { Widget } from "./widget"

/**
 * 顶部按钮
 */
export class Topbar {
  private logger
  private pluginInstance
  private widget

  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createAppLogger("topbar")
    this.pluginInstance = pluginInstance
    this.widget = new Widget(pluginInstance)
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
    // if (!this.data) {
    //   await this.loadData(STORAGE_NAME)
    // }

    const menu = new Menu("publisherMenu")

    // 发布到
    menu.addItem({
      icon: `iconRiffCard`,
      label: this.pluginInstance.i18n.publishTo,
      //   submenu: [
      //     {
      //       iconHTML: iconPublish.iconCnblogs,
      //       label: this.i18n.platformCnblogs,
      //       click: async () => {
      //         const blogApi = PublishSdk.blogApi(BlogTypeEnum.BlogTypeEnum_Metaweblog)
      //         const usersBlogs = blogApi.getUsersBlogs()
      //         this.logger.debug("发布到博客园", usersBlogs)
      //       },
      //     },
      //     {
      //       iconHTML: iconPublish.iconTypecho,
      //       label: this.i18n.platformTypecho,
      //       disabled: true,
      //       click: () => {
      //         this.logger.debug("发布到Typecho")
      //       },
      //     },
      //     {
      //       iconHTML: iconPublish.iconWordpress,
      //       label: this.i18n.platformWordpress,
      //       click: () => {
      //         this.logger.debug("发布到WordPress")
      //       },
      //     },
      //     {
      //       iconHTML: iconPublish.iconYuque,
      //       label: this.i18n.platformYuque,
      //       click: () => {
      //         this.logger.debug("发布到语雀")
      //       },
      //     },
      //     {
      //       iconHTML: iconPublish.iconGithub,
      //       label: this.i18n.platformGithub,
      //       submenu: [
      //         {
      //           iconHTML: iconPublish.iconHexo,
      //           label: this.i18n.platformHexo,
      //           click: () => {
      //             this.logger.debug("发布到Hexo")
      //           },
      //         },
      //         {
      //           iconHTML: iconPublish.iconHugo,
      //           label: this.i18n.platformHugo,
      //           click: () => {
      //             this.logger.debug("发布到Hugo")
      //           },
      //         },
      //         {
      //           iconHTML: iconPublish.iconVue,
      //           label: this.i18n.platformVitepress,
      //           click: () => {
      //             this.logger.debug("发布到Vitepress")
      //           },
      //         },
      //       ],
      //     },
      //   ],
    })

    // // 图床
    // menu.addSeparator()
    // menu.addItem({
    //   iconHTML: iconPublish.iconPicture,
    //   label: this.i18n.picbed,
    //   click: () => {
    //     this._showPicbedDialog()
    //   },
    // })
    //
    // // 设置
    // menu.addSeparator()
    // menu.addItem({
    //   icon: "iconSettings",
    //   label: this.i18n.setting,
    //   click: () => {
    //     this._showSettingDialog()
    //   },
    //   submenu: [
    //     {
    //       iconHTML: iconPublish.iconPreference,
    //       label: this.i18n.settingGeneral,
    //       click: () => {
    //         console.log(11111)
    //       },
    //     },
    //     {
    //       iconHTML: iconPublish.iconPicbed,
    //       label: this.i18n.settingPicbed,
    //     },
    //     {
    //       iconHTML: iconPublish.iconPublish,
    //       label: this.i18n.settingPublish,
    //     },
    //   ],
    // })

    // 挂件版
    menu.addSeparator()
    menu.addItem({
      icon: "iconTransform",
      label: this.pluginInstance.i18n.publisherWidget,
      click: () => {
        this.widget.showPublisherWidget()
      },
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
