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

import { DeviceDetection, DeviceTypeEnum } from "zhi-device"
import { createAppLogger } from "../appLogger"
import PageUtil from "../utils/pageUtil"
import { showIframeDialog } from "../iframeDialog"
import { isDev } from "../Constants"
import PublisherPlugin from "../index"

/**
 * 挂件相关
 */
export class WidgetInvoke {
  private logger
  private readonly pluginInstance

  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createAppLogger("widget-invoke")
    this.pluginInstance = pluginInstance
  }

  public showPublisherWidget(type?: "blog") {
    const win = window as any
    const deviceType: DeviceTypeEnum = DeviceDetection.getDevice()
    this.logger.info(`you are from ${deviceType}`)

    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)

    if (deviceType == DeviceTypeEnum.DeviceType_Siyuan_MainWin) {
      const libBase = "/plugins/siyuan-publisher/"
      import(`${libBase}/libs/plugin-publisher-bridge/index.js` as any).then((bridge) => {
        const publisherBridge = new bridge.default()
        publisherBridge.init().then(() => {
          let pageUrl
          switch (type) {
            case "blog":
              // 博客首页
              pageUrl = "blog/index.html"
              break
            default:
              // 发布首页
              pageUrl = "index.html"
              break
          }
          if (!pageId && pageUrl === "index.html") {
            pageUrl = "blog/index.html"
          }

          win.syp.renderPublishHelper(pageId, pageUrl, win, isDev)
          this.logger.debug("publisherHook inited")
        })
      })
    } else {
      const publisherIndex = `/widgets/sy-post-publisher/index.html`
      showIframeDialog(this.pluginInstance, publisherIndex)
    }
  }
}
