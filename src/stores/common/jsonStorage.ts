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

import { StorageLike } from "@vueuse/core"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { SiyuanDevice } from "zhi-device"
import { JsonUtil } from "zhi-common"

/**
 * JSON 同步存储实现，实现了 `StorageLikeAsync` 接口。
 * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L11
 *
 * @author terwer
 * @version 1.17.0
 * @since 1.17.0
 */
class JsonStorage implements StorageLike {
  private readonly logger: any
  private readonly fs: any
  private readonly path: any
  private readonly filePath: string

  constructor(filePath: string) {
    this.logger = createAppLogger("json-storage")

    // 动态导入依赖
    const win = SiyuanDevice.siyuanWindow()
    this.fs = win.require("fs")
    this.path = win.require("path")

    // 确保文件存在
    const basePath = win?.siyuan.config.system.dataDir
    this.filePath = this.path.join(basePath, filePath)
    const storeDir = this.path.dirname(this.filePath)
    this.logger.info("store dir =>", storeDir)
    // 确保有目录
    if (!this.fs.existsSync(storeDir)) {
      this.fs.mkdirSync(storeDir)
    }
    // 确保文件已经初始化
    if (!this.fs.existsSync(this.filePath)) {
      this.writeFile({})
    }
    this.logger.info("ininted json local storage in =>", this.filePath)
  }

  /**
   * 获取存储中的项目
   *
   * @param {string} key - 存储项的键名
   * @returns {string | null} - 如果找到存储项，将返回其值；否则返回 null
   */
  public getItem(key: string): string | null {
    // this.logger.info("get item from json")
    return this.getStoredItems()[key] || null
  }

  /**
   * 设置存储项的值
   *
   * @param {string} key - 存储项的键名
   * @param {string} value - 要存储的值
   */
  public setItem(key: string, value: string): void {
    // this.logger.info("set item from json")
    const obj = this.getStoredItems()
    obj[key] = value
    this.writeFile(obj)
  }

  /**
   * 从存储中移除指定的项
   *
   * @param {string} key - 要移除的存储项的键名
   */
  public removeItem(key: string): void {
    // this.logger.info("removeItem item from json")
    const obj = this.getStoredItems()
    delete obj[key]
    this.writeFile(obj)
  }

  // ================
  // private methods
  // ================
  private getStoredItems() {
    return JsonUtil.safeParse<any>(this.readFile(), {})
  }

  private readFile() {
    return this.fs.readFileSync(this.filePath, this.getFileOptions())
  }

  private writeFile(obj) {
    return this.fs.writeFileSync(this.filePath, JSON.stringify(obj), this.getFileOptions())
  }

  private getFileOptions() {
    return { encoding: "utf8" } as any
  }
}

export default JsonStorage
