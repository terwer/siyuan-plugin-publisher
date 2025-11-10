/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BilibiliMdUtil } from "~/src/adaptors/web/bilibili/bilibiliMdUtil.ts"

/**
 * B站辅助工具类
 *
 * @since 1.31.0
 * @author terwer
 */
class BilibiliUtils {
  // 使用箭头函数定义 genUploadId
  public static genUploadId(prefix = 0) {
    // 获取当前时间戳（秒级）
    const timestamp = Math.floor(Date.now() / 1000)
    // 生成 0 到 9999 的随机整数
    const randomNumber = Math.floor(Math.random() * 10000)
    // 返回生成的 ID
    return `${prefix}_${timestamp}_${randomNumber}`
  }

  /**
   * 解析 markdown 为 bilbili 节点
   *
   * @param md
   */
  public static parseMd(md: string) {
    return BilibiliMdUtil.md2bilbiliNodes(md)
  }
}

export { BilibiliUtils }
