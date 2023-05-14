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

import { PublishHook } from "@terwer/publisher-hook"
import { Env } from "zhi-env"
import { LogFactory, LogLevelEnum, DefaultLogger } from "zhi-log"
import { SiyuanDevice } from "zhi-device"

/**
 * 挂件桥接器
 *
 * @author terwer
 * @version 1.0.0
 * @since 0.6.8
 */
class PublishBridge {
  private readonly REPO_HASH_0_8_0 = "06148220cfc6344e18225d82604a193cc173f511"
  private logger: DefaultLogger
  private publishHook: PublishHook
  private siyuanDevice

  constructor() {
    const env = new Env(import.meta.env)
    this.logger = LogFactory.customLogFactory(LogLevelEnum.LOG_LEVEL_INFO, "publish-bridge", env).getLogger()
    this.siyuanDevice = SiyuanDevice
    this.publishHook = new PublishHook()
  }

  public async init(): Promise<void> {
    this.logger.info("Initiating sy-post-publisher from publish bridge ...")
    // 统一的初始化入口
    try {
      const dataDir = this.siyuanDevice.siyuanDataPath()
      const sypFolder = `${dataDir}/widgets/sy-post-publisher`
      const fs = this.siyuanDevice.requireLib("fs")
      this.logger.info("Widget sy-post-publisher folder=>", sypFolder)
      if (!fs.existsSync(sypFolder)) {
        this.logger.info("Widget sy-post-publisher not exist, downloading...")
        // 下载插件并解压
        await this.doDownload()
        this.logger.info("Widget sy-post-publisher downloaded")
      }

      // 下载完成，初始化
      this.publishHook.doInit({
        isInitLocalStorage: true,
        // 桥接班禁用菜单插槽
        isInitSlot: false,
        isInitThemeAdaptor: true,
        isInitPublishHelper: true,
        isInitPicgoExtension: true,
        isInitCmder: true,
      })
    } catch (e) {
      this.logger.error("Failed to init sy-post-publisher，it may not work in some case.Error=>", e)
    }
  }

  private async doDownload() {
    this.logger.warn("Downloading sy-post-publisher from bazaar...")
    const url = "/api/bazaar/installBazaarWidget"
    const data = {
      repoURL: "https://github.com/terwer/sy-post-publisher",
      packageName: "sy-post-publisher",
      repoHash: this.REPO_HASH_0_8_0,
      mode: 0,
    }
    const fetchOps = {
      body: JSON.stringify(data),
      method: "POST",
    }
    const res = await fetch(url, fetchOps)
    const resJson = await res.json()
    if (resJson.code == 0) {
      this.logger.info("Download sy-post-publisher from bazaar success")
    } else {
      throw new Error("Download sy-post-publisher error, this plugin will not work!")
    }
  }
}

export default PublishBridge
