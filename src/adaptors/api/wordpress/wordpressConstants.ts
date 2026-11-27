/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 预定义 WordPress 变量
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class WordpressConstants {
  /**
   * WordPress 自定义字段名：保存来源思源文档 ID。
   *
   * 与 issue #1638 中用户期望的 `meta.siyuanid` 对应；XML-RPC 通过
   * `custom_fields` 写入同一份 post meta。
   */
  public static readonly SIYUAN_ID_META_KEY = "siyuanid"
}

export { WordpressConstants }
