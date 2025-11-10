/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { BlogAdaptor, WebAdaptor } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import pkg from "../../package.json"

/**
 * 通用工具类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class Utils {
  private static logger = createAppLogger("publisher-widget-utils")

  public static blogApi(appInstance: PublisherAppInstance, apiAdaptor: any) {
    if (!apiAdaptor) {
      throw new Error("apiAdaptor cannot be null")
    }

    if (!apiAdaptor.getUsersBlogs) {
      this.logger.error("apiAdaptor must implements BlogApi", apiAdaptor)
      throw new Error(`apiAdaptor must implements BlogApi => ${this.getObjectName(apiAdaptor)}`)
    }

    return new BlogAdaptor(apiAdaptor)
  }

  public static webApi(appInstance: PublisherAppInstance, webAdaptor: any) {
    if (!webAdaptor) {
      throw new Error("webAdaptor cannot be null")
    }

    if (!webAdaptor.getMetaData) {
      this.logger.error("webAdaptor must implements WebApi", webAdaptor)
      throw new Error(`webAdaptor must implements WebApi => ${this.getObjectName(webAdaptor)}`)
    }

    return new WebAdaptor(webAdaptor)
  }

  private static getObjectName(obj) {
    try {
      // 判断是否为类
      if (typeof obj === "function" && /^class\s/.test(obj.toString())) {
        return obj.name
      }
      // 判断是否为函数
      else if (typeof obj === "function") {
        return obj.name || "anonymous function"
      }
      // 判断是否为枚举
      else if (typeof obj === "object" && Object.values(obj.constructor).includes(obj)) {
        return Object.keys(obj.constructor)[Object.values(obj.constructor).indexOf(obj)]
      }
      // 判断是否为属性
      else if (typeof obj !== "object") {
        return obj
      }
      // 默认返回空字符串
      else {
        return "{}"
      }
    } catch (e) {
      console.error(e)
      return "{}"
    }
  }

  public static emptyOrDefault(value: any, defaultValue: any) {
    if (typeof value === "string") {
      value = value.trim()
    }
    return StrUtil.isEmptyString(value) ? defaultValue : value
  }

  public static emptyBooleanOrDefault(value: any, defaultValue: any) {
    if (typeof value === "undefined") {
      return defaultValue
    }
    return value
  }
}

export { Utils }
export { pkg }
