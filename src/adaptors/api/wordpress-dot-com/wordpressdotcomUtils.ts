/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 用于处理 WordPress.com 相关操作的实用工具类
 */
class WordpressdotcomUtils {
  private static logger = createAppLogger("wordpress-dot-com-utils")

  /**
   * 解析给定的主页地址并生成相应的apiUrl地址
   *
   * @param home - 主页地址
   */
  public static parseHomeAndUrl(home: string): { home: string; apiUrl: string } {
    this.logger.debug(`Parsing Home address: ${home}`)
    // 解析主页地址
    let apiUrl = ""
    if (home.endsWith("/xmlrpc.php")) {
      apiUrl = home
      home = home.replace("/xmlrpc.php", "")
    } else {
      home = home.replace(/\/$/, "")
      apiUrl = `${home}/xmlrpc.php`
    }

    this.logger.debug(`Parse result: home=${home}, apiUrl=${apiUrl}`)
    return { home, apiUrl }
  }
}

export default WordpressdotcomUtils
