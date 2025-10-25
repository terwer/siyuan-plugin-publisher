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
}

export { EnvUtil }
