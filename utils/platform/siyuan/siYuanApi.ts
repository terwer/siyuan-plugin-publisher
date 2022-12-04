/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"
import { LogFactory } from "~/utils/logUtil"

/**
 * 思源API v2.5.0
 *
 * @author terwer
 * @date 2022-08-02 23:17
 *
 * https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md#%E9%89%B4%E6%9D%83
 */
export class SiYuanApi {
  private readonly logger = LogFactory.getLogger(
    "utils/platform/siyuan/siYuanApi.ts"
  )

  /**
   * 以id获取思源块信息
   * @param blockId 块ID
   */
  public async getBlockByID(blockId: string): Promise<any> {
    const stmt = `select *
                from blocks
                where id = '${blockId}'`
    const data = await this.sql(stmt)
    if (!data || data.length === 0) {
      throw new Error("通过ID查询块信息失败")
    }
    return data[0]
  }

  /**
   * 以sql发送请求
   * @param sql sql
   */
  public async sql(sql: string): Promise<any> {
    const sqldata = {
      stmt: sql,
    }
    const url = "/api/query/sql"
    return await this.siyuanRequest(url, sqldata)
  }

  /**
   * 向思源请求数据
   * @param url url
   * @param data 数据
   * @param method 请求方法 GET | POST
   * @param useToken 权限TOKEN
   */
  private async siyuanRequest(
    url: string,
    data: any,
    method?: string,
    useToken?: boolean
  ): Promise<any> {
    const siyuanCfg = getSiyuanCfg()

    if (siyuanCfg.baseUrl !== "") {
      url = siyuanCfg.baseUrl + url
    }

    let m = "POST"
    if (method != null) {
      m = method
    }

    const fetchOps = {
      body: JSON.stringify(data),
      method: m,
    }
    if (useToken !== false) {
      Object.assign(fetchOps, {
        headers: {
          Authorization: `Token ${siyuanCfg.token}`,
        },
      })
    }

    this.logger.info("开始向思源请求数据，url=>", url)
    this.logger.info("开始向思源请求数据，fetchOps=>", fetchOps)
    const response = await fetch(url, fetchOps)
    const resJson = await response.json()
    this.logger.info("思源请求数据返回，resJson=>", resJson)

    if (resJson.code === -1) {
      throw new Error(resJson.msg)
    }
    return resJson.code === 0 ? resJson.data : null
  }
}
