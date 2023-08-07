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
import { createSiyuanAppLogger } from "../appLogger"
import PageUtil from "../utils/pageUtil"
import { showIframeDialog } from "../iframeDialog"
import PublisherPlugin from "../index"
import { StrUtil } from "zhi-common"
import { showMessage } from "siyuan"

/**
 * 挂件相关
 */
export class WidgetInvoke {
  private logger
  private readonly pluginInstance

  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createSiyuanAppLogger("widget-invoke")
    this.pluginInstance = pluginInstance
  }

  public async showPublisherBatchPublishDialog() {
    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)
    if (StrUtil.isEmptyString(pageId)) {
      showMessage(`文档ID不能为空，注意：您必须打开当前文档才能进行发布操作`, 2000, "error")
      return
    }
    await this.showPage(`/?id=${pageId}`)
  }

  public async showPublisherSinglePublishDialog() {
    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)
    if (StrUtil.isEmptyString(pageId)) {
      showMessage(`文档ID不能为空，注意：您必须打开当前文档才能进行发布操作`, 2000, "error")
      return
    }
    await this.showPage(`/publish/singlePublish?id=${pageId}`)
  }

  public async showPublisherQuickPublishDialog(key: string) {
    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)
    if (StrUtil.isEmptyString(key) || StrUtil.isEmptyString(pageId)) {
      showMessage(`平台key和文档ID不能为空，注意：您必须打开当前文档才能进行发布操作`, 2000, "error")
      return
    }
    await this.showPage(`/workers/quickPublish/${key}/${pageId}`, false, "480px", "55px", true)
  }

  public async showPublisherPublishSettingDialog() {
    await this.showPage("/setting/publish")
  }

  public async showPublisherGeneralSettingDialog() {
    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)
    await this.showPage(`/setting/general?id=${pageId}`)
  }

  private async showPage(pageUrl: string, isReload?: boolean, w?: string, h?: string, noscroll?: boolean) {
    const deviceType: DeviceTypeEnum = DeviceDetection.getDevice()
    this.logger.info(`you are from ${deviceType}`)

    const url = `/plugins/siyuan-plugin-publisher/#${pageUrl}`
    this.logger.info("will show iframe page =>", url)

    if (isReload) {
      const destroyCb = () => {
        window.location.reload()
      }
      showIframeDialog(this.pluginInstance, url, w, h, noscroll, destroyCb)
    } else {
      showIframeDialog(this.pluginInstance, url, w, h, noscroll)
    }
  }
}
