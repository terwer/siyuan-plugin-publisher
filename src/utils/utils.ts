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

import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { BlogAdaptor, WebAdaptor } from "zhi-blog-api"
import { StrUtil } from "zhi-common"

/**
 * 通用工具类
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export class Utils {
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
