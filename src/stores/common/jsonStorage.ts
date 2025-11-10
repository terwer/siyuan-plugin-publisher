/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
