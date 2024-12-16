/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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
}

export { BilibiliUtils }
