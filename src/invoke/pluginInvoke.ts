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

import PublisherPlugin from "../index"
import { createAppLogger } from "../appLogger"
import { showIframeDialog } from "../iframeDialog"
import PageUtil from "../utils/pageUtil"
import { IObject } from "siyuan"

/**
 * 插件相关
 */
export class PluginInvoke {
  private logger
  private readonly pluginInstance
  private picgoPluginBase = "/plugins/siyuan-plugin-picgo/#"
  private blogPluginBase = "/plugins/siyuan-blog/#"

  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createAppLogger("plugin-invoke")
    this.pluginInstance = pluginInstance
  }

  public async showBlogDialog() {
    const pageId: string | undefined = PageUtil.getPageId()

    // 检测是否安装博客插件
    await this.preCheckPicgoPlugin()

    // 临时开启预览权限
    let isShared = false
    const attrs = await this.pluginInstance.kernelApi.getBlockAttrs(pageId)
    if (attrs["custom-publish-status"] === "publish") {
      isShared = true
    } else {
      await this.pluginInstance.kernelApi.setBlockAttrs(pageId, {
        "custom-publish-status": "preview",
      })
      this.logger.info("The document is not shared, will temporarily turn on preview permissions")
    }

    const pageUrl = `${this.blogPluginBase}/post/${pageId}`
    showIframeDialog(this.pluginInstance, pageUrl, async (options?: IObject) => {
      // 回收预览权限
      if (!isShared) {
        await this.pluginInstance.kernelApi.setBlockAttrs(pageId, {
          "custom-publish-status": "draft",
        })
        this.logger.info("Temporary permissions are turned off")
      }
    })
  }

  public async showPicbedDialog() {
    await this.preCheckPicgoPlugin()

    const pageId: string | undefined = PageUtil.getPageId()
    const pageUrl = `${this.picgoPluginBase}/?pageId=${pageId}`
    showIframeDialog(this.pluginInstance, pageUrl)
  }

  public async showPicbedSettingDialog() {
    await this.preCheckPicgoPlugin()

    const pageId: string | undefined = PageUtil.getPageId()
    const pageUrl = `${this.picgoPluginBase}/setting?pageId=${pageId}`
    showIframeDialog(this.pluginInstance, pageUrl)
  }

  private async preCheckPicgoPlugin() {
    // TODO 检测是否安装 picgo 插件
    const isInstalled = true
    if (!isInstalled) {
      // 安装
    }
    return true
  }

  private async preCheckBlogPlugin() {
    // TODO 检测是否安装 blog 插件
    const isInstalled = true
    if (!isInstalled) {
      // 安装
    }
    return true
  }
}
