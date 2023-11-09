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

import { IMenuItemOption } from "siyuan"
import { ObjectUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "../Constants.ts"
import CrossPageUtils from "../../cross/crossPageUtils.ts"
import { icons } from "./svg.ts"
import HtmlUtils from "./htmlUtils.ts"
import { WidgetInvoke } from "../invoke/widgetInvoke.ts"
import PublisherPlugin from "../index.ts"
import { PluginInvoke } from "../invoke/pluginInvoke.ts"
import PageUtils from "./pageUtils.ts"

class MenuUtils {
  public static getQuickMenus(
    pluginInstance: PublisherPlugin,
    widgetInvoke: WidgetInvoke,
    setting: any,
    pageId?: string
  ) {
    if (!pageId) {
      pageId = PageUtils.getPageId()
      if (pageId == "") {
        pageId = undefined
      }
    }

    const submenus = <IMenuItemOption[]>[]
    // 读取配置
    if (ObjectUtil.isEmptyObject(setting)) {
      // 配置错误，直接返回空
      return submenus
    }
    const dynJsonCfg = setting[DYNAMIC_CONFIG_KEY] as any
    // 构造发布菜单
    dynJsonCfg.totalCfg?.forEach((config: any) => {
      let icon = `<span class="iconfont-icon">${config.platformIcon}</span>`
      // 修复图片不展示问题
      if (/^<img/.test(config.platformIcon) && config.platformIcon.indexOf("./images") > -1) {
        icon = config.platformIcon.replace(
          /\.\/images/g,
          `${window.location.origin}/plugins/siyuan-plugin-publisher/images`
        )
        icon = `<span class="img-icon">${icon}</span>`
      }
      if (config.isEnabled === true) {
        const submenu = {
          iconHTML: `${icon}`,
          label: CrossPageUtils.longPlatformName(config.platformName, 11),
          disabled: !config.isAuth,
          click: async () => {
            const key = config.platformKey
            await widgetInvoke.showPublisherQuickPublishDialog(key, pageId)
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

  public static async getExtendMenus(pluginInstance: PublisherPlugin, pluginInvoke: PluginInvoke, pageId?: string) {
    if (!pageId) {
      pageId = PageUtils.getPageId()
      if (pageId == "") {
        pageId = undefined
      }
    }

    const isBlogInstalled = await pluginInvoke.preCheckBlogPlugin()

    const extmenus = <IMenuItemOption[]>[]
    if (isBlogInstalled) {
      // 发布预览
      const extPreviewMenu = {
        iconHTML: icons.iconEye,
        label: pluginInstance.i18n.preview,
        click: () => {
          pluginInvoke.showBlogDialog()
        },
      }
      extmenus.push(extPreviewMenu)
    }

    // 当前文档ID
    const docIdMenu = {
      iconHTML: icons.iconOl,
      label: pluginInstance.i18n.copyPageId,
      click: async () => {
        await HtmlUtils.copyToClipboard(pageId)
        await pluginInstance.kernelApi.pushMsg({
          msg: `当前文档ID已复制=>${pageId}`,
          timeout: 3000,
        })
      },
    }
    extmenus.push(docIdMenu)

    if (extmenus.length == 0) {
      return undefined
    }
    return extmenus
  }
}

export default MenuUtils
