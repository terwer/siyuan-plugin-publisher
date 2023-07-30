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

  public showPublisherPublishDialog() {
    this.showPage("/")
  }

  public showPublisherGeneralSettingDialog() {
    this.showPage("/setting/general")
  }

  public showPublisherPublishSettingDialog() {
    this.showPage("/setting/publish")
  }

  public showPublisherPlatformSettingDialog() {
    this.showPage("/setting/platform")
  }

  private showPage(pageUrl) {
    const win = window as any
    const deviceType: DeviceTypeEnum = DeviceDetection.getDevice()
    this.logger.info(`you are from ${deviceType}`)

    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)

    const url = `/widgets/sy-post-publisher/#${pageUrl}`
    showIframeDialog(this.pluginInstance, url)
  }
}
