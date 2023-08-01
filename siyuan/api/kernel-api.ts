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

import { BaseApi } from "./base-api"
import { siyuanApiToken, siyuanApiUrl } from "../Constants"

/**
 * 思源笔记服务端API v2.8.9
 *
 * @see {@link https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md API}
 *
 * @author terwer
 * @version 0.0.1
 * @since 0.0.1
 */
class KernelApi extends BaseApi {
  /**
   * 读取文件
   *
   * @param path - 文件路径，例如：/data/20210808180117-6v0mkxr/20200923234011-ieuun1p.sy
   * @param type - 类型
   */
  public async getFile(path: string, type: "text" | "json") {
    const response = await fetch(`${siyuanApiUrl}/api/file/getFile`, {
      method: "POST",
      headers: {
        Authorization: `Token ${siyuanApiToken}`,
      },
      body: JSON.stringify({
        path: path,
      }),
    })
    if (response.status === 200) {
      if (type === "text") {
        return await response.text()
      }
      if (type === "json") {
        return await response.json()
      }
    }
    return null
  }
}

export default KernelApi
