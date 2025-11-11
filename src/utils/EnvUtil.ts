/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SiyuanDevice } from "zhi-device"
import { StrUtil } from "zhi-common"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Buffer } from "node:buffer"

/**
 * 环境工具类
 *
 * @author terwer
 * @since 1.38.0
 */
class EnvUtil {
  private static logger = createAppLogger("env-util")

  /**
   * 是否是思源Electron环境
   */
  public static isSiyuanElectron(): boolean {
    const win = SiyuanDevice.siyuanWindow()
    const nodeVersion = win?.process?.versions?.node
    const electron = win?.process?.versions?.electron
    return !StrUtil.isEmptyString(nodeVersion) && !StrUtil.isEmptyString(electron)
  }

  public static getHomeFolder(): string {
    const win = SiyuanDevice.siyuanWindow()
    return win?.siyuan?.config?.system?.homeDir ?? ""
  }

  public static ensurePath(path: string): boolean {
    try {
      const win = SiyuanDevice.siyuanWindow()
      if (!win?.fs) {
        this.logger.warn("file system module not available")
        return false
      }
      const fs = win.fs
      const pathModule = win.require("path")
      // 标准化路径
      const normalizedPath = pathModule.normalize(path)
      // 检查路径是否存在
      if (!fs.existsSync(normalizedPath)) {
        // 递归创建目录
        fs.mkdirSync(normalizedPath, { recursive: true })
        this.logger.debug(`created directory: ${normalizedPath}`)
      }
      return true
    } catch (e) {
      this.logger.error(`check path failed for "${path}":`, e)
      return false
    }
  }

  /**
   * 写入文件内容（假设目录已存在）
   * @param filePath 文件完整路径
   * @param content 文件内容
   */
  public static writeFile(filePath: string, content: string): boolean {
    try {
      const win = SiyuanDevice.siyuanWindow()
      if (!win?.fs) {
        this.logger.warn("file system module not available")
        return false
      }

      const fs = win.fs
      const pathModule = win.require("path")
      const normalizedPath = pathModule.normalize(filePath)

      // 直接写入文件
      fs.writeFileSync(normalizedPath, content, "utf-8")
      this.logger.debug(`file written: ${normalizedPath}`)
      return true
    } catch (e) {
      this.logger.error(`failed to write file "${filePath}":`, e)
      return false
    }
  }

  /**
   * 删除文件
   * @param filePath 文件路径
   */
  public static deleteFile(filePath: string): boolean {
    try {
      const win = SiyuanDevice.siyuanWindow()
      if (!win?.fs) {
        this.logger.warn("file system module not available")
        return false
      }

      const fs = win.fs
      const pathModule = win.require("path")
      const normalizedPath = pathModule.normalize(filePath)

      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath)
        this.logger.debug(`file deleted: ${normalizedPath}`)
        return true
      }

      this.logger.warn(`file not found, skip deletion: ${normalizedPath}`)
      return false
    } catch (e) {
      this.logger.error(`failed to delete file "${filePath}":`, e)
      return false
    }
  }

  /**
   * 写入二进制文件
   *
   * @param filePath 文件完整路径
   * @param data 二进制数据 (Uint8Array)
   */
  public static writeBinaryFile(filePath: string, data: Uint8Array): boolean {
    try {
      const win = SiyuanDevice.siyuanWindow()
      if (!win?.fs) {
        this.logger.warn("File system module not available")
        return false
      }

      const fs = win.fs
      const pathModule = win.require("path")
      const normalizedPath = pathModule.normalize(filePath)

      // 确保文件所在目录存在
      const dir = this.dirname(normalizedPath)
      if (!this.ensurePath(dir)) {
        return false
      }

      // 将Uint8Array转换为Buffer
      const buffer = Buffer.from(data)
      fs.writeFileSync(normalizedPath, buffer)
      this.logger.debug(`Binary file written: ${normalizedPath} (${buffer.length} bytes)`)
      return true
    } catch (e) {
      this.logger.error(`Failed to write binary file "${filePath}":`, e)
      return false
    }
  }

  /**
   * 获取文件所在目录
   * @param filePath 文件路径
   */
  public static dirname(filePath: string): string {
    try {
      const win = SiyuanDevice.siyuanWindow()
      if (!filePath) {
        return ""
      }
      if (!win?.require) {
        return filePath.substring(0, filePath.lastIndexOf("/"))
      }

      const pathModule = win.require("path")
      return pathModule.dirname(filePath)
    } catch (e) {
      this.logger.error("Path dirname failed, using fallback:", e)
      if (!filePath) {
        return ""
      }
      return filePath.substring(0, filePath.lastIndexOf("/"))
    }
  }

  /**
   * 清理文件名中的非法字符
   *
   * @param filename 原始文件名
   * @returns 安全的文件名
   */
  public static sanitizeFilename(filename: string): string {
    return filename.replace(/[\\/:*?"<>|]/g, "_")
  }

  /**
   * 拼接文件路径
   *
   * @param parts 路径组成部分
   */
  public static joinPath(...parts: string[]): string {
    try {
      const win = SiyuanDevice.siyuanWindow()
      if (!win?.require) {
        return parts.join("/")
      }

      const pathModule = win.require("path")
      return pathModule.join(...parts)
    } catch (e) {
      this.logger.error("path join failed, using fallback:", e)
      return parts.join("/")
    }
  }
}

export { EnvUtil }
