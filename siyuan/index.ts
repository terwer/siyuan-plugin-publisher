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

import { App, getFrontend, IObject, Plugin } from "siyuan"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { createAppLogger } from "./appLogger"
import { WidgetInvoke } from "./invoke/widgetInvoke"
import { Topbar } from "./topbar"

import "./index.styl"
import { ConfigManager } from "./store/config"

export default class PublisherPlugin extends Plugin {
  private logger
  private topbar

  public isMobile: boolean
  public kernelApi: SiyuanKernelApi
  private widgetInvoke
  private cfg

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = createAppLogger("index")

    const frontEnd = getFrontend()
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile"

    const siyuanConfig = new SiyuanConfig("", "")
    this.kernelApi = new SiyuanKernelApi(siyuanConfig)

    this.topbar = new Topbar(this)
    this.widgetInvoke = new WidgetInvoke(this)
  }

  openSetting(): void {
    this.widgetInvoke.showPublisherPublishSettingDialog()
  }

  async onload() {
    // 预加载数据
    this.cfg = await ConfigManager.loadConfig(this)
    // 初始化菜单
    await this.topbar.initTopbar()
  }
}