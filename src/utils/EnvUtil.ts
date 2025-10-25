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

/**
 * 环境工具类
 *
 * @author terwer
 * @since 1.38.0
 */
class EnvUtil {
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
}

export { EnvUtil }
