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

import { StrUtil } from "zhi-common"

/**
 * 页面辅助函数
 *
 * @author terwer
 * @since 1.18.0
 */
class CrossPageUtils {
  /**
   * 缩略展示平台名称
   *
   * @param platformName
   * @param length
   */
  public static subPlatformName(platformName: string, length?: number) {
    if (StrUtil.isEmptyString(platformName)) {
      return ""
    }
    if (!platformName.includes("_")) {
      return this.shortPlatformName(platformName, length ?? 9)
    }
    return StrUtil.upperFirst(StrUtil.getByLength(platformName.split("_")[1], length ?? 9))
  }

  /**
   * 缩略展示平台名称
   *
   * @param platformName
   * @param length
   */
  public static shortPlatformName(platformName: string, length?: number) {
    if (StrUtil.isEmptyString(platformName)) {
      return ""
    }
    return StrUtil.upperFirst(StrUtil.getByLength(platformName.replace("Gitlab", ""), length ?? 9))
  }

  /**
   * 缩略展示平台名称
   *
   * @param platformName
   * @param length
   */
  public static longPlatformName(platformName: string, length?: number) {
    if (StrUtil.isEmptyString(platformName)) {
      return ""
    }
    const shortName = StrUtil.upperFirst(StrUtil.getByLength(platformName.replace("Gitlab", ""), length ?? 9))
    if (platformName.includes("Gitlab")) {
      return `Gitlab-${shortName}`
    }
    return shortName
  }
}

export default CrossPageUtils
