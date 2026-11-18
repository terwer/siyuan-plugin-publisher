/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { AliasTranslator } from "zhi-common"
import sypIdUtil from "~/src/utils/sypIdUtil"

/**
 * Halo 平台工具类
 *
 * @author terwer
 * @version 1.15.0
 * @since 1.15.0
 */
class HaloUtils {
  /**
   * 与 Halo 控制台 short-unique-id 默认字典一致，用于生成 Short UUID 别名
   */
  private static readonly SHORT_UUID_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

  /**
   * 将正文 h1-h6的标签加上 id，例如 <h1 xxx>标题1</h1> 转换成 <h1 id="标题1">标题1</h1>
   *
   * @param content
   */
  public static addIdToH1_H6(content: string): string {
    return content.replace(/<h([1-6])>(.*?)<\/h\1>/g, function (match, level, title) {
      // 直接使用标题作为 ID
      const id = title
      return `<h${level} id="${id}">${title}</h${level}>`
    })
  }

  /**
   * 按 Halo 站点「别名生成策略」生成默认别名。
   *
   * Halo 的别名策略由控制台在新建文章时生成，接口不会自动补齐，因此插件需要
   * 按同样的四种策略自行生成。未知/旧版策略回退到插件既有的按标题生成规则。
   *
   * @param title - 文章标题
   * @param strategy - Halo globalinfo 返回的 postSlugGenerationStrategy
   */
  public static async generateSlug(title: string, strategy?: string): Promise<string> {
    switch ((strategy ?? "").toLowerCase()) {
      case "uuid":
        return sypIdUtil.newUuid()
      case "shortuuid":
        return HaloUtils.shortUuid()
      case "timestamp":
        return Date.now().toString()
      case "generatebytitle":
      default:
        // 保持插件既有标题别名规则（标题 + 唯一后缀），避免老站点行为变化
        return await AliasTranslator.getPageSlug(title, true)
    }
  }

  /**
   * 生成 8 位字母数字别名，对应 Halo 的 Short UUID 策略
   */
  private static shortUuid(length = 8): string {
    const alphabet = HaloUtils.SHORT_UUID_ALPHABET
    const bytes = new Uint8Array(length)
    const cryptoApi = globalThis.crypto

    if (cryptoApi?.getRandomValues) {
      cryptoApi.getRandomValues(bytes)
    } else {
      for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256)
      }
    }

    let slug = ""
    for (let i = 0; i < length; i++) {
      slug += alphabet[bytes[i] % alphabet.length]
    }
    return slug
  }
}

export default HaloUtils
