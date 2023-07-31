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
import PublisherPlugin from "../index"
import { StrUtil } from "zhi-common"
import { showMessage } from "siyuan"
import { isFileExists } from "../utils/utils"

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

  public async showPublisherPublishDialog() {
    await this.showPage("/")
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
    await this.showPage(`/workers/quickPublish/${key}/${pageId}`, false, "20%", "10%", true)
  }

  public async showPublisherPublishSettingDialog() {
    await this.showPage("/setting/publish", true)
  }

  public async showPublisherGeneralSettingDialog() {
    await this.showPage("/setting/general")
  }

  private async showPage(pageUrl: string, isReload?: boolean, w?: string, h?: string, noscroll?: boolean) {
    const deviceType: DeviceTypeEnum = DeviceDetection.getDevice()
    this.logger.info(`you are from ${deviceType}`)

    const flag = await this.preCheckSypWidget()
    if (!flag) {
      return
    }

    const url = `/widgets/sy-post-publisher/#${pageUrl}`
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

  private async preCheckSypWidget() {
    // 检测是否安装 发布挂件
    const isInstalled = await isFileExists(
      this.pluginInstance.kernelApi,
      "/data/widgets/sy-post-publisher/widget.json",
      "text"
    )
    if (!isInstalled) {
      // 安装
      showMessage(`该功能需要发布工具挂件版支持，请在集市安装 [发布工具挂件版] 挂件 v0.9.0+ 以上版本`, 7000, "error")
      return
    }
    return true
  }
}
